# Overview

El servicio de usuarios es el microservicio encargado de la gestión de usuarios, autenticación y autorización, como tambien del sistema de follow/unfollow entre usuarios. Este servicio maneja el ciclo de vida completo de los usuarios, ya sean del tipo `artists` o `listeners`, desde el registro hasta la gestión de perfiles. Sus responsabilidades principales son:

- Gestión de usuarios y perfiles (artistas y oyentes).
- Autenticación y autorización mediante JWT.
- Sistema de follow/unfollow entre usuarios.
- Recuperación de contraseña mediante tokens por email.
- Integración con servicios externos (Google OAuth, Firebase, Mailjet).

## Arquitectura

El servicio de usuarios implementa una arquitectura de capas tradicional con Spring Boot, donde la autenticación se maneja mediante JWT con criptografía asimétrica (RSA). El sistema utiliza `access tokens` y `refresh tokens` para la autenticación de usuarios.


![Arquitectura del Notification Service](Servicios/assets/user-service-arq.png)


## Tecnologías

Las tecnologías empleadas fueron las siguientes:

*   **Spring Boot**: Framework principal para el desarrollo del servicio.
*   **PostgreSQL**: Base de datos relacional para persistencia de datos de usuarios.
*   **Supabase**: Utilizado como capa de abstracción y servicios adicionales sobre PostgreSQL.
*   **Firebase Admin SDK**: Para la generación de tokens personalizados de Firebase.
*   **Mailjet**: Servicio de envío de emails para recuperación de contraseñas.

## Seguridad y Autenticación

La seguridad es un componente crítico de este servicio, implementando las siguientes estrategias:

### JWT (JSON Web Tokens)

Se utiliza JWT para la autenticación de usuarios, con tokens firmados usando criptografía asimétrica (RSA).

### Access y Refresh Tokens

*   **Access Tokens**: Tokens de corta duración (15 minutos) que contienen la información del usuario autenticado.
*   **Refresh Tokens**: Tokens de larga duración (30 días) almacenados en base de datos que permiten renovar los access tokens sin requerir login nuevamente.
*   **Rotación de Tokens**: Al usar un refresh token, se revoca el anterior y se genera uno nuevo, mejorando la seguridad.

### X-Access-Token Header

> [!IMPORTANT]
> El token de acceso se transmite a través del header personalizado `x-access-token` en lugar del estándar `Authorization: Bearer`.

**Justificación**: El **Zuplo API Gateway** utiliza el header `Authorization: Bearer` para su propia autenticación a nivel de gateway. Si el UserService también utilizara este mismo header para autenticar a los usuarios finales, existiría un conflicto donde ambos sistemas intentarían interpretar el mismo header, causando que uno "pise" al otro. Por esta razón, se decidió usar `x-access-token` para la autenticación de usuarios, permitiendo que ambos sistemas coexistan sin interferencias.

### Criptografía Asimétrica

Se utilizan pares de claves RSA (Private y Public Keys):

*   **Private Key**: Utilizada exclusivamente por el UserService para **firmar** los tokens JWT.
*   **Public Key**: Expuesta a través del endpoint `/auth/jwks` para que otros servicios puedan **verificar** la autenticidad de los tokens sin necesidad de acceso a la clave privada.

Esto asegura que solo el servicio de usuarios pueda generar tokens válidos, mientras que otros servicios pueden verificarlos de forma independiente.

## Autenticación con Google

El servicio soporta autenticación mediante Google OAuth, permitiendo a los usuarios registrarse e iniciar sesión usando sus cuentas de Google. El flujo utiliza Firebase para la validación de tokens de Google y la creación de usuarios en el sistema.

## Sistema de Follow/Unfollow

Los usuarios pueden seguir a artistas dentro de la plataforma. El sistema mantiene:

*   Relaciones bidireccionales entre usuarios (follower/following).
*   Contadores automáticos de seguidores y seguidos.
*   Validaciones para prevenir auto-seguimiento y seguimientos duplicados.
*   Eventos webhook enviados al servicio de notificaciones cuando ocurre un follow/unfollow.

## Recuperación de Contraseña

El sistema de recuperación de contraseña implementa:

*   Tokens numéricos de 6 dígitos generados de forma segura.
*   Expiración automática de tokens después de 5 minutos.
*   Envío de tokens por email utilizando Mailjet.
*   Revocación automática de tokens anteriores al generar uno nuevo.

## Base de Datos

### Elección de PostgreSQL

> [!NOTE]
> PostgreSQL fue seleccionado como base de datos principal y unica para este microservicio.

**Justificación**: PostgreSQL es ideal para el servicio de usuarios debido a:

*   **Integridad Referencial**: Las relaciones entre usuarios, perfiles de artistas, tokens de refresh, y relaciones de follow/unfollow requieren constraints de integridad que PostgreSQL maneja de forma robusta.
*   **ACID Compliance**: Las operaciones de autenticación y gestión de tokens requieren transacciones atómicas para evitar estados inconsistentes.
*   **Consultas Complejas**: El sistema de follow/unfollow y las consultas de perfiles requieren JOINs eficientes y consultas relacionales complejas.
*   **Integración con Supabase**: Supabase proporciona una capa adicional de servicios sobre PostgreSQL, facilitando el desarrollo y despliegue.

Dado estas propiedades que provee PostgreSQL, y que al momento de diseñar el sistema inicial fue notoriamente viable usar una base de datos relacional, optamos por esta tecnologia. 

La persistencia de datos se maneja a través de PostgreSQL, integrándose con Supabase para aprovechar sus capacidades de gestión, seguridad y APIs automáticas.

