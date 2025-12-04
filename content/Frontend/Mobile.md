---
title: Aplicación Mobile
---

# Vista general

La aplicación mobile de Melody es el cliente principal con el que los usuarios interactúan para consumir y crear contenido musical. Desarrollada con **Expo** y **React Native**, la aplicación proporciona una experiencia nativa para Android que permite a oyentes y artistas acceder al catálogo completo, reproducir música, gestionar playlists, y recibir notificaciones en tiempo real.

La aplicación se conecta exclusivamente con el [[Arquitectura#API Gateway|API Gateway]] mediante peticiones HTTP, delegando toda la lógica de negocio a los microservicios del backend. Esto permite mantener una arquitectura desacoplada donde el frontend se enfoca en la experiencia de usuario mientras el backend gestiona la seguridad, persistencia y lógica de negocio.

> [!NOTE]
> La aplicación mobile fue desarrollada exclusivamente para **Android**. Aunque la arquitectura de Expo permite soporte multiplataforma, el proyecto se enfocó en Android como plataforma objetivo.

## Arquitectura y Stack Tecnológico

La aplicación está construida sobre un stack moderno de React Native con las siguientes tecnologías principales:

### Framework Base

- **Expo**: Framework que simplifica el desarrollo de aplicaciones React Native, proporcionando acceso a APIs nativas y facilitando el proceso de build y deployment.
- **React Native**: Framework para desarrollo de aplicaciones móviles nativas usando React.


### Navegación y Routing

La aplicación utiliza **Expo Router** para la navegación, implementando un sistema de routing basado en archivos similar a Next.js. Esto permite:

- Navegación declarativa mediante la estructura de carpetas en `app/`
- Deep linking automático para notificaciones push y enlaces externos
- Tipado automático de rutas y parámetros
- Transiciones y animaciones entre pantallas

### Gestión de Estado

El estado de la aplicación se maneja mediante una combinación de:

- **React Context API**: Para estado global compartido (sesión de usuario, reproductor de música, formularios de creación)
- **Custom Hooks**: Para lógica reutilizable (búsqueda, visibilidad del teclado)
- **AsyncStorage**: Para persistencia local de datos (borradores de canciones, preferencias)
- **Expo Secure Store**: Para almacenamiento seguro de tokens de autenticación

### UI y Estilos

- **NativeWind**: Implementación de Tailwind CSS para React Native, permitiendo estilos utility-first
- **Gluestack UI**: Sistema de componentes con theming consistente y modo oscuro
- **Lucide React Native**: Librería de iconos moderna y consistente

### Integraciones Externas

- **Firebase Storage**: Para almacenamiento y descarga de archivos multimedia (imágenes de perfil, covers, audio, video)
- **[OneSignal](https://onesignal.com/)**: Para notificaciones push en tiempo real
- **Google Sign-In**: Para autenticación con cuentas de Google

## Comunicación con el Backend

La aplicación se comunica con el backend a través de una capa de servicios bien definida ubicada en `services/`. Cada servicio encapsula las llamadas a un microservicio específico del backend:

- **AuthService**: Gestiona autenticación, registro, login con Google y recuperación de contraseña
- **UserService**: Operaciones sobre perfiles de usuario, follow/unfollow, búsqueda de usuarios
- **CatalogService**: Gestión completa del catálogo (canciones, colecciones, playlists, búsquedas)
- **NotificationService**: Gestión de notificaciones del usuario
- **ArtistService**: Operaciones específicas para perfiles de artistas

### Cliente HTTP y Manejo de Tokens

Todos los servicios utilizan un cliente HTTP centralizado (`lib/http.ts`) basado en Axios que implementa:

- **Inyección automática de tokens**: Añade el header `x-access-token` a todas las peticiones autenticadas
- **Refresh automático de tokens**: Intercepta respuestas 401/403, refresca el access token usando el refresh token, y reintenta la petición original
- **Manejo de errores centralizado**: Parsea errores de la API y los transforma en objetos de error consistentes


## Estructura de la Aplicación

### Contextos Principales

La aplicación utiliza tres contextos principales para gestionar estado global:

#### SessionProvider

Gestiona el ciclo de vida completo de la sesión del usuario:
- Login y logout
- Registro de nuevos usuarios
- Recuperación de sesión al iniciar la app
- Navegación automática según estado de autenticación (onboarding, tabs, login)
- Normalización de roles (artist/listener)

#### PlayerProvider

Centraliza toda la lógica del reproductor de música:
- Cola de reproducción (queue)
- Canción actual y estado de reproducción
- Controles de reproducción (play, pause, next, previous)
- Gestión del audio mediante Expo Audio
- Sincronización con el contexto de reproducción (playlist, album, etc.)

#### SongFormProvider

Gestiona el estado de creación de canciones para artistas:
- Borrador persistente de canciones en creación
- Sincronización con AsyncStorage
- Limpieza y recuperación de borradores

## Funcionalidades Principales

### Autenticación y Onboarding

La aplicación soporta múltiples métodos de autenticación:
- Registro tradicional con email y contraseña
- Login con credenciales
- Autenticación con Google OAuth
- Recuperación de contraseña mediante tokens por email

Después del primer login, los usuarios pasan por un flujo de onboarding donde completan su perfil con información adicional (región, géneros favoritos, etc.).

### Reproducción de Música

El reproductor de música es el componente central de la aplicación, permitiendo:
- Reproducción de canciones individuales o desde contextos (playlist, album, artista)
- Cola de reproducción con capacidad de reordenar
- Controles de reproducción (play, pause, skip, seek)
- Visualización de portada, título y artista
- Integración con el sistema de likes

### Búsqueda y Descubrimiento

La funcionalidad de búsqueda permite encontrar:
- Canciones
- Álbumes, singles y EPs
- Playlists
- Artistas y usuarios

Los resultados se ordenan por relevancia usando el algoritmo de distancia de Levenshtein para mejorar la precisión de las búsquedas.

### Gestión de Biblioteca

Los usuarios pueden organizar su contenido mediante:
- Canciones favoritas (liked songs)
- Playlists personalizadas
- Colecciones guardadas
- Seguimiento de artistas

### Creación de Contenido (Artistas)

Los usuarios con rol de artista tienen acceso a funcionalidades adicionales:
- Subida de canciones con metadata completa (título, género, mood, colaboradores)
- Creación de colecciones (álbumes, singles, EPs)
- Gestión de Artist Picks (canciones destacadas en su perfil)
- Subida de multimedia (audio, video, imágenes) a Firebase Storage

### Notificaciones Push

La aplicación integra OneSignal para notificaciones push en tiempo real, permitiendo:
- Notificaciones de nuevos seguidores
- Notificaciones de nuevas playlists de usuarios seguidos
- Notificaciones de nuevas colecciones de artistas seguidos

> [!IMPORTANT]
> Las notificaciones push requieren un **development build** ya que OneSignal necesita código nativo que no está disponible en Expo Go. Los usuarios deben generar un build de desarrollo usando `npx expo prebuild` o EAS Build.

## Almacenamiento y Multimedia

### Firebase Storage

La aplicación utiliza Firebase Storage para el almacenamiento de archivos multimedia:
- **Imágenes**: Fotos de perfil, covers de colecciones, banners
- **Audio**: Archivos de canciones
- **Video**: Contenido multimedia de canciones

El flujo de subida funciona de la siguiente manera:
1. El usuario selecciona un archivo desde su dispositivo
2. La aplicación sube el archivo a Firebase Storage usando el Firebase Admin SDK
3. Firebase retorna una URL de almacenamiento
4. La URL se envía al backend como parte de la metadata del contenido

### Autenticación con Firebase

Para acceder a Firebase Storage, la aplicación obtiene un token personalizado de Firebase desde el [[Servicio de usuarios|servicio de usuarios]], que genera el token usando el Firebase Admin SDK. Esto permite que el frontend tenga acceso controlado al storage sin exponer credenciales de servicio.

## Desarrollo y Deployment

### Configuración del Entorno

La aplicación utiliza variables de entorno inyectadas a través de `app.config.js`:
- `API_URL`: URL base del API Gateway
- Credenciales de Firebase (API Key, Project ID, Storage Bucket, etc.)
- Client IDs de Google para OAuth
- OneSignal App ID para notificaciones push



### Testing Local

Para desarrollo local, los desarrolladores pueden usar:
- **Android Emulator**: Emulador de Android Studio para testing en dispositivo virtual
- **Expo Go**: Para testing rápido de funcionalidades que no requieren código nativo (limitado, no soporta OneSignal ni Google Sign-In)
- **Physical Device**: Instalando el development build en un dispositivo Android físico

