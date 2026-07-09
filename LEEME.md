# Alcaldía Bolivariana de Guarenas — Portal Web

Sitio estático (HTML + CSS + JavaScript). Se abre sin servidor: doble clic en
`index.html` (redirige a `Home.dc.html`) o abre directamente cualquier página.

## Estructura

```
Alcaldia Guarenas - Web/
├── index.html                 → redirige al Inicio
├── Home.dc.html               → Inicio
├── Gestion.dc.html            → Gestión
├── Tramites.dc.html           → Trámites en línea
├── Noticias.dc.html           → Noticias
├── Identidad.dc.html          → Identidad y Cultura
├── Info Municipal.dc.html     → Información Municipal
├── Aseo Urbano.dc.html        → Aseo Urbano
├── Portal Admin.dc.html       → Panel de administración
├── Fundamentos de Marca.dc.html → Sistema de diseño / manual de marca
│
├── scripts/                   → JavaScript y CSS compartidos
│   ├── support.js             (runtime de las páginas)
│   ├── fx.js                  (tema, efectos, MENÚ HAMBURGUESA móvil)
│   ├── responsive.css         (adaptación a móvil — cargar de último)
│   ├── guarenas-store.js      (CMS ligero: noticias, comunicado, agenda)
│   ├── rutas-aseo.js          (rutas y horarios de recolección)
│   └── image-slot.js          (componente de foto arrastrable)
│
├── assets/
│   ├── _compartidas/          → imágenes usadas por varias páginas
│   │   ├── marca/             → logos e isotipos (Alcaldía y ¡Vive Guarenas!)
│   │   └── camion-360/        → 7 fotogramas del camión (giro 360°)
│   ├── Home/                  → imágenes propias del Inicio
│   ├── Gestion/               → línea de tiempo y foto de gestión
│   ├── Tramites/              → banner de trámites
│   ├── Identidad/             → video cultural, parranda, turismo
│   └── Info-Municipal/        → banners de municipio, seguridad, inversión
│
└── documentos-fuente/         → PDFs originales (mapa turístico, plan, folletos)
```

## Responsive (móvil)

- **`scripts/responsive.css`** contiene TODA la adaptación móvil dentro de media
  queries; en escritorio el diseño no cambia. Debe cargarse de último en el
  `<head>` (después de `fx.js`). Ya está enlazado en las 9 páginas.
- **Menú hamburguesa:** lo inyecta `fx.js` automáticamente en pantallas ≤900px.
  No requiere marcado extra en las páginas.
- Puntos de quiebre: ≤900px (menú), ≤760px (apila columnas y escala títulos),
  ≤430px (ajustes finos).

## Marca

- Colores: azul-índigo `#4220e5`, rojo `#ea3755`, naranja `#ff9d00`,
  verde Aseo `#3a7d44`. Fondo cálido `#f3ede1`.
- Tipografías: **Poppins** (titulares) + **Varela Round** (texto).
- El detalle completo del sistema está en `Fundamentos de Marca.dc.html`.

## Dependencias externas (requieren internet)

- Google Fonts (Poppins, Varela Round).
- Leaflet 1.9.4 (mapas de Aseo y turismo), vía unpkg.

Para uso 100% sin conexión, descarga esas librerías y cámbialas por rutas locales.

## Panel de administración

`Portal Admin.dc.html` permite editar noticias, el comunicado del alcalde, la
agenda cultural y las rutas de aseo. Los cambios se guardan en el navegador
(localStorage) y se reflejan en las páginas públicas del mismo equipo/navegador.
