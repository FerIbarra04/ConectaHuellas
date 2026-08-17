# Conecta Huellas

Sistema web desarrollado para la **Coordinación de Medio Ambiente y Protección Animal del Municipio de Chihuahua**, cuyo objetivo es digitalizar y optimizar el proceso de adopción e incorporación de animales mediante una plataforma moderna, accesible y fácil de administrar.


#  Descripción

Conecta Huellas es una plataforma web que permite a la ciudadanía consultar animales disponibles para adopción, enviar solicitudes de adopción o incorporación de animales y acceder a información de concientización sobre la tenencia responsable.

Además, cuenta con un panel administrativo que facilita la gestión de animales, solicitudes, etiquetas, contenido de la página principal y estadísticas del sistema.


#  Objetivo

Desarrollar una plataforma web que facilite la administración de los procesos de adopción e incorporación de animales mediante herramientas digitales que mejoren la organización, el seguimiento de solicitudes y la difusión de animales disponibles para adopción.


#  Funcionalidades principales

## Sitio Público

- Landing Page institucional.
- Catálogo de animales disponibles.
- Consulta del detalle de cada animal.
- Envío de solicitudes de adopción.
- Envío de solicitudes de incorporación de animales.
- Sección de concientización.

## Panel Administrativo

- Dashboard.
- Gestión de animales.
- Gestión de etiquetas.
- Gestión de Landing Page.
- Gestión de solicitudes de incorporación.
- Gestión de solicitudes de adopción.
- Estadísticas.
- Inicio de sesión mediante autenticación JWT.

---

#  Tecnologías utilizadas

| Tecnología | Uso |
|------------|-----|
| Next.js 16 | Frontend |
| React 19 | Desarrollo de interfaces |
| TypeScript | Desarrollo del sistema |
| Tailwind CSS | Estilos |
| Express.js | Backend |
| MySQL | Base de datos |
| Railway | Hospedaje de la base de datos |
| Cloudinary | Gestión de imágenes y videos |
| Resend | Envío de correos electrónicos |


# 🏗️ Arquitectura general

```text
Frontend (Next.js)
        │
        ▼
Backend (Express.js)
        │
        ▼
MySQL (Railway)
       ├────────► Cloudinary
       └────────► Resend
```

---

# Estructura del proyecto

```text
ConectaHuellas
│
├── backend
├── frontend
├── Documentacion
└── Railway
```

---

#  Instalación

## Backend

```bash
cd backend
npm install
node server.js
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

#  Variables de entorno

El proyecto incluye los siguientes archivos de ejemplo:

- `backend/.env.example`
- `frontend/.env.example`

Cada servicio deberá configurarse utilizando sus propias credenciales (MySQL, Railway, Cloudinary, Resend, JWT, entre otros).

---

#  Base de datos

Dentro de la carpeta **Documentacion** se incluye el respaldo completo de la base de datos:

- `ConectaHuellas.sql`

---

#  Documentación incluida

La carpeta **Documentacion** contiene:

- Documento de Estadía.
- Manual de Usuario.
- Documentación Técnica.
- Respaldo de la Base de Datos (`ConectaHuellas.sql`).

---

#  Desarrolladora

**Luisa Fernanda Ibarra Anchondo**

Ingeniería en Desarrollo y Gestión de Software

Universidad Tecnológica de Chihuahua



#  Cliente

**Coordinación de Medio Ambiente y Protección Animal**

Municipio de Chihuahua

---

# 📌 Estado del proyecto

**Versión final** desarrollada como parte del proyecto de Estadía Profesional de la Universidad Tecnológica de Chihuahua.

---

© 2026 Conecta Huellas. Todos los derechos reservados.
