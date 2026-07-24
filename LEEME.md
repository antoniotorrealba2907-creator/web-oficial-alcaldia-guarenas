# Alcaldía Bolivariana de Guarenas — Proyecto Web

Sitio estático completo (HTML + CSS + JS). **No requiere servidor ni instalación**: abre `index.html`
en cualquier navegador o súbelo tal cual a Hostinger, Netlify, Vercel o cualquier hosting estático.

## Estructura

```
index.html                → redirige al Home
Home.dc.html              → Inicio
Gestion.dc.html           → Gestión de gobierno
Tramites.dc.html          → Trámites (SAIME, SAREN, INTT, SATMAP…)
Noticias.dc.html          → Noticias · Noticia.dc.html → detalle de noticia
Identidad.dc.html         → Identidad, cultura, turismo y agenda cultural
Info Municipal.dc.html    → Info municipal, emergencias y directorio
Aseo Urbano.dc.html       → Servicio de aseo (rutas, mapa, estadísticas)
Policia.dc.html           → Policía de Guarenas
Ambulancia.dc.html        → Ambulancia y emergencias médicas
CPNNA.dc.html             → Consejo de Protección de Niños, Niñas y Adolescentes
Portal Admin.dc.html      → Portal de administración (contenido editable)
Fundamentos de Marca.dc.html → Sistema de diseño / manual de marca

scripts/
  support.js          → runtime de las páginas (obligatorio)
  fx.js               → efectos, menú móvil, barra inferior, pantalla de carga
  guarenas-store.js   → contenido editable (comunicado, noticias, agenda, rutas, cifras)
  rutas-aseo.js       → datos de rutas de aseo por sector
  image-slot.js       → espacios para subir/reemplazar fotos
  video-slot.js       → espacios para subir video
  responsive.css      → adaptación móvil de todo el sitio

assets/
  _compartidas/       → recursos usados por varias páginas
  _compartidas/marca/ → logos e isotipos (Alcaldía, Vive Guarenas, CPNNA)
  _compartidas/camion-360/ → cuadros del camión rotatorio
  Home/  Gestion/  Tramites/  Noticias/  Identidad/
  Info-Municipal/  Servicios/  Portal-Admin/  Fundamentos-Marca/
                      → fotos y videos propios de cada página
```

## Portal de administración

`Portal Admin.dc.html` permite editar sin tocar código: comunicado del alcalde, noticias,
agenda cultural y días festivos, programa y ruta de la festividad, rutas de aseo, cifras de
gestión, línea de tiempo, perfil y usuarios con permisos.

Los cambios se guardan en el navegador (localStorage) y se reflejan de inmediato en las páginas
públicas. **Para producción multiusuario** hay que conectar una base de datos: toda la lectura y
escritura pasa por `scripts/guarenas-store.js` (`GStore.get` / `GStore.set`), así que basta
reemplazar esas dos funciones por llamadas a una API.

## Notas

- Los iconos son SVG en línea dentro del HTML (no hay carpeta de iconos).
- El mapa usa OpenStreetMap y el buscador de lugares usa Nominatim (requieren internet).
- Tipografías: Poppins y Varela Round (Google Fonts, requieren internet).
- Marca: azul índigo `#4220e5`, rojo `#ea3755`, naranja `#ff9d00`, verde Aseo `#3a7d44`,
  fondo crema `#f3ede1`.
