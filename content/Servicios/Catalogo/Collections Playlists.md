---
title: Colecciones y Playlists
---

Los dominios de colecciones y playlists son dos dominios diferentes, pero en varias partes se intentan manejar de manera conjunta. Esto fue un punto complicado de diseño, ya que aunque son parecidos, tienen características y responsabilidades diferentes.

## Colecciones

Las colecciones son un tipo de contenido que crean los artistas para organizar su contenido. Se dividen en:

- **ALBUM**: Conjunto de muchas canciones
- **EP**: Conjunto de algunas canciones
- **SINGLE**: Una sola canción

Lo importante de las colecciones es que solamente son creadas por artistas y las canciones están directamente vinculadas a una colección. No puede haber una canción sin una colección. Esta es una regla fundamental del diseño que garantiza que todo el contenido musical esté organizado y contextualizado dentro de una obra del artista. Para más detalles sobre esta relación obligatoria, las razones de diseño, y cómo afecta la publicación de canciones, ver [Vinculación con Colecciones](Canciones.md#diseño-de-canciones).

### Foto de Portada

Las colecciones tienen una **foto de portada** que se utiliza como imagen representativa de la colección. Esta imagen:

- Se muestra en la interfaz cuando se visualiza la colección
- Es utilizada como imagen de las canciones que pertenecen a la colección (las canciones heredan la imagen de portada de su colección)
- Se almacena en Firebase Storage como parte de los archivos multimedia del catálogo
- Es un elemento importante para la identidad visual de la obra del artista

> **Nota**: Las canciones heredan automáticamente la imagen de portada de su colección. Esto significa que cuando se visualiza una canción, se muestra la imagen de portada de la colección a la que pertenece. Para más detalles sobre los metadatos de las canciones y cómo se relacionan con las colecciones, ver [Canciones](Canciones.md).

### Publicación de Colecciones

Los artistas pueden crear las colecciones primero en un estado de borrador. Una vez que la colección está lista, el artista puede publicarla en el mismo momento o programarla para una fecha futura de publicación.

Esta publicación se maneja mediante un servicio pequeño de publicación que corre como un cron job cada 5 minutos en el `PublishCollectionPublishService`. Esto se pudo implementar rápidamente gracias a Spring Boot con la anotación `@Scheduled` para ejecutar el servicio de manera programada.

> **Nota importante**: El `@Scheduled` tiene una limitación al correr en el servicio directamente que está desplegado con 0 réplicas en GCP. Esto significa que la publicación de colecciones programadas funciona solamente si el servicio está con al menos una réplica. Por lo tanto, si el servicio se detiene, la publicación de colecciones programadas se detendrá y habrá un delay máximo de 5 minutos para que se publique la colección una vez que el servicio vuelva a estar activo.

### Regiones y Disponibilidad

Las colecciones tienen configuraciones de **región** que determinan en qué regiones geográficas están disponibles. Los administradores pueden bloquear o permitir colecciones en regiones específicas.

**Importante**: La disponibilidad de una colección afecta directamente a todas sus canciones. Si una colección está bloqueada o no disponible en una región, todas sus canciones también estarán bloqueadas en esa región, independientemente de la configuración individual de cada canción. Las canciones heredan la disponibilidad de su colección mediante una lógica de herencia donde primero se verifica la colección y luego la canción. Una canción nunca puede estar disponible si su colección no lo está.

> Para más detalles sobre cómo funciona esta lógica de herencia, las restricciones aplicadas, y ejemplos prácticos, ver [Regiones y Disponibilidad](Canciones.md#regiones-y-disponibilidad).

## Playlists

Las playlists son un tipo de contenido que crean los usuarios para organizar su contenido. Estas pueden ser públicas o privadas:

- **Públicas**: Visibles para todos los usuarios
- **Privadas**: Solo visibles para el usuario que las crea

> **Nota**: Tanto artistas como listeners pueden crear playlists.

### Banner

Las playlists tienen un **banner** que se utiliza como imagen representativa de la playlist. Esta imagen:

- Se muestra en la interfaz cuando se visualiza la playlist
- Permite personalizar la apariencia visual de cada playlist
- Se almacena en Firebase Storage como parte de los archivos multimedia del catálogo
- Es opcional, pero mejora la experiencia visual para los usuarios

## Guardados - UserSaves

Los _listeners_ pueden guardar playlists y colecciones. Esta es una de las funcionalidades que se manejan de manera conjunta con las colecciones y playlists, aunque internamente se manejan de manera diferente. Para esto se tiene el servicio de `UserSaveService` que se encarga de gestionar los guardados de los usuarios.

### Diseño de Guardados

Para manejarlos de manera conjunta, se tiene en la tabla de guardados un campo de tipo enum para indicar si es una playlist o una colección, junto con el ID del recurso guardado. De esta manera se pueden guardar en un solo lugar las colecciones y playlists guardadas por los usuarios y devolverlas de manera conjunta.

Modelar en este caso de manera conjunta tiene sentido porque:

- Son dos tipos de contenido que se manejan de manera similar desde la perspectiva del usuario
- Se pueden guardar en un solo lugar sin duplicar lógica
- No requieren hacer uso de las características propias de cada uno de los tipos (publicaciones programadas y público/privado) en el contexto de guardados
