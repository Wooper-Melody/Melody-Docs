La aplicación se divide en dos secciones principales:
- <u>**Backend**</u>: Divido en microservicios, cada uno con sus propias bases de datos y APIs. Este incluye el API gateway. 
- <u>**Frontend**</u>: 
    - **Mobile**: La aplicación mobile que sería la que usa el usuario para interactuar con la aplicación.
    - **Backoffice web**: La aplicación web que sería la que usa el equipo de desarrollo para gestionar la aplicación, los usuarios, 

A continuación se puede ver un diagrama de la arquitectura general con la infraestructura del proyecto: 

![Arquitectura general](Arquitectura/assets/arquitectura-general.png)

> Link al diagrama para mayor claridad: [Arquitectura general](Arquitectura/assets/arquitectura-general.png)

En la imagen se puede observar como el _frontend_ se conecta al _backend_ unicamente a través del API gateway. El API gateway es el encargado de recibir las peticiones del frontend y redirigirlas a los microservicios correspondientes.

De esta manera tenemos un único punto de entrada para el frontend, lo que nos permite tener un control más fácil sobre la seguridad y la autenticación (Más en detalle en su sección). 

A su vez se tiene un bucket de almacenamiento en Firebase Storage para el almacenamiento de archivos multimedia, como por ejemplo:
- Imagenes de usuarios/artistas/banners
- Multimedia de contenido (videos y canciones).

Tanto parte del backend como el frontend tienen acceso a este bucket pero el backend por temas de autenticación con un cuenta de servicio y el frontend con un usuario autenticado para subir y descargar archivos.

## Microservicios

Se tiene en total tres microservicios que se comunican entre si como se veia en el diagrama anterior:
- <u>**[[Servicio de usuarios|Usuarios]]**</u>: Gestiona la autenticación y perfiles de los usuarios.
- <u>**[Catalogo](Servicios/Catalogo/summary.md)**</u>: Gestiona el catálogo de contenido incluyendo las métricas del mismo. Esto incluye la gestión de playlists, colecciones, canciones, artists picks, etc. 
- <u>**[[Servicio de notificaciones|Notificaciones]]**</u>: Gestiona las notificaciones de los usuarios. 

Cada uno de estos microservicios tiene sus propias bases de datos y APIs. Todos se encuentran desplegados en **Google Cloud Run**.


## API Gateway

En vez de una implementación manual se decidió usar [**Zuplo**](https://www.zuplo.com/) para el API gateway. Este se encarga de la autenticación y autorización de las peticiones y de redirigirlas a los microservicios correspondientes.

## Aplicación Mobile

La aplicación mobile se encuentra desarrollada con **Expo** y es accedida a través de un APK. Actualmente no se encuentra disponible en la store de Google. 

> Es importante aclarar que fue desarrollada con soporte solamente para Android.

## Aplicación Backoffice web

La aplicación backoffice web se encuentra desarrollada con **Next.js**. Actualmente se encuentra desplegada en **Vercel** con el siguiente enlace: [https://melody-backoffice-web.vercel.app](https://melody-backoffice-web.vercel.app)

