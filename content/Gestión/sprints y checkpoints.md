---
title: Sprints y Checkpoints
---

La organización del proyecto se inspiró en metodologías de desarrollo ágiles, particularmente Scrum. Se intentaron realizar sprints semanales para cumplir con los deadlines de las historias de usuario. Sin embargo, debido a la naturaleza de las historias de usuario, fue necesario implementarlas de forma incremental, ya que estaban estrechamente vinculadas entre sí, especialmente en el caso del catálogo.

> Para ver las lecciones aprendidas derivadas de esta experiencia, ver [[Lecciones Aprendidas#gestión-y-organización|Lecciones Aprendidas - Gestión y Organización]].

## Checkpoints

Se realizaron **4 checkpoints** durante el cuatrimestre para evaluar el progreso del proyecto y realizar ajustes cuando fue necesario. Los checkpoints fueron puntos de control del proyecto para evaluar el progreso y realizar ajustes acompañados por nuestros profesores **_Iara Jolodovsky_** e **_Ignacio Carol Lugones_**.

Cada checkpoint duró entre un mes y 3 semanas, con la dinámica de acordar antes de finalizar el mismo en qué estado se iba a llegar con las historias de usuario definidas entre el equipo y los profesores.

El principal porcentaje del desarrollo se realizó entre el checkpoint 2 y el checkpoint 3, donde se completaron la mayoría de las funcionalidades core de la aplicación.

### Checkpoint 1: Scaffolding e Infraestructura

**Duración**: Aproximadamente 3-4 semanas

**Objetivo**: El "scaffolding" del proyecto, es decir, la creación de la infraestructura del proyecto incluyendo los deploys y configuraciones de mínimo un servicio (el [[Servicio de usuarios|servicio de usuarios]]), con toda la pipeline de CI/CD y el despliegue de la aplicación.

#### Hitos Técnicos

- **Servicio de Usuarios**: Implementado y deployeado
- **Backoffice**: Parte del backoffice funcional
- **API Gateway (Zuplo)**: Ya en ejecución
- **Pipeline CI/CD**: Establecida y funcionando

#### Funcionalidades Completadas

**Backend - Servicio de Usuarios**:
- Registro de usuarios
- Login con email y contraseña
- Recupero de contraseña
- Edición de perfil
- Visualización de perfil propio
- Ver perfil de otros usuarios
- Seguir/Dejar de seguir usuarios

**Frontend**:
- Modelado de las pantallas futuras
- Paleta de colores y diseños en común definidos
- Versión funcional con los perfiles de los usuarios

#### Pendientes

No se pudieron implementar todas las funcionalidades planificadas:
- Autenticación federada con Google (se completó más adelante)
- Algunas partes de seguidores quedaron pendientes

### Checkpoint 2: Servicio de Catálogo

**Duración**: Aproximadamente 3-4 semanas

**Objetivo**: Implementar todo lo posible del [servicio de catálogo](Servicios/Catalogo/summary.md): colecciones, canciones, playlists y, si era posible, reproducción.

#### Hitos Técnicos

- **Servicio de Catálogo**: Implementado y deployeado
- **Infraestructura**: Base establecida para el catálogo

#### Funcionalidades Completadas

**Backend - Servicio de Catálogo**:
- Gestión de colecciones (ALBUM/EP/SINGLE)
- Gestión de canciones
- Gestión de playlists
- Lógica de regiones y disponibilidad
- Búsqueda unificada por tipo
- Publicación de colecciones
- Backoffice: Perfil detallado (admin), disponibilidad por región/ventana, bloqueo/desbloqueo con alcance, listar usuarios del sistema, bloquear/desbloquear usuario

**Frontend**:
- Perfil del artista (parcial)
- Discografía (parcial)
- Popular (Top del artista) (parcial)
- Gestión de perfil del artista (parcial)
- Publicación de lanzamientos (parcial)
- Búsqueda unificada por tipo (parcial)
- Navegación a vistas de detalle (parcial)
- Creación y gestión de playlists (parcial)
- Reordenamiento en playlists (parcial)
- Historial de reproducción (parcial)
- Liked Songs (parcial)
- Colecciones guardadas (parcial)
- Reproducción y controles básicos (parcial)

> **Nota**: Muchas de estas funcionalidades se trataron de implementar pero no se completaron en su totalidad. Se trabajó principalmente en lo core de la aplicación de canciones, colecciones y playlists. Casi estaba terminado, pero algunas cosas nos bloqueaban de poder decir que esto ya está terminado. 

#### Problemas Encontrados

1. **Servicio de Catálogo**: Se invirtió mucho tiempo pensando cómo implementar las publicaciones de las colecciones y las canciones. También se complicó mucho la lógica de las regiones y estados posibles de las colecciones/canciones. Aún con la mayoría trabajando en el backend, no estábamos del todo organizados y se generó considerable deuda técnica.

2. **Frontend**: Al atrasarse el servicio de catálogo y priorizar fuertemente el backend, el frontend se atrasó considerablemente. Al final se pudo implementar casi hasta playlists en el backend, pero el frontend solo se pudo implementar aproximadamente la mitad.

3. **Datadog**: Se trató de empezar a investigar y configurar Datadog integrado con GCP, pero al final no se pudo y resultó en una considerable pérdida de tiempo.

**Consecuencia**: Todos estos problemas, sumados a la deuda técnica y las historias que parecían que no terminaban más (ya que había demasiadas cosas que implementar para las canciones y artistas), hicieron que cambiáramos la organización y estrategia en el equipo.

### Checkpoint 3: Funcionalidades Core y Métricas

**Duración**: Aproximadamente 3-4 semanas

**Objetivo**: Este fue el checkpoint que **definió completamente el proyecto**. No solamente se tenía que terminar de implementar las funcionalidades _core_ de la aplicación, sino que para cerrar historias se tenía que implementar casi todo lo relacionado con métricas y escuchas.

#### Hitos Técnicos

- **Servicio de Notificaciones**: Implementado y deployeado
- **Sistema de Métricas**: Integrado en el servicio de catálogo
- **Registro de Escuchas**: Implementado para desbloquear historias de usuario

#### Funcionalidades Completadas

**Backend - Servicio de Catálogo**:
- Perfil del artista (completo)
- Discografía (completo)
- Popular (Top del artista) (completo)
- Gestión de perfil del artista (completo)
- Publicación de lanzamientos (completo)
- Búsqueda unificada por tipo (completo)
- Sistema de métricas y registro de escuchas

**Backend - Servicio de Notificaciones**:
- Sistema de notificaciones implementado
- Integración con OneSignal

**Frontend**:
- Navegación a vistas de detalle (completo)
- Creación y gestión de playlists (completo)
- Reordenamiento en playlists (completo)
- Historial de reproducción (completo)
- Liked Songs (completo)
- Colecciones guardadas (completo)
- Reproducción y controles básicos (completo)
- Controles avanzados del player (completo)
- Gestión de cola (completo)

#### Cambios Organizacionales

En este checkpoint se implementaron cambios importantes en la organización del equipo:

- **Dailies asíncronas**: Se establecieron dailies en Discord para mantener a todos informados
- **Distribución clara de tareas**: Cada miembro tenía responsabilidades bien definidas
- **Mejora en la comunicación**: Se mejoró significativamente la coordinación entre miembros

#### Resultados

Sorprendentemente, y con mucho esfuerzo y comunicación, se logró terminar casi todas las historias de usuario obligatorias del proyecto, quedándose solamente 20 de 50 puntos de historias de usuario optativas, y con un frontend bastante completo y funcional.

**Desafío**: Fue muy difícil cerrar las historias ya que había muchísimas dependencias entre las otras historias. Algunas historias tardaron dos checkpoints enteros hasta tener funcionalidades como la popularidad de una canción, por ejemplo.

### Checkpoint 4: Finalización y Pulido

**Duración**: Aproximadamente 3-4 semanas

**Objetivo**: Terminar de implementar las historias de usuario optativas y terminar de implementar las notificaciones.

#### Funcionalidades Completadas

**Frontend**:
- Explorar Home (base)
- "New release from {Artist}"
- "Discover more from {Artist}"
- Deep links avanzados en notificaciones

**Backend**:
- Métricas de artistas
- Métricas de canciones/álbumes
- Centro + preferencias + disparadores esenciales de notificaciones

**Otros**:
- Backoffice completo
- Documentación del proyecto
- Pulido general de la aplicación

#### Resultados Finales

Con el equipo ya organizado, se mantuvo el mismo ritmo de trabajo las primeras dos semanas, terminando así todas las historias de usuario obligatorias. En la semana final se terminó el backoffice, se realizó la documentación y se fue puliendo la aplicación.

## Progreso General del Proyecto

### Evolución de Servicios por Checkpoint

- **Checkpoint 1**: Servicio de Usuarios + parte del backoffice + Zuplo en ejecución
- **Checkpoint 2**: Servicio de Catálogo implementado
- **Checkpoint 3**: Servicio de Notificaciones implementado + métricas en el catálogo
- **Checkpoint 4**: Todos los servicios completos y funcionalidades finales

### Gestión de Historias de Usuario

Fue muy difícil cerrar las historias ya que había muchísimas dependencias entre las otras historias. Algunas historias tardaron dos checkpoints enteros hasta tener funcionalidades completas como la popularidad de una canción, por ejemplo.

El equipo trató de utilizar Linear para gestionar las historias más importantes, pero resultó más útil utilizar un Excel compartido con los profesores (Ignacio Carol Lugones e Iara Jolodovsky) para poner en progreso y trackear el estado de las historias. El Excel fue la herramienta principal para la gestión de historias de usuario.
