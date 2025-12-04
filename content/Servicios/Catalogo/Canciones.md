---
title: Canciones
---

Las canciones son el contenido principal del catálogo. Son las que se reproducen y se escuchan por los usuarios de la plataforma.

## Diseño de Canciones

### Vinculación con Colecciones

**Una canción debe estar obligatoriamente vinculada a una [colección](Collections-Playlists.md#colecciones)**. Esta es una regla fundamental del diseño del catálogo:

- No puede existir una canción sin una colección asociada
- La relación es de muchos a uno: una colección puede tener múltiples canciones, pero una canción pertenece a una sola colección
- Esta vinculación garantiza que todo el contenido musical esté organizado y contextualizado dentro de una obra del artista

Una canción, por ende, está publicada solamente cuando la colección a la que pertenece está publicada. Asimismo, las canciones tienen la imagen de la portada de la colección como imagen de la canción.

Esta restricción tiene sentido porque:
- Las canciones siempre forman parte de una obra más grande (ALBUM, EP o SINGLE)
- Facilita la organización y navegación del catálogo
- Permite mantener la integridad referencial de los datos
- Simplifica la gestión de metadatos y derechos de autor

### Metadatos de Canciones

Las canciones contienen información relevante como:

- **Título**: Nombre de la canción
- **Duración**: Tiempo de reproducción
- **Artista**: Creador de la canción (heredado de la colección)
- **Géneros**: Categorías musicales asociadas (ver sección de Géneros)
- **Archivo de audio**: Referencia al archivo multimedia almacenado en Firebase Storage
- **VideoUrl**: Referencia al video de la canción almacenado en Firebase Storage
- **Collaborators**: Lista de colaboradores de la canción. Esta es una lista de usuarios que participaron en la creación de la canción.

## Géneros

Las canciones tienen **géneros** asociados que permiten categorizar y organizar el contenido musical. Los géneros son importantes para:

- **Búsqueda y descubrimiento**: Los usuarios pueden buscar canciones por género
- **Recomendaciones**: El sistema puede sugerir contenido basado en los géneros que el usuario prefiere
- **Organización**: Facilita la navegación y exploración del catálogo
- **Personalización**: Permite crear experiencias personalizadas según los gustos del usuario

Los géneros pueden ser asignados a nivel de canción, lo que permite que una misma colección contenga canciones de diferentes géneros si es necesario.

## Sistema de Likes

Las canciones pueden ser **likeadas** por los usuarios. El sistema de likes permite:

El servicio de likes (`Like Service`) gestiona esta funcionalidad, permitiendo a los usuarios dar like o quitar like a canciones de manera sencilla.

## Reproducción de Canciones

Las canciones se reproducen a través del `Playback Service`, que gestiona la reproducción, el historial de reproducciones del usuario y el registro de métricas. Cuando un usuario reproduce una canción, el sistema registra esta información en dos lugares: el historial personal del usuario (para mostrar canciones recientes y personalizar recomendaciones) y las métricas del catálogo (para análisis y estadísticas). Para más detalles sobre el proceso de reproducción, el historial y las diferencias entre historial y métricas, ver [Reproducciones](Reproducciones.md). Para las reglas de validación específicas de las métricas, ver [Métricas](Metricas.md#reglas-y-validaciones).

## Regiones y Disponibilidad

Tanto las **canciones** como las **colecciones** tienen configuraciones de región que determinan en qué regiones geográficas están disponibles. Los administradores pueden bloquear o permitir contenido en regiones específicas.

### Lógica de Herencia

La disponibilidad de una canción se determina mediante una **lógica de herencia** desde la colección:

1. **Primero se verifica la colección**: La canción hereda primero la disponibilidad de la colección a la que pertenece
2. **Luego se verifica la canción**: Después se verifica si la canción tiene alguna restricción adicional específica

**Regla fundamental**: **Si una colección está bloqueada o no disponible en una región, todas sus canciones también están bloqueadas en esa región, independientemente de la configuración individual de la canción**.

### Restricciones

- **No puede estar disponible solo la canción**: Una canción no puede estar disponible en una región si su colección no está disponible en esa misma región
- **La colección tiene prioridad**: Si la colección está bloqueada en una región, la canción automáticamente queda bloqueada, incluso si la canción individualmente está configurada como disponible
- **Bloqueo administrativo**: Los administradores pueden bloquear contenido por región para cumplir con restricciones de licencias, derechos de autor, o políticas regionales

### Ejemplo

Si un ALBUM está bloqueado en la región "SAM", todas las canciones de ese álbum estarán bloqueadas en SAM, incluso si alguna canción individualmente tiene configuración para estar disponible en esa región. La configuración de la colección siempre tiene prioridad.

## Almacenamiento

Los archivos de audio y video de las canciones se almacenan en **Firebase Storage**, que forma parte del proyecto de Google Cloud Platform. El servicio de catálogo gestiona las referencias a estos archivos, pero el almacenamiento físico se realiza en la infraestructura de Firebase. Tanto el backend como el frontend tienen acceso a este bucket, pero con diferentes métodos de autenticación (el backend utiliza una cuenta de servicio y el frontend utiliza autenticación de usuario). Para más detalles sobre cómo está configurada la infraestructura de almacenamiento, ver [Infraestructura](../../Arquitectura/Infraestructura.md#almacenamiento).
