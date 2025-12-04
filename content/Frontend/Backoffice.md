---
title: Backoffice Web
---

# Vista general

El Backoffice Web de Melody es la aplicación de administración que permite a los administradores gestionar usuarios, moderar contenido, y visualizar métricas de la plataforma. Desarrollada con **Next.js 14** y **TypeScript**, se conecta exclusivamente con el [[Arquitectura#API Gateway|API Gateway]] mediante peticiones HTTP, delegando toda la lógica de negocio a los microservicios del backend.

> [!NOTE]
> El Backoffice fue desarrollado utilizando **v0 by Vercel**, una herramienta de generación de UI con IA, lo que explica la estructura de componentes altamente modularizada y el uso extensivo de shadcn/ui.

## Arquitectura

La aplicación implementa una arquitectura de cliente web moderno con las siguientes características:

- **Next.js 14 con App Router**: Routing basado en archivos, Server Components y layouts anidados
- **SWR para data fetching**: Caching automático, revalidación y deduplicación de peticiones
- **shadcn/ui + Radix UI**: Sistema de componentes accesibles y reutilizables (51 componentes)
- **Recharts**: Visualización de métricas con gráficos interactivos

### Cliente HTTP Centralizado

El cliente API (`lib/api.ts`) implementa funcionalidades críticas:

- **Enrutamiento automático**: Determina el microservicio correcto según el endpoint (`/users/`, `/catalog/`, `/auth/`)
- **Refresh automático de tokens**: Intercepta respuestas 401, refresca el access token y reintenta la petición original
- **Manejo de errores centralizado**: Transforma errores de la API en mensajes consistentes


## Funcionalidades Principales

### Gestión de Usuarios

El módulo de usuarios permite:

- Visualizar, crear, editar y eliminar usuarios
- Filtros por rol (Listener, Artist, Admin) y estado (Active, Blocked)
- Bloquear/desbloquear usuarios
- Métricas en tiempo real:
  - Total de usuarios con cambio porcentual
  - Distribución de roles por región
  - Usuarios bloqueados
  - Últimos registros

### Gestión de Catálogo

El módulo de catálogo permite administrar contenido:

- Visualizar canciones y colecciones (álbumes, EPs, singles, playlists)
- Filtros por tipo, estado, fecha de lanzamiento y presencia de video
- Bloquear/desbloquear contenido con razón y comentarios
- Gestión de disponibilidad regional
- Audit trail completo de cambios administrativos

### Dashboards de Métricas

Tres dashboards especializados:

**Métricas de Usuarios**: Evolución temporal, nuevos registros, usuarios activos, distribución de roles

**Métricas de Contenido**: Tendencias de reproducciones, top canciones/playlists/colecciones, top artistas

**Métricas de Artistas**: Overview individual, top contenido, distribución geográfica con mapa 3D, historial de métricas

Todas las métricas soportan filtrado por fechas, región, y exportación a CSV/Excel.

## Autenticación y Seguridad

### Flujo de Autenticación

1. Login con validación de rol `ADMIN`
2. Almacenamiento de access token y refresh token en sessionStorage
3. Inyección automática del header `x-access-token` en todas las peticiones
4. Refresh automático al expirar el access token

### Protección de Rutas

- Usuarios no autenticados → redirigidos a `/login`
- Usuarios sin rol ADMIN → rechazados con error

## Deployment

El proyecto se despliega en **Vercel** con la siguiente estrategia:

- **Production Branch**: Solo `main` se despliega automáticamente
- **Preview Deployments**: Deshabilitados para otras branches
- **Workflow**: Desarrollo en `dev` → Testing local → Merge a `main` → Deploy automático

## Decisiones de Diseño

### Uso de v0 by Vercel

> [!IMPORTANT]
> Se utilizó v0 para generar la interfaz inicial del backoffice.

**Justificación**: v0 permitió acelerar significativamente el desarrollo de la UI administrativa, generando componentes completos y funcionales basados en shadcn/ui. Esto fue especialmente útil para un backoffice donde la prioridad es la funcionalidad sobre el diseño personalizado. Los componentes generados son totalmente customizables y siguen mejores prácticas de accesibilidad.


### SWR para Data Fetching

> [!NOTE]
> Se eligió SWR sobre otras soluciones como React Query o fetch nativo.

**Justificación**: SWR proporciona caching automático, revalidación inteligente y deduplicación de peticiones out-of-the-box. Al ser desarrollado por Vercel, se integra perfectamente con Next.js y requiere mínima configuración. Para un backoffice donde los datos cambian frecuentemente y múltiples componentes consultan los mismos endpoints, SWR optimiza automáticamente el rendimiento sin código adicional.
