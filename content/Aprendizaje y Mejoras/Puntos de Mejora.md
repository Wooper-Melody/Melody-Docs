---
title: Puntos de Mejora
---

Este documento recopila las mejoras identificadas durante el desarrollo del proyecto, organizadas por área de impacto. Estas mejoras representan oportunidades de optimización técnica, arquitectónica y de negocio que podrían implementarse en futuras iteraciones del sistema.

> [!WARNING]
> **Mejoras Críticas Sensibles**: Existen dos mejoras que requieren atención prioritaria debido a su impacto en la integridad de los datos y la estabilidad del sistema:
> 
> 1. **Gestión de Borrados de Administrador**: El sistema actual de borrados tiene inconsistencias que pueden dejar la base de datos en estados inválidos (ver sección [[#gestión-de-borrados|Gestión de Borrados]]). Esto puede resultar en datos huérfanos, referencias rotas y problemas de integridad referencial.
> 
> 2. **Validación de Archivos Multimedia**: La falta de validación adecuada de tamaño y formato de archivos multimedia puede resultar en valores inválidos tanto en la base de datos como en Firebase Storage, causando errores en la aplicación y posibles problemas de rendimiento (ver sección [[#validaciones|Validaciones]]).
> 
> Estas mejoras deberían considerarse de alta prioridad antes de escalar el sistema o exponerlo a un mayor volumen de usuarios.

## Mejoras a Nivel Arquitectónico

Las siguientes mejoras están orientadas a mejorar la arquitectura general del sistema, la separación de responsabilidades y la seguridad.

### Separación de Servicios

- **Servicio de Métricas independiente**: Actualmente el [[Servicios/Catalogo/Metricas|servicio de métricas]] está integrado dentro del [[Servicios/Catalogo/summary|servicio de catálogo]]. Separarlo en un servicio independiente simplificaría significativamente la arquitectura y el mantenimiento, permitiendo escalabilidad independiente y una separación de responsabilidades más clara.

- **Cron job independiente para publicación de colecciones**: Desacoplar el proceso de publicación de colecciones de la instancia principal del servicio de catálogo mediante un cron job independiente. Esto mejoraría la resiliencia del sistema y permitiría escalar el procesamiento de publicaciones de forma independiente.

### Seguridad

- **Autenticación en el API Gateway con GCP**: Implementar autenticación a nivel del gateway utilizando servicios de Google Cloud Platform para centralizar y fortalecer la seguridad de acceso a los servicios. Se implementó la funcionalidad para reconocer en el gateway el token de GCP como IAM, pero se decidió no utilizarla para agilizar el desarrollo y evitar la complejidad de gestionar los permisos. Esta funcionalidad debería activarse en un entorno de producción. 

- **Mejoras en Firebase Storage**: Implementar mejores permisos y validaciones en Firebase Storage para garantizar que solo usuarios autorizados puedan acceder y modificar los recursos almacenados. Actualmente solo se validan los cambios de foto de perfil. 

### Procesamiento Asíncrono

- **Sistema de colas para métricas**: Implementar un sistema de colas y procesamiento asíncrono para las métricas, similar al utilizado en el [[Servicio de notificaciones]]. Esto mejoraría el rendimiento y la resiliencia del sistema de métricas, evitando bloquear las peticiones HTTP durante el registro de eventos.

## Mejoras en Backend y Servicios

Estas mejoras están enfocadas en optimizar el rendimiento, la gestión de datos y las funcionalidades del backend.

### Optimización de Bases de Datos

- **Agregaciones y particiones mejoradas para métricas**: Implementar mejores agregaciones y particiones por región y fechas en el [[Servicios/Catalogo/Metricas|servicio de métricas]] para optimizar las consultas. Esto mejoraría significativamente el rendimiento de las consultas analíticas cuando el volumen de datos crezca y se trabaje con grandes volúmenes de datos históricos.

### Integración de Funcionalidades

- **Integración de likes y guardados en métricas**: Actualmente, los likes y guardados se gestionan únicamente en las tablas de PostgreSQL del [[Servicios/Catalogo/summary|servicio de catálogo]]. Integrar estas métricas en el sistema de métricas permitiría un análisis más completo y unificado del comportamiento de los usuarios.

### Gestión de Regiones y Estados

- **Manejo más riguroso de regiones, bloqueos y borrados**: El manejo actual de regiones, bloqueos y borrados es muy manual y requiere mejoras. Por ejemplo, actualmente es necesario realizar un filtro por región y verificar el estado para cada canción durante búsquedas o reproducciones, lo cual se hace de forma manual en cada consulta. Sería beneficioso automatizar y optimizar estas verificaciones, posiblemente mediante índices o capas de abstracción, para reducir la complejidad y mejorar el rendimiento.

### Caché y Performance

- **Caché en múltiples niveles (Backend)**: Implementar un sistema de caché en múltiples niveles para optimizar consultas frecuentes y reducir la latencia. Esto sería especialmente beneficioso para datos que se consultan frecuentemente pero cambian con poca frecuencia. Un buen ejemplo de esto sería los monthly listeners de los artistas más populares. 

### Motor de Búsqueda

- **Motor de búsqueda avanzado**: El sistema actual de búsqueda utiliza un algoritmo de Levenshtein implementado manualmente entre diferentes contenidos para encontrar coincidencias, y funciona correctamente para el volumen actual. Sin embargo, esta es una búsqueda unificada de forma genérica que tiene limitaciones. Se podría implementar un motor de búsqueda más avanzado (como Elasticsearch o Algolia) que proporcione capacidades de búsqueda full-text, ranking relevante y mejoras en la experiencia del usuario, especialmente cuando el catálogo crezca significativamente. 

## Mejoras en Aplicación y Frontend

Estas mejoras están orientadas a mejorar la experiencia del usuario y la calidad del código frontend.

### Validaciones 

- **Validación de tamaño de archivos multimedia**: Implementar validación en los formularios para verificar el tamaño de archivos multimedia antes de permitir su carga. Actualmente, si se intenta subir un archivo demasiado grande, no se genera un error claro y el proceso no se detiene adecuadamente. Debería implementarse una validación que rechace archivos que excedan los límites establecidos con mensajes de error claros. **Esta falta de validación puede resultar en valores inválidos tanto en la base de datos como en Firebase Storage, causando errores en la aplicación y posibles problemas de rendimiento.**

### Build y Deployment

- **Uso de Expo Build**: Migrar del proceso de build manual con Gradle a Expo Build para simplificar el proceso de construcción y deployment de la aplicación móvil. Esto reduciría la complejidad operacional y mejoraría la consistencia en los builds.

### Optimizaciones de Componentes

- **Optimización y reutilización de componentes**: Durante el desarrollo rápido se crearon muchos componentes con funcionalidad similar. Aunque se intentó minimizar esta duplicación, aún persisten componentes repetidos. Se recomienda una refactorización para mejorar la reutilización de componentes. Adicionalmente, hay oportunidades de optimizar el árbol de renderizado en React mediante mejores hooks y patrones de optimización que mejorarían el rendimiento en ciertas circunstancias.

- **Caché en múltiples niveles (Frontend)**: Implementar un sistema de caché para varios recursos, principalmente las fotos o contenido multimedia, para reducir el tiempo de carga de la aplicación.

## Mejoras de Negocio

Estas mejoras están enfocadas en mejorar la funcionalidad y experiencia del usuario desde la perspectiva del negocio.

### Funcionalidades de Búsqueda y Descubrimiento

- **Ordenamientos y filtros avanzados en búsqueda**: Implementar opciones de ordenamiento y filtros adicionales en la funcionalidad de búsqueda para mejorar la capacidad de los usuarios de encontrar contenido relevante.

- **Home con recomendaciones automáticas**: Implementar una pantalla de inicio con recomendaciones automáticas y shortcuts cuando el usuario no ha escuchado nada en la plataforma. Esto mejoraría la experiencia de nuevos usuarios y facilitaría el descubrimiento de contenido.

### Gestión de Contenido

- **Eliminación de imágenes**: Permitir a los usuarios borrar imágenes de colecciones, playlists, usuarios, banners, etc. Actualmente esta funcionalidad no está disponible, lo que limita la capacidad de los usuarios de gestionar su contenido.

- **Modificación de preferencias de usuario**: Permitir modificar los artistas favoritos y géneros favoritos desde la configuración de la aplicación. Actualmente, estas preferencias solo pueden establecerse durante el onboarding inicial y no pueden modificarse posteriormente.

- **Recuperación del estado de reproducción**: Implementar funcionalidad para recuperar el estado de una canción que se estaba reproduciendo al cerrar la aplicación. Esto mejoraría la continuidad de la experiencia del usuario.

### Gestión de Borrados

- **Soporte completo para borrados de contenido**: Actualmente, solo los administradores pueden borrar contenido, y hay inconsistencias críticas en el manejo de borrados. Por ejemplo:
  - Si se borra un artista, sus colecciones y canciones permanecen sin borrar
  - Si se borra una colección, sus canciones permanecen sin borrar
  
  El único borrado soportado correctamente es el de canciones y colecciones en estado draft. Se requiere implementar un sistema de borrados en cascada o lógicos que mantenga la consistencia de los datos cuando se elimina contenido relacionado.

  **Esta falta de soporte completo puede dejar la base de datos en estados inválidos, con datos huérfanos, referencias rotas y problemas de integridad referencial que pueden causar errores en la aplicación.** Esto es sumamente importante para mantener la integridad de los datos y evitar que se queden datos inconsistentes o que se dupliquen. Fue uno de los temas que se discutió y se decidió no implementar para agilizar el desarrollo.
