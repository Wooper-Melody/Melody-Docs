---
title: Métricas
---

El **servicio de métricas** es un componente especializado que vive dentro del servicio de catálogo. Aunque técnicamente forma parte del servicio de catálogo, funciona como un servicio independiente con su propia lógica, repositorios y responsabilidades bien definidas.

> **Nota importante**: El servicio de métricas podría ser un servicio aparte para simplificar significativamente la arquitectura y el mantenimiento. Actualmente está integrado dentro del servicio de catálogo, pero tiene una arquitectura y responsabilidades propias.

## ¿Qué es el Servicio de Métricas?

El servicio de métricas es responsable de:

- **Capturar eventos de reproducción**: Registrar cada reproducción válida de una canción
- **Procesar y agregar datos**: Transformar eventos individuales en métricas agregadas
- **Proporcionar análisis**: Exponer APIs para consultar métricas de canciones, colecciones, playlists y artistas
- **Generar estadísticas**: Calcular rankings, tendencias y comparaciones temporales

## Arquitectura de Dos Niveles

El sistema de métricas utiliza una arquitectura de dos niveles para optimizar el rendimiento:

### Nivel 1: Eventos Individuales

- **Colección**: `playback_metrics` en MongoDB
- **Propósito**: Almacenar cada evento de reproducción válido de forma inmutable
- **Características**: 
  - Insert-only (no se modifican una vez guardados)
  - Contienen toda la información detallada del evento
  - Se utilizan para auditoría y análisis históricos detallados

### Nivel 2: Agregaciones Diarias

- **Colecciones**: 
  - `song_play_metrics_daily` - Métricas diarias de canciones
  - `playlist_play_metrics_daily` - Métricas diarias de playlists
  - `collection_play_metrics_daily` - Métricas diarias de colecciones
- **Propósito**: Agregaciones pre-calculadas para consultas rápidas
- **Granularidad**: Por día, región y entidad (canción/playlist/colección)
- **Actualización**: Tiempo real mediante listener automático

### Ventajas de esta Arquitectura

1. **Performance**: Consultas rápidas sobre datos pre-agregados en lugar de calcular sobre millones de eventos
2. **Escalabilidad**: Los eventos individuales pueden archivarse sin afectar las consultas frecuentes
3. **Flexibilidad**: Permite análisis históricos detallados desde los eventos originales cuando es necesario
4. **Eficiencia**: Reduce significativamente la carga computacional en consultas frecuentes

## Flujo de Captura de Métricas

El flujo completo de captura de métricas comienza cuando un usuario reproduce una canción. El sistema registra cada reproducción en dos lugares: el historial personal del usuario (en PostgreSQL) y las métricas analíticas (en MongoDB).

```
Usuario reproduce canción
    ↓
POST /catalog/playback
    ↓
PlaybackService.recordPlayback()
    ↓
MetricsService.recordPlaybackMetric() [Async]
    ↓
Validación cooldown + Enriquecimiento
    ↓
Guardar PlaybackMetric en MongoDB
    ↓
PlaybackMetricListener.onAfterSave()
    ↓
Actualizar métricas diarias (Song/Playlist/Collection)
    ↓
Consultas via MetricsController
```

### Proceso de Registro

1. **Captura del evento**: Cuando un usuario reproduce una canción, se invoca `POST /catalog/playback`. Este endpoint valida que la reproducción supere el umbral mínimo y registra tanto el historial como las métricas. 
2. **Validación**: Se verifica que la reproducción supere el umbral mínimo (30 segundos por defecto)
3. **Registro asíncrono**: `MetricsService.recordPlaybackMetric()` se ejecuta de forma asíncrona para no bloquear la respuesta HTTP
4. **Validación de cooldown**: Se verifica que no haya una reproducción reciente del mismo usuario y canción (período de gracia de 30 segundos)
5. **Enriquecimiento**: Se obtienen metadatos adicionales (artista, colección, duración)
6. **Persistencia**: Se guarda el evento en `playback_metrics`
7. **Agregación automática**: Un listener actualiza las métricas diarias correspondientes en el `PlaybackMetricListener`.

### Datos Registrados

Cada evento de reproducción registra:

- **Usuario**: ID del usuario que reprodujo la canción
- **Canción**: ID de la canción reproducida
- **Artista**: ID del artista de la canción
- **Colección**: ID de la colección a la que pertenece (opcional)
- **Región**: Región geográfica del usuario
- **Fecha y hora**: Timestamp exacto de la reproducción
- **Duración**: Tiempo que el usuario escuchó la canción (en segundos)
- **Contexto**: Desde dónde se reprodujo (PLAYLIST, SEARCH, ALBUM, etc.)

