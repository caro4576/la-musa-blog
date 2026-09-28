# La Musa Incarnata

Sitio web dinámico para el artista e ilustrador **Joaquín Vignatte**.

La Musa Incarnata reúne su obra, escritura, proyectos y libro en un espacio digital propio. El proyecto incorpora un panel de administración para que el artista pueda gestionar contenido sin depender de modificar directamente los archivos del frontend.

## Demo

- Sitio público: https://lamusaincarnata.com/
- API: https://api.lamusaincarnata.com/
- Repositorio: https://github.com/caro4576/la-musa-blog

## Características

- Sitio responsive para presentación del artista.
- Secciones de obras, escritura, perfil y proyectos.
- Carga dinámica de obras desde una API REST.
- CRUD de obras desde panel de administración.
- Carga y visualización de imágenes.
- Detalle individual de cada obra mediante su ID de MongoDB.
- Gestión dinámica del perfil.
- Contenido del libro «El Arte de Construir un Reino».
- Autenticación para las operaciones administrativas.
- Persistencia de datos en MongoDB Atlas.
- Despliegue del frontend y backend en Hostinger.

## Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- Diseño responsive

### Backend
- Node.js
- Express.js
- Mongoose

### Base de datos
- MongoDB Atlas

### Herramientas y despliegue
- Git
- GitHub
- Hostinger
- Thunder Client / herramientas de navegador para pruebas de API

## Arquitectura

La estructura general del proyecto separa el sitio público, el backend y los recursos estáticos:

```text
la-musa-blog/
├── assets/
├── css/
├── js/
│   ├── main.js
│   ├── obra.js
│   ├── obras-home.js
│   ├── obra-detalle.js
│   ├── escritura.js
│   ├── libro.js
│   └── perfil.js
├── backend/
│   ├── admin/
│   └── server.js
├── index.html
├── obra.html
├── obra-detalle.html
└── el-arte-de-construir-un-reino.html
```

## Flujo de una obra

1. El administrador inicia sesión.
2. Carga título, categoría, descripción e imagen.
3. El frontend del Admin envía los datos a la API.
4. Express recibe la petición y Mongoose trabaja con MongoDB.
5. La obra queda almacenada en MongoDB Atlas.
6. El sitio público consulta la API.
7. La obra aparece automáticamente en la sección correspondiente.
8. Al seleccionar una obra, se abre su página de detalle usando el `_id`.

## API

Endpoint público principal:

```text
GET https://api.lamusaincarnata.com/api/obras
```

Detalle de una obra:

```text
GET https://api.lamusaincarnata.com/api/obras/:id
```

Las operaciones de creación, edición y eliminación están protegidas por autenticación administrativa.

## Seguridad

Las credenciales y secretos se mantienen mediante variables de entorno en Hostinger.

**Nunca subir al repositorio:**

- `MONGO_URI`
- `MONGODB_URI`
- `ADMIN_PASSWORD`
- `ADMIN_USER`
- `ADMIN_AUTH_SECRET`

No compartir contraseñas ni valores completos de conexión de MongoDB.

## Despliegue

El proyecto utiliza:

- **GitHub** como repositorio de código.
- **Hostinger** para el sitio público y el backend.
- **MongoDB Atlas** para persistencia de datos.

Vercel no forma parte del despliegue actual.

## Lecciones del proyecto

Este proyecto permitió trabajar no solo en la construcción del frontend, sino también en:

- arquitectura frontend/backend;
- consumo de APIs REST;
- CRUD;
- autenticación;
- MongoDB y Mongoose;
- variables de entorno;
- despliegue;
- diagnóstico de errores;
- recuperación de versiones;
- carga dinámica de contenido;
- mantenimiento de un proyecto real.

## Respaldo

Para la entrega se creó la rama:

```text
respaldo-la-musa-entrega-2026-09-28
```

Esta rama funciona como punto de recuperación de la versión de entrega.

## Mantenimiento

Antes de realizar cambios importantes:

1. Crear un respaldo.
2. Cambiar una sola parte del sistema.
3. Probar frontend y backend.
4. Verificar MongoDB si el cambio afecta datos.
5. Confirmar el despliegue.
6. Recién después continuar con el siguiente cambio.

Evitar modificar frontend, backend, base de datos y despliegue simultáneamente.

## Créditos

**Desarrollo web:** Carolina Bibbo  
**Artista:** Joaquín Vignatte  
**Proyecto:** La Musa Incarnata

---

Proyecto desarrollado como espacio digital para la obra, escritura y proyectos de Joaquín Vignatte.
