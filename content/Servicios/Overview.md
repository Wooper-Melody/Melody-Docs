---
title: Vista General
---

Cada servicio tiene su propia documentación en los siguientes enlaces:

- [[Servicio de notificaciones]]
- [[Servicio de usuarios]]
- [[Servicios/Catalogo/summary|Servicio de catálogo]]

## Arquitectura

Se implementó una arquitectura dentro de cada servicio basada en capas, siguiendo el patrón **Controller-Service-Repository**:

- **Controller**: Se encarga de recibir las peticiones HTTP del frontend (a través del API Gateway), validar los parámetros de entrada y redirigirlas a los servicios internos correspondientes. Actúa como la capa de presentación y no contiene lógica de negocio.

- **Service**: Se encarga de la lógica del negocio, incluyendo validaciones, transformaciones de datos, reglas de negocio y orquestación de operaciones. Esta capa es independiente de cómo se accede a los datos o cómo se exponen las APIs.

- **Repository**: Se encarga de la persistencia y búsqueda de datos en las bases de datos o de la comunicación con otros servicios desplegados. Abstrae los detalles de acceso a datos, permitiendo cambiar la implementación sin afectar la lógica de negocio.

### ¿Por qué esta arquitectura?

Esta separación en capas fue elegida por varios motivos importantes:

1. **Separación de responsabilidades**: Cada capa tiene una responsabilidad única y bien definida, lo que facilita el mantenimiento y la comprensión del código. La lógica de negocio está aislada de los detalles de implementación de la API y de la persistencia.

2. **Testabilidad**: Esta arquitectura facilita enormemente las pruebas unitarias. Cada capa puede ser testeada de forma independiente:
   - Los controllers pueden testearse con mocks de servicios
   - Los servicios pueden testearse con mocks de repositorios
   - Los repositorios pueden testearse con bases de datos en memoria o mocks

3. **Flexibilidad y evolución**: Al tener las capas bien separadas, es posible cambiar la implementación de una capa sin afectar a las demás. Por ejemplo:
   - Se puede cambiar la base de datos (de PostgreSQL a otra) modificando solo el Repository
   - Se puede cambiar la forma de exponer la API (de REST a GraphQL) modificando solo el Controller
   - Se puede refactorizar la lógica de negocio sin tocar la persistencia o la API

4. **Reutilización**: La lógica de negocio en la capa Service puede ser reutilizada desde diferentes puntos de entrada (diferentes controllers, jobs, comandos, etc.) sin duplicar código.

5. **Mantenibilidad**: Cuando hay un bug o se necesita agregar una nueva funcionalidad, es más fácil identificar dónde hacer los cambios. La estructura clara reduce el tiempo de desarrollo y debugging.

6. **Escalabilidad del equipo**: Diferentes desarrolladores pueden trabajar en diferentes capas sin conflictos frecuentes, ya que las interfaces entre capas están bien definidas. 

## Bases de Datos

Cada servicio tiene la responsabilidad de gestionar su propia base de datos. Esta es una característica fundamental de la arquitectura de microservicios conocida como **Database per Service**.

### ¿Por qué cada servicio tiene su propia base de datos?

Esta decisión arquitectónica fue tomada por las siguientes razones:

1. **Independencia y autonomía**: Cada servicio es completamente independiente en términos de datos. Puede elegir la base de datos más adecuada para su caso de uso específico:
   - El [[Servicio de usuarios]] y [catálogo](Servicios/Catalogo/summary.md) utilizan **PostgreSQL** para datos relacionales estructurados
   - El [servicio de catálogo](Servicios/Catalogo/summary.md) también utiliza **MongoDB** para métricas que requieren flexibilidad en el esquema
   - El [[Servicio de notificaciones]] utiliza **MongoDB** para almacenar notificaciones con estructuras variables

2. **Escalabilidad independiente**: Cada base de datos puede escalarse de forma independiente según la demanda de su servicio. No hay riesgo de que un servicio con alta carga afecte el rendimiento de otros servicios.

3. **Evolución del esquema**: Cada servicio puede evolucionar su esquema de base de datos sin afectar a otros servicios. Esto permite iterar y mejorar cada servicio sin coordinación compleja entre equipos.

4. **Tecnología adecuada**: Permite usar la tecnología de base de datos más apropiada para cada caso de uso, optimizando rendimiento y costos.

5. **Aislamiento de fallos**: Si una base de datos tiene problemas, solo afecta a su servicio correspondiente, no a todo el sistema.

6. **Despliegue independiente**: Los cambios en el esquema de una base de datos no requieren coordinar despliegues con otros servicios.

### Implicaciones de esta arquitectura

Esta separación de bases de datos tiene algunas implicaciones importantes:

- **Llamadas entre servicios**: En algunas requests es necesario llamar a otros servicios para obtener datos que están en sus bases de datos. Por ejemplo, si el servicio de catálogo necesita información de usuario, debe hacer una llamada REST al servicio de usuarios.

- **Diseño cuidadoso de límites**: Es crucial diseñar bien los límites de cada servicio y qué datos pertenecen a cada uno para minimizar las llamadas entre servicios y mantener un buen rendimiento.

- **Gestión de datos duplicados**: En algunos casos puede ser necesario duplicar ciertos datos entre servicios para mejorar el rendimiento, lo que requiere estrategias de sincronización. Un buen ejemplo de esto es en métricas o con datos de los usuarios en el catálogo. 

## Comunicación entre Servicios

Los servicios se comunican entre sí mediante dos mecanismos principales:

### APIs REST (Comunicación Síncrona)

La mayoría de las comunicaciones entre servicios se realizan mediante **APIs REST** con llamadas síncronas. Este enfoque fue elegido porque:

