
La arquitectura del proyecto está basada en microservicios, donde cada servicio es independiente y tiene su propia base de datos. Esta separación permite escalar, mantener y desarrollar cada componente de manera independiente.

![Arquitectura general](Arquitectura/assets/arquitectura-general.png)
> Link al diagrama para mayor claridad: [Arquitectura general](Arquitectura/assets/arquitectura-general.png)

En el diagrama se puede observar la arquitectura general del proyecto. Se pueden observar las diferentes partes que conforman el proyecto y como se comunican entre si.
- <u>**Frontend**</u>: La aplicación mobile y el backoffice web.
- <u>**Backend**</u>: El API gateway y los microservicios, incluyendo las bases de datos.
- <u>**Infraestructura**</u>: Firebase Storage para el almacenamiento de archivos multimedia.

## Microservicios

El sistema está compuesto por tres microservicios principales:

- <u>**[[Servicio de usuarios|Usuarios]]**</u>: Gestiona la autenticación y perfiles de los usuarios. Implementado en Java con Spring Boot, utiliza PostgreSQL como base de datos.
- <u>**[Catalogo](Servicios/Catalogo/summary.md)**</u>: Gestiona el catálogo de contenido incluyendo las métricas del mismo. Implementado en Java con Spring Boot, utiliza PostgreSQL para el catálogo y MongoDB para las métricas.
- <u>**[[Servicio de notificaciones|Notificaciones]]**</u>: Gestiona las notificaciones de los usuarios desarrollado en Python con FastAPI. Utiliza MongoDB como base de datos.

Cada microservicio tiene sus propias bases de datos y APIs. De esta manera cada uno tiene la responsabilidad de gestionar su propio contenido y funcionalidad. 


## API Gateway

El **API Gateway** actúa como el único punto de entrada para todas las peticiones del frontend. Se utiliza [**Zuplo**](https://www.zuplo.com/) como solución de API gateway, el cual se encarga de:

- **Autenticación y autorización**: Valida las credenciales de las peticiones antes de permitir el acceso a los microservicios
- **Enrutamiento**: Redirige las peticiones al microservicio correspondiente según la ruta y el tipo de operación
- **Control de acceso**: Gestiona los permisos y políticas de acceso a cada endpoint

Esta arquitectura centraliza la seguridad y simplifica la gestión de las peticiones, evitando que el frontend necesite conocer la ubicación o los detalles internos de cada microservicio.

> Para más detalles sobre el API Gateway, ver [API Gateway](API-Gateway#funcionalidades).

## Comunicación entre Componentes

### Frontend → Backend

El frontend (tanto la aplicación mobile como el backoffice web) se comunica exclusivamente con el API Gateway mediante peticiones HTTP. El API Gateway se encarga de:

1. Validar la autenticación de la petición
2. Enrutar la petición al microservicio correspondiente
3. Retornar la respuesta al frontend

### Microservicios → Microservicios

Los microservicios se comunican entre sí mediante:

- **APIs REST**: Para comunicación síncrona entre servicios. Por ejemplo, cuando el [servicio de catálogo](Servicios/Catalogo/summary.md) necesita información de usuario, realiza una petición REST al [[Servicio de usuarios]].
- **Webhooks**: Para eventos asíncronos. Los servicios actúan como `producers` enviando eventos a otros servicios que funcionan como `consumers`. Por ejemplo:
  - El [[Servicio de usuarios|servicio de usuarios]] y catálogo envían eventos al [[Servicio de notificaciones|servicio de notificaciones]] cuando ocurren acciones relevantes (creación de playlist, [[Servicio de usuarios#Sistema de Follow/Unfollow|nuevo seguidor]], etc.)
  - El [[Servicio de notificaciones|servicio de notificaciones]] recibe estos eventos y los procesa para generar y enviar notificaciones

### Integraciones Externas

Los microservicios pueden integrarse con servicios externos según sus necesidades específicas. Por ejemplo:
- El [[Servicio de notificaciones|servicio de notificaciones]] utiliza **OneSignal** para el envío de notificaciones push
- El [[Servicio de usuarios#Recuperación de Contraseña|servicio de usuarios]] utiliza **Mailjet** para el envío de correos electrónicos
- El [[Servicio de usuarios#Autenticación con Google|servicio de usuarios]] también utiliza autenticación con Google para usuarios que deseen iniciar sesión con su cuenta de Google.

Los detalles de estas integraciones se documentan en la sección específica de cada servicio.
