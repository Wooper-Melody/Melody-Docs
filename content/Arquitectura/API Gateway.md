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