- **Simplicidad**: REST es un estándar ampliamente conocido y fácil de implementar
- **Claridad**: Las llamadas síncronas hacen que el flujo de datos sea más fácil de seguir y debuggear
- **Inmediatez**: Cuando un servicio necesita datos de otro, obtiene una respuesta inmediata
- **Compatibilidad**: Funciona bien con HTTP/HTTPS estándar y es compatible con cualquier lenguaje de programación

**Ejemplo de uso**: Cuando el [servicio de catálogo](Servicios/Catalogo/summary.md) necesita información de un usuario si sigue a otro, realiza una llamada REST síncrona al [[Servicio de usuarios]] para el home.

### Webhooks (Comunicación Asíncrona)

Para ciertos casos de uso, especialmente eventos que no requieren una respuesta inmediata, se utiliza **webhooks** para comunicación asíncrona. Este patrón es utilizado principalmente por el servicio de notificaciones.

**Ventajas de los webhooks**:
- **Desacoplamiento**: El servicio que envía el evento no necesita esperar a que el receptor lo procese
- **Resiliencia**: Si el servicio receptor está temporalmente no disponible, el evento puede ser reintentado
- **Escalabilidad**: Permite que múltiples servicios puedan reaccionar al mismo evento sin bloquearse entre sí
- **Eficiencia**: No bloquea el servicio emisor mientras se procesa el evento

**Ejemplo de uso**: Cuando se crea una nueva playlist o un [[Servicio de usuarios#Sistema de Follow/Unfollow|usuario sigue a otro]], el servicio correspondiente envía un webhook al [[Servicio de notificaciones]], que procesa el evento de forma asíncrona para generar y enviar notificaciones.

> Algunos servicios tienen integraciones externas que se detallan en la documentación de cada servicio. 


## Lenguajes Utilizados

### Java Spring Boot

Tanto el [[Servicio de usuarios]] como el [servicio de catálogo](Servicios/Catalogo/summary.md#tecnologías-utilizadas) son desarrollados en **Java con Spring Boot**. Estos dos fueron los primeros servicios desarrollados y se eligió esta combinación de tecnologías por las siguientes razones:

1. **Facilidad de desarrollo**: Spring Boot está específicamente diseñado para resolver rápidamente problemas comunes en el desarrollo de aplicaciones empresariales. Muchas funcionalidades están disponibles como "plug and play", lo que acelera significativamente el desarrollo. Nos ayudó muchísimo para empezar a tener la API REST funcionando rápidamente.

2. **Middlewares integrados**: Spring Boot proporciona una amplia gama de middlewares pre-configurados que se pueden activar fácilmente. Esto incluye manejo de CORS, logging, validación, manejo de excepciones, y más, sin necesidad de configuraciones complejas.

3. **Autenticación y seguridad**: Spring Security ofrece una solución robusta y completa para autenticación y autorización que se integra de manera sencilla. Permite implementar JWT, OAuth2, y otros mecanismos de seguridad con configuración mínima.

4. **APIs REST simplificadas**: Spring Boot facilita enormemente la creación de APIs REST. Con anotaciones simples como `@RestController`, `@RequestMapping`, y `@RequestBody`, se pueden crear endpoints REST completos con validación automática, serialización/deserialización JSON, y manejo de errores.

5. **Servicios y dependencias**: El sistema de inyección de dependencias de Spring permite crear servicios reutilizables y testables de manera sencilla. La gestión del ciclo de vida de los componentes es automática.

6. **Experiencia del equipo**: El equipo ya tenía experiencia previa con Java y Spring Boot en proyectos anteriores, lo que redujo la curva de aprendizaje y permitió comenzar el desarrollo más rápidamente.

7. **Ecosistema maduro**: Spring Boot tiene un ecosistema muy maduro con una gran cantidad de bibliotecas, documentación extensa, y una comunidad activa que facilita la resolución de problemas.

### Python FastAPI

Por otro lado, para el [[Servicio de notificaciones]] se eligió **Python con FastAPI**. Esta decisión fue tomada por las siguientes razones:

1. **Simpleza y rapidez**: FastAPI es un framework moderno y minimalista que permite desarrollar APIs REST de manera muy rápida y sencilla. Su sintaxis es clara y expresiva, lo que facilita la lectura y mantenimiento del código.

2. **Servicio pequeño y bien definido**: El servicio de notificaciones tiene una responsabilidad bien definida y es relativamente pequeño en comparación con los otros servicios. FastAPI es ideal para este tipo de servicios que no requieren toda la complejidad y características de un framework más pesado como Spring Boot.

3. **Documentación automática**: FastAPI genera automáticamente documentación interactiva (Swagger/OpenAPI) basada en el código, lo que facilita el testing y la integración con otros servicios.

4. **Validación de datos**: Integra Pydantic para validación automática de datos de entrada y salida, lo que reduce la cantidad de código boilerplate necesario.

5. **Diversidad tecnológica**: Utilizar diferentes lenguajes permite aprovechar las fortalezas de cada uno según el caso de uso, y también proporciona flexibilidad al equipo para elegir la mejor herramienta para cada tarea. 


## Documentación de APIs

Al utilizar FastAPI y SwaggerUI con spring boot, pudimos generar la documentación de manera sencilla y efectiva. Se tiene entonces un swagger por cada servicio. 

Como se menciono en [Api-Gateway](Arquitectura/API-Gateway.md#documentación), se tiene un portal de desarrollador en el que se puede acceder a la documentación de los servicios que utilizan estos swaggers de los diferentes servicios. 

> Notar que los swaggers existen también en cada servicio y estan disponibles. Por ejemplo [Swagger-Users-Service](https://userservice-633410389016.southamerica-east1.run.app/swagger-ui/index.html#)