## Reglas y Validaciones

### Período de Gracia (Cooldown)

Se registra solamente **una escucha nueva** con un período de gracia de **30 segundos** (configurable). Esto significa que:

- Si el usuario cambia de canción rápidamente (en menos de 30 segundos), no se registra una nueva escucha
- Evita registrar múltiples escuchas de la misma canción en un período muy corto
- Previene métricas infladas por cambios rápidos entre canciones

### Umbral Mínimo de Reproducción

El usuario debe escuchar al menos **30 segundos** de la canción (configurable) para que se registre en las métricas. Esto asegura que:

- Solo se cuenten escuchas significativas, no reproducciones accidentales o muy breves
- Las métricas reflejen un interés real en el contenido
- Se mantenga la calidad de los datos analíticos

### Exclusión de Auto-reproducciones

El mismo artista **no puede escuchar su propia canción** para registrar métricas. Esto previene que los artistas inflen artificialmente las métricas de sus propias canciones.

### Independencia del Historial

Las métricas se registran **siempre**, independientemente del estado de pausa del historial del usuario. Esto garantiza que las estadísticas globales sean completas y precisas.

### Parámetros Comunes

- `startDate` (requerido): Fecha de inicio en formato `YYYY-MM-DD`
- `endDate` (requerido): Fecha de fin en formato `YYYY-MM-DD`
- `region` (opcional): Filtro por región (GLB, NAM, BR, MX, SAM, etc.)

## Características Destacadas

### Comparación de Períodos

Los endpoints de "overview" comparan automáticamente el período actual con el período anterior de igual duración, calculando:

- Valores absolutos (reproducciones, likes, guardados)
- Cambios porcentuales

### Filtrado por Región

Todas las consultas soportan filtrado opcional por región:

- `null` o ausente: Todas las regiones (GLB - Global)
- `NAM`: Norteamérica
- `SAM`: Sudamérica
- Y otras regiones según la configuración

### Resiliencia y Confiabilidad

- **Procesamiento asíncrono**: No bloquea peticiones HTTP
- **Reintentos automáticos**: Hasta 3 intentos con backoff exponencial (1s, 2s, 4s) en caso de fallos transitorios
- **Cooldown period**: Evita duplicados y métricas infladas

### Performance Optimizada

- **Agregaciones pre-calculadas**: Consultas rápidas sobre datos diarios
- **Índices compuestos**: Optimización de consultas por fecha, región y entidad
- **Consultas batch**: Procesamiento eficiente de múltiples elementos
- **Caché implícito**: Datos agregados se actualizan incrementalmente

## Componentes del Servicio

### Servicios

- **`MetricsService`**: Gestiona el registro de eventos de reproducción
- **`SongMetricsService`**: Consulta métricas de canciones individuales
- **`CollectionMetricsService`**: Consulta métricas de colecciones
- **`PlaylistMetricsService`**: Consulta métricas de playlists
- **`ArtistMetricsService`**: Consulta métricas agregadas de artistas
- **`GeneralMetricsService`**: Métricas generales del catálogo

### Listeners

- **`PlaybackMetricListener`**: Se activa automáticamente después de guardar un evento y actualiza las métricas diarias correspondientes

## Consideraciones de Diseño

### ¿Por qué está dentro del servicio de catálogo?

El servicio de métricas está integrado dentro del servicio de catálogo porque:

- Tiene acceso directo a las entidades del catálogo (canciones, colecciones, playlists), ahorrándose llamadas entre servicios y simplificando la comunicación entre componentes, lo que facilita el desarrollo. 

### ¿Por qué podría ser un servicio separado?

Aunque actualmente está integrado, el servicio de métricas podría beneficiarse de ser un servicio independiente porque:

- **Separación de responsabilidades**: Las métricas tienen una responsabilidad bien definida y diferente del catálogo
- **Escalabilidad independiente**: Las métricas pueden necesitar escalar de forma diferente al catálogo
- **Tecnología especializada**: Podría usar tecnologías más específicas para análisis de datos
- **Mantenimiento simplificado**: Facilita el mantenimiento y evolución del código
- **Arquitectura más clara**: Hace más evidente la separación de responsabilidades en la arquitectura general
