---
title: Servicio de notificaciones
---

# Vista general

El servicio de notificaciones es el microservicio encargado de recibir eventos de otros servicios, transformarlos en notificaciones persistentes, y entregarlas a los usuarios mediante notificaciones push. Este servicio maneja el ciclo completo de las notificaciones, desde la recepción de eventos hasta la entrega en dispositivos móviles. Sus responsabilidades principales son:

- Recepción de eventos mediante webhooks.
- Persistencia del historial de notificaciones.
- Gestión de preferencias por usuario.
- Entrega de notificaciones push mediante OneSignal.
- Procesamiento idempotente de eventos.

## Arquitectura

El servicio de notificaciones implementa una [[Arquitectura|arquitectura]] basada en el patrón Webhook, donde expone un endpoint POST que recibe eventos de los [[Servicio de usuarios|servicios de usuario]] y catálogo. Estos servicios funcionan como `producers` y el servicio de notificaciones como `consumer`, procesando eventos de manera asíncrona.

![Arquitectura del Notification Service](Servicios/assets/notification-service-arq.png)

El flujo principal es el siguiente:

1. **Recepción de eventos**: Los servicios productores envían eventos al endpoint `/webhook/events`.
2. **Procesamiento asíncrono**: El evento se procesa en background, retornando `202 Accepted` inmediatamente.
3. **Fan-out**: Se determina qué usuarios deben recibir la notificación basándose en el grafo de seguidores.
4. **Filtrado de preferencias**: Se aplican las preferencias de notificación de cada usuario.
5. **Persistencia**: Se guardan las notificaciones en MongoDB.
6. **Entrega push**: Se envían notificaciones push a través de OneSignal.

Los eventos que pueden generar notificaciones incluyen:

- Creación de una playlist.
- Publicación de una collection.
- Nuevo seguidor.

## Tecnologías

Las tecnologías empleadas fueron las siguientes:

*   **FastAPI**: Framework principal para el desarrollo del servicio. Se eligió Python y FastAPI por su excelente soporte para operaciones asíncronas y su simplicidad para desarrollo rápido, complementando el stack de Java usado en otros microservicios.
*   **MongoDB**: Base de datos NoSQL para persistencia de notificaciones e historial.
*   **Beanie**: ODM (Object Document Mapper) asíncrono para MongoDB, facilitando el trabajo con documentos de manera type-safe.
*   **OneSignal**: Servicio externo para el envío de notificaciones push a dispositivos móviles (iOS y Android).
*   **httpx**: Cliente HTTP asíncrono para comunicación con OneSignal y otros servicios.

## Decisiones de Diseño

### Sistema de Webhooks vs Pub/Sub

> [!IMPORTANT]
> Se optó por un sistema de webhooks directo en lugar de utilizar GCP Pub/Sub para la comunicación entre servicios.

**Justificación**: Durante el diseño inicial del sistema, se consideró utilizar GCP Pub/Sub dado que ya se estaba usando Google Cloud Platform para el deployment de los servicios. Sin embargo, se decidió implementar una solución más directa basada en webhooks HTTP por las siguientes razones:

*   **Simplicidad de implementación**: Los webhooks son más sencillos de implementar y debuggear, especialmente en un contexto académico.
*   **Scope del proyecto**: Para el alcance de la materia, un sistema de webhooks es suficiente y evita la complejidad adicional de configurar y mantener Pub/Sub.
*   **Menor overhead operacional**: No requiere gestión de topics, subscriptions, ni configuración adicional de infraestructura.
*   **Volumen esperado**: El volumen de eventos esperado no justifica la complejidad de un sistema de mensajería distribuido.


### Estrategia de Reintentos y Resiliencia

El servicio implementa una estrategia de reintentos para el envío de notificaciones push:

*   **Backoff exponencial con jitter**: Los reintentos utilizan un delay exponencial con variación aleatoria para evitar sincronización de reintentos y sobrecarga del proveedor.
*   **Reintentos inteligentes**: Se reintenta solo en errores 5xx y 429 (rate limit), pero no en errores 4xx (errores de cliente).
*   **Batching**: Las notificaciones se envían en lotes de hasta 2000 destinatarios por request, respetando los límites de OneSignal.
*   **Modo STUB**: El servicio detecta automáticamente si OneSignal no está configurado y entra en modo stub, facilitando el desarrollo local sin credenciales externas.

### Procesamiento Idempotente

El servicio implementa idempotencia para evitar procesar eventos duplicados, lo cual es crítico cuando los webhooks pueden ser reenviados por los servicios productores en caso de timeouts o errores de red. Cada evento se identifica por su `event_id` único, y eventos duplicados se ignoran automáticamente.

## Base de Datos

### Elección de MongoDB

> [!NOTE]
> MongoDB fue seleccionado como base de datos principal y única para este microservicio.

**Justificación**: MongoDB es ideal para el servicio de notificaciones debido a:

*   **Naturaleza documental**: Las notificaciones son entidades independientes con estructura flexible que se modelan naturalmente como documentos JSON.
*   **Escrituras frecuentes**: El servicio recibe un alto volumen de escrituras (nuevas notificaciones) que MongoDB maneja eficientemente.
*   **Consultas por usuario**: Las consultas principales son lecturas por `user_id` con ordenamiento temporal, un patrón que MongoDB optimiza muy bien con índices apropiados.
*   **No requiere JOINs complejos**: Las notificaciones no tienen relaciones complejas que requieran integridad referencial estricta.
*   **Escalabilidad horizontal**: MongoDB facilita el sharding por `user_id` si el volumen crece significativamente en el futuro.

A diferencia del [[Servicio de usuarios|servicio de usuarios]] que requiere transacciones ACID y relaciones complejas (followers, tokens, perfiles), el servicio de notificaciones se beneficia más de la flexibilidad y performance de escritura que ofrece MongoDB.

## Seguridad entre Servicios

> [!NOTE]
> El endpoint `/webhook/events` actualmente no implementa autenticación entre servicios internos.

**Limitación conocida**: Los webhooks internos (UserService → NotificationService, CatalogService → NotificationService) no están protegidos con autenticación. Esto significa que cualquier cliente que conozca la URL del endpoint podría enviar eventos.

**Justificación**: Esta limitación fue aceptada conscientemente por estar fuera del scope de la materia. El enfoque del proyecto está en la funcionalidad de negocio y la arquitectura de microservicios, no en seguridad avanzada entre servicios.

**Mejora futura**: En un entorno de producción real, se debería implementar posiblemente la siguiente solucion:

**JWT entre servicios**: Utilizar tokens JWT específicos para comunicación service-to-service.

Por ahora, la seguridad se basa en que los endpoints internos no están expuestos públicamente y solo son accesibles dentro de la red privada de los servicios.
