---
title: Reproducciones
---

Cuando un usuario reproduce una canción, el sistema registra esta escucha de **dos maneras diferentes**: en el historial de reproducciones del usuario y en las métricas del catálogo. Cada una de estas tiene un propósito y un almacenamiento diferente.

## Proceso de Reproducción

Cuando un usuario reproduce una canción, se invoca el endpoint `POST /catalog/playback`. Este endpoint realiza las siguientes acciones:

1. **Validación de umbral**: Verifica que la reproducción supere un umbral mínimo (30 segundos por defecto) para evitar "zapping" o reproducciones accidentales
2. **Registro de historial**: Si el historial del usuario no está pausado, persiste la información en PostgreSQL
3. **Registro de métricas**: Invoca el servicio de métricas de forma asíncrona para registrar el evento en MongoDB

Las métricas se registran siempre, independientemente del estado de pausa del historial del usuario, para garantizar que las estadísticas globales sean completas.

## Historial de Reproducciones

El **historial de reproducciones** es un registro personal de las canciones que el usuario ha escuchado. Este historial se utiliza para:

- Mostrar las canciones que el usuario ha escuchado recientemente
- Personalizar las recomendaciones basadas en el historial de escucha
- Permitir al usuario acceder rápidamente a contenido que ya ha escuchado

### Almacenamiento

El historial se guarda en la **base de datos principal del catálogo (PostgreSQL)**. Es importante aclarar que:

- Si el usuario escucha nuevamente una canción que ya está en su historial, **no se crea un nuevo registro**
- En su lugar, se **actualiza** la fecha de la última escucha y el contexto de escucha del registro existente
- Esto evita duplicados en el historial y mantiene un registro limpio de las canciones escuchadas

### Contexto de Escucha

El **contexto de escucha** indica en qué lugar o desde dónde el usuario reprodujo la canción. Los contextos posibles incluyen:

- **PLAYLIST**: La canción se reprodujo desde una playlist
- **SEARCH**: La canción se reprodujo desde los resultados de búsqueda
- **ALBUM**: La canción se reprodujo desde un álbum/colección
- Y otros contextos según la navegación del usuario

Este contexto se almacena junto con cada entrada del historial, permitiendo mostrar al usuario dónde escuchó cada canción y proporcionar información más rica para las recomendaciones.

### Control del Usuario

El usuario tiene control sobre su historial de reproducciones:

- **Pausar el historial**: Cuando el usuario pausa el historial, se deja de registrar nuevas escuchas en el historial. Las canciones reproducidas durante este período no aparecerán en el historial.
- **Borrar el historial**: Cuando el usuario borra su historial, se eliminan todos los registros del historial. Esta acción es permanente.

## Métricas

Además del historial personal, cada reproducción de una canción se registra en la **base de datos de métricas (MongoDB)** para análisis y estadísticas. El sistema de métricas utiliza una arquitectura de dos niveles: eventos individuales inmutables y agregaciones diarias pre-calculadas para consultas rápidas. Las métricas se registran siempre, independientemente del estado de pausa del historial del usuario, y se utilizan para medir popularidad, generar rankings, y proporcionar análisis detallados a artistas y administradores.

Para información detallada sobre la arquitectura del sistema de métricas, el flujo completo de captura, las reglas de validación específicas (período de gracia, umbral mínimo, exclusión de auto-reproducciones), y las APIs disponibles para consultar métricas, ver [Métricas](Metricas.md).

## Diferencias Clave

| Aspecto | Historial de Reproducciones | Métricas |
|--------|----------------------------|----------|
| **Base de datos** | PostgreSQL (catálogo) | MongoDB (métricas) |
| **Propósito** | Personal para el usuario | Análisis y estadísticas globales |
| **Actualización** | Se actualiza si la canción ya está en el historial | Siempre crea un nuevo registro |
| **Control del usuario** | Puede pausar o borrar | No puede modificar |
| **Datos almacenados** | Información básica + contexto | Información detallada + duración + región |

