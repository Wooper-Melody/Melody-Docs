---
title: Organización y Distribución
---

Este documento describe cómo se organizó el equipo a lo largo del proyecto, la distribución de tareas, roles y responsabilidades de cada miembro, y las metodologías de trabajo utilizadas.

## Composición del Equipo

El equipo estaba compuesto por 5 desarrolladores con diferentes roles y especialidades que fueron evolucionando a lo largo del proyecto.

### Miembros del Equipo

- **Santiago Fassio**: Backend e infraestructura
- **Theo Lijs**: Backend e infraestructura
- **Cristhian Noriega**: Full Stack
- **Juan Martín de la Cruz**: Full Stack (migró a Frontend)
- **Antonella Peregrini**: Frontend exclusivo

## Evolución de la Organización

### Inicio del Proyecto

Al inicio del proyecto había **4 integrantes** en el equipo de desarrollo backend:

- **Santiago Fassio** (Exclusivo backend)
- **Theo Lijs** (Exclusivo backend)
- **Cristhian Noriega** (Full Stack)
- **Juan Martín de la Cruz** (Full Stack)

**Problema inicial**: Al principio del proyecto se escribió mucho código en el backend, pero faltaban muchas implementaciones en el frontend. En vez de estar full stack, terminamos siendo 4 desarrolladores casi exclusivamente de backend. Esto se debió a que se necesitaba establecer toda la infraestructura del proyecto, incluyendo los deploys y configuraciones de la aplicación, sumado a una mala organización y comunicación entre los miembros del equipo.

En el frontend, **Antonella Peregrini** era la única desarrolladora frontend en el checkpoint 1, lo que generó un desbalance significativo.

### Reorganización (Checkpoint 3)

A partir del checkpoint 3, se realizó una reorganización del equipo para mejorar la eficiencia:

- **Santiago y Theo**: Se centraron exclusivamente en el backend e infraestructura
- **Juan Martín**: Se centró en el frontend y dejó de tocar el backend
- **Cristhian**: Se centró en el full stack, dejando un poco más de lado el backend y yendo a un 50/50 más real
- **Antonella**: Continuó en frontend exclusivo

De esta manera se pudo mejorar la eficiencia del equipo y reducir el atraso del frontend considerablemente.


## Metodologías de Trabajo

### Gestión de Historias de Usuario

**Herramientas utilizadas**:
- **Excel compartido**: Herramienta principal para gestionar las historias de usuario. Se utilizó un Excel compartido con los profesores (Ignacio Carol Lugones e Iara Jolodovsky) para poner en progreso y trackear el estado de las historias.
- **Linear**: Se intentó utilizar Linear para las historias más importantes, pero no resultó tan útil como el Excel. El Excel fue la herramienta principal para la gestión de historias.

**Desafío**: Fue muy difícil cerrar las historias ya que había muchísimas dependencias entre las otras historias. Algunas historias tardaron dos checkpoints enteros hasta tener funcionalidades completas.

### Comunicación

**Discord**: Se utilizó Discord como herramienta principal de comunicación. Aunque las dailies eran asíncronas, Discord fue el canal principal para:
- Dailies asíncronas
- Comunicación entre miembros del equipo
- Coordinación de tareas
- Resolución de bloqueos

### Dailies Asíncronas

A partir del checkpoint 3, se establecieron **dailies asíncronas** en Discord. Cada miembro del equipo marcaba qué estaba haciendo ese día y cómo venía con su tarea, siguiendo un formato estructurado:

```md
## Ayer:
[Lo que se hizo ayer]

## Hoy:
[Lo que se va a hacer hoy]

## Norte:
[Objetivo a largo plazo]

## Bloqueo:
[Problemas o dependencias que bloquean el trabajo]
```

**Resultados**: Con esto se pudo empezar a estimar y cerrar historias mucho más rápido y eficiente que antes. Cada uno empezó a realizar las cosas que tenía que hacer sin trabas y con un feedback constante de los otros miembros del equipo. No solamente se definía mucho mejor el scope de los "sprints", sino que también se mejoró la comunicación y el trabajo en equipo al saber en todo momento en qué estado estaba cada historia en desarrollo.

## División de Tareas por Área

### Backend

**Inicio**: 4 desarrolladores trabajando principalmente en backend
**Evolución**: Se redujo a 2-3 desarrolladores enfocados en backend, con los demás migrando a roles mixtos o frontend

**Servicios distribuidos**:
- **Servicio de Usuarios**: Santiago, Cristhian, Theo y Juan Martín
- **Servicio de Catálogo**: Theo, Cristhian, Santiago y Juan Martín
- **Servicio de Notificaciones**: Cristhian

### Frontend

**Inicio**: 1 desarrolladora (Antonella)
**Evolución**: Se expandió a 2-3 desarrolladores (Antonella, Juan Martín, y Cristhian en algunas partes)

**Distribución**:
- **Mobile**: Antonella, Juan Martín y Cristhian
- **Backoffice**: Juan Martín

### Infraestructura y DevOps

**Responsables**: Theo y Juan Martín

**Tareas**:
- Configuración de CI/CD
- Deploys en GCP Cloud Run
- Configuración de Zuplo (API Gateway)
- Integración de Expo con Android
- Construcción de APK
- Configuración de bases de datos

## Puntos importantes de la organización y distribución

### Organización

- **Comunicación clara es esencial**: La falta de comunicación clara al inicio generó desbalance entre backend y frontend
- **Distribución de responsabilidades**: Definir claramente quién hace qué mejoró significativamente la eficiencia
- **Dailies asíncronas**: Fueron fundamentales para mantener a todos informados y coordinar el trabajo

### Herramientas

- **Excel fue más útil que Linear debido a su simplicidad**: Para este proyecto, el Excel compartido resultó más práctico que herramientas más sofisticadas como Linear
- **Discord para comunicación**: Funcionó bien para dailies asíncronas y comunicación del equipo

### Equilibrio Backend/Frontend

- **Inicio desbalanceado**: Al principio había demasiados desarrolladores en backend y muy pocos en frontend
- **Reorganización exitosa**: La redistribución de roles mejoró significativamente el progreso del frontend

