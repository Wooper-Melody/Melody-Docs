---
title: API Gateway
---

El API Gateway es el encargado de recibir las peticiones del frontend y redirigirlas a los microservicios correspondientes. Se utiliza [**Zuplo**](https://www.zuplo.com/) como solución de API gateway, el cual se encarga de:

- **Autenticación y autorización**: Valida las credenciales de las peticiones antes de permitir el acceso a los microservicios
- **Enrutamiento**: Redirige las peticiones al microservicio correspondiente según la ruta y el tipo de operación
- **Control de acceso**: Gestiona los permisos y políticas de acceso a cada endpoint teniendo en cuenta los usuarios bloqueados. 

Esta arquitectura centraliza la seguridad y simplifica la gestión de las peticiones, evitando que el frontend necesite conocer la ubicación o los detalles internos de cada microservicio.

## Funcionalidades

### Autenticación y autorización

Al aprovecharse de que se utiliza un [cifrado-asimétrico](Servicios/Usuarios/Servicio-de-usuarios.md#criptografía-asimétrica) para los tokens JWT, se puede validar la autenticidad del token sin necesidad de conocer la clave privada. Esto se hace mediante la validación de la firma del token. 

Esto nos permite que el gateway pueda validar rápidamente la autenticidad del token y que los otros servicios no se tengan que preocupar por la autenticación y autorización. 

### Enrutamiento

Como cualquier api gateway, el gateway se encarga de enrutar las peticiones a los microservicios correspondientes. Esto se hace mediante la ruta de la petición. 

### Control de acceso con bloqueados

El gateway es el encargado de gestionar los usuarios bloqueados y no permitirles acceder a los microservicios. Esto se hace utilizando un HashMap que tiene Zuplo para almacenar los usuarios bloqueados durante 15 minutos que es lo que dura el access token. Esto se activa luego del endpoint de bloqueo al bloquear un usuario. 

De esta manera además de validar el token se fija rápidamente en el HashMap si el usuario está bloqueado y no permitirle acceder a los microservicios. 

## Integración con GCP

En teoría pudimos integrar la autenticación con GCP para que solamente se puedan acceder a los microservicios desde el gateway pero por tiempos de desarrollo y complejidad se decidió dejarlo de lado. 


## Documentación

Zuplo facilita la centralización y exposición de la documentación de la API gracias a su integración nativa con OpenAPI. Esto permite:

- **Acceso unificado a la documentación**: Todos los endpoints de los microservicios se agrupan automáticamente bajo un único portal de desarrollador, lo que simplifica la consulta y el testing de la API.
- **Actualización automática**: Al vincular los archivos Swagger (OpenAPI) de cada servicio, cualquier cambio en la especificación se refleja de manera instantánea en el portal, asegurando que los consumidores de la API siempre tengan acceso a la información más actualizada.
- **Portal de desarrollador personalizable**: Zuplo provee un portal web donde los desarrolladores pueden explorar, probar endpoints de manera interactiva, ver ejemplos de peticiones/respuestas y gestionar el acceso mediante generación de tokens.
- **Control de acceso granular**: Puedes definir qué partes de la documentación y endpoints están disponibles públicamente y cuáles requieren autenticación.

De esta manera, Zuplo no solo centraliza la seguridad y el acceso a los microservicios, sino también la experiencia de desarrollo, haciendo más fácil tanto el consumo como el mantenimiento de la documentación técnica.

Tenemos divida la documentación entonces en tres partes haciendo diferencia en cada servicio: 
- Users Service
- Catalog Service
- Notifications Service

El portal se puede acceder en : [Portal de desarrollador](https://melody-gateway-main-0d30d7f.zuplo.site/users/auth-controller)

