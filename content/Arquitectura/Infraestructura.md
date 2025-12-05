Esta sección detalla dónde están desplegados y alojados todos los componentes del sistema.

## Microservicios

Todos los microservicios están desplegados en **Google Cloud Platform (GCP)**, específicamente en **Google Cloud Run**.

### ¿Por qué Google Cloud Run?

Se eligió Google Cloud Run como plataforma de despliegue por las siguientes razones:

- **Serverless**: No requiere gestión de servidores, lo que simplifica el mantenimiento y reduce la complejidad operativa
- **Escalado automático**: Escala automáticamente desde cero hasta miles de instancias según la demanda, optimizando costos
- **Contenedores**: Permite desplegar aplicaciones empaquetadas en contenedores Docker de manera sencilla
- **Herramientas de monitoreo integradas**: Cloud Run proporciona herramientas de monitoreo y logging integradas, eliminando la necesidad de configurar soluciones adicionales como Grafana o New Relic
- **Integración con GCP**: Se integra nativamente con otros servicios de Google Cloud, como Firebase Storage

### Monitoreo y Logging

Los servicios, al estar en Cloud Run, tienen un monitoreo y logging integrado con GCP. Esto nos permite tener un control total de los servicios y poder monitorear su rendimiento y estado sin necesidad de integrarnos con Grafana o New Relic. 

## Bases de Datos

### PostgreSQL

Las bases de datos PostgreSQL están alojadas en **Supabase**:
- **Users database**: Base de datos del [[Servicio de usuarios|servicio de usuarios]]
- **Catalog database**: Base de datos principal del [servicio de catálogo](Servicios/Catalogo/summary.md)

Supabase proporciona una plataforma gestionada para PostgreSQL con características adicionales como autenticación, almacenamiento y APIs REST automáticas.

### MongoDB

Las bases de datos MongoDB están alojadas en **MongoDB Atlas**:
- **Metrics database**: Base de datos de métricas del [servicio de catálogo](Servicios/Catalogo/summary.md)
- **Notifications database**: Base de datos del [[Servicio de notificaciones|servicio de notificaciones]]

MongoDB Atlas es la plataforma en la nube gestionada de MongoDB, que proporciona alta disponibilidad, escalado automático y herramientas de monitoreo.

## API Gateway

El API Gateway está alojado y gestionado por **Zuplo**. Zuplo es una plataforma _SaaS_ que proporciona:

- Hosting del API Gateway
- Gestión de autenticación y autorización
- Enrutamiento de peticiones a los microservicios
- Políticas de rate limiting y seguridad
- Plugins especializados para el manejo de autenticación y autorización

> Más detalles en su sección. 

## Frontend

### Aplicación Backoffice Web

La aplicación backoffice web está desplegada en **Vercel**. Vercel es una plataforma optimizada para aplicaciones Next.js que proporciona:

- Despliegue automático desde el repositorio
- CDN global para mejor rendimiento
- SSL automático
- Preview deployments para cada pull request

La aplicación está disponible en: [https://melody-backoffice-web.vercel.app](https://melody-backoffice-web.vercel.app)

### Aplicación Mobile

La aplicación mobile no está alojada, sino que se distribuye mediante **APK** (Android Package). Los usuarios descargan e instalan la aplicación directamente en sus dispositivos Android. La aplicación está desarrollada con **Expo** y actualmente solo está disponible para Android.

## Almacenamiento

### Firebase Storage

El almacenamiento de archivos multimedia se realiza mediante **Firebase Storage**, que técnicamente forma parte del proyecto de **Google Cloud Platform**. Firebase Storage proporciona:

- Almacenamiento de archivos multimedia (imágenes de usuarios/artistas/banners, videos y canciones)
- Integración nativa con otros servicios de Google Cloud
- Control de acceso mediante autenticación
- CDN para distribución eficiente de contenido

Tanto el backend como el frontend tienen acceso a este bucket, pero con diferentes métodos de autenticación:
- **Backend**: Utiliza una cuenta de servicio para autenticación
- **Frontend**: Utiliza autenticación de usuario para subir y descargar archivos

## CI/CD y Automatización

### GitHub Actions

Se utiliza **GitHub Actions** para la automatización de CI/CD. GitHub Actions está integrado con **Google Cloud Platform** para desplegar automáticamente los microservicios en Cloud Run cuando se realizan cambios en el repositorio.

El flujo de CI/CD incluye:
- Ejecución de tests automáticos
- Construcción de contenedores Docker
- Despliegue automático en Google Cloud Run
- Integración con GCP para autenticación y autorización

### Codecov

Se utiliza **Codecov** integrado con **GitHub Actions** para el análisis de cobertura de código. Codecov proporciona:

- Reportes de cobertura de código en cada pull request
- Tracking de la cobertura de código a lo largo del tiempo
- Integración con GitHub para visualizar la cobertura directamente en los PRs
- Alertas cuando la cobertura de código disminuye

Esta integración permite mantener un estándar de calidad en el código y asegurar que las nuevas funcionalidades estén adecuadamente testeadas.
