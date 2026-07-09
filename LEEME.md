# Alcaldía Bolivariana de Guarenas — Proyecto Web

Portal ciudadano de la Alcaldía de Guarenas (Municipio Ambrosio Plaza, Estado Bolivariano de Miranda).

## Cómo abrir
Abre `index.html` (redirige a `Home.dc.html`) o cualquier `.dc.html` en el navegador.
Para que carguen todos los recursos, sírvelo desde un servidor local (ej. `npx serve`) o súbelo a tu hosting.

## Estructura

```
Alcaldia Guarenas - Web/
├── index.html                 → redirige a Home.dc.html
├── Home.dc.html               → Inicio
├── Gestion.dc.html
├── Tramites.dc.html
├── Noticias.dc.html
├── Identidad.dc.html          → Identidad y Cultura / Turismo
├── Info Municipal.dc.html
├── Aseo Urbano.dc.html        → Camión 360° + mapa de rutas
├── Portal Admin.dc.html       → Panel de administración
├── Fundamentos de Marca.dc.html
├── scripts/                   → runtime y lógica compartida
│   ├── support.js             (runtime de componentes)
│   ├── fx.js                  (efectos, tema, menú móvil, header fijo)
│   ├── guarenas-store.js      (contenido editable)
│   ├── rutas-aseo.js          (datos de rutas de Aseo)
│   ├── image-slot.js
│   └── responsive.css         (adaptación móvil de todo el sitio)
└── assets/                    → imágenes, logos, videos y frames del camión
    └── truck360/              (7 frames del camión de Aseo)
```

## Notas
- Rutas de imágenes idénticas al diseño actual (`assets/…`), para que se vea tal cual.
- **Colores:** azul-índigo #4220e5, rojo #ea3755, naranja #ff9d00, verde Aseo #3a7d44. Tipografías Poppins + Varela Round.
- **Responsive:** `scripts/responsive.css` + menú hamburguesa (`fx.js`) adaptan todo a móvil sin alterar el escritorio.
- **Iconos:** SVG en línea dentro del HTML.
- Franja tricolor superior: amarillo–azul–rojo. Header fijo al hacer scroll.
