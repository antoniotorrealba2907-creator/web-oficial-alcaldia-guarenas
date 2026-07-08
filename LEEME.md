# Portal Web — Alcaldía Bolivariana de Guarenas

Sitio web institucional. Conjunto de páginas HTML autónomas con JavaScript propio,
imágenes reales organizadas por página y un panel de administración editable.

---

## 1. Cómo abrir / ejecutar

Sirve la carpeta con un servidor local (no la abras con doble clic `file://`,
algunos navegadores bloquean recursos locales):

```bash
# dentro de la carpeta "Alcaldia Guarenas - Web"
python3 -m http.server 8000
# abre  http://localhost:8000/          (index.html redirige al Inicio)
```

**Entrada:** `index.html` → redirige a `Home.dc.html`

---

## 2. Estructura de carpetas

```
Alcaldia Guarenas - Web/
├── README.md / LEEME.md
├── index.html                     ← entrada (redirige al Inicio)
│
├── Home.dc.html                   ← INICIO
├── Gestion.dc.html                ← Gestión / obras / línea de tiempo
├── Tramites.dc.html               ← Trámites en línea
├── Noticias.dc.html               ← Noticias y comunicados
├── Identidad.dc.html              ← Identidad, cultura y tradiciones
├── Info Municipal.dc.html         ← Información del municipio + agenda
├── Aseo Urbano.dc.html            ← Rutas de aseo, mapa y camión 360°
├── Portal Admin.dc.html           ← Panel de administración
├── Fundamentos de Marca.dc.html   ← Sistema de diseño (marca)
│
├── scripts/                       ← todo el JavaScript
│   ├── support.js                 · runtime de los componentes
│   ├── guarenas-store.js          · contenido editable (noticias, comunicado, agenda)
│   ├── rutas-aseo.js              · datos de rutas de recolección
│   ├── image-slot.js              · arrastrar/soltar imágenes
│   └── fx.js                      · efectos (tema, animaciones)
│
└── assets/                        ← IMÁGENES ORGANIZADAS POR PÁGINA
    ├── Home/                      · fotos exclusivas del Inicio
    ├── Gestion/                   · línea de tiempo, plaza
    ├── Tramites/                  · banner de trámites
    ├── Identidad/                 · cultura, parranda, video, cascada
    ├── Info-Municipal/            · municipio, seguridad, inversión
    ├── Fundamentos-Marca/         · logos de la guía de marca
    └── _compartidas/              · imágenes usadas por varias páginas
        ├── marca/                 · logos institucionales (escudo, isotipo, Vive)
        └── camion-360/            · g01–g07 (fotogramas del camión de aseo)
```

**Regla de organización:** cada imagen que usa **una sola página** vive en la carpeta de
esa página; las que comparten **varias páginas** están en `_compartidas/`. Las páginas
`.dc.html` permanecen juntas en la raíz porque se enlazan entre sí (menú superior).

---

## 3. Sistema de diseño

Guía visual completa en `Fundamentos de Marca.dc.html`.

**Colores**
| Uso                     | Color     |
|-------------------------|-----------|
| Azul índigo (primario)  | `#4220e5` |
| Rojo                    | `#ea3755` |
| Naranja                 | `#ff9d00` |
| Verde Aseo              | `#3a7d44` |
| Fondo crema/cálido      | `#f3ede1` |

**Tipografía:** Poppins (títulos/UI), Varela Round (acentos), Lora (cuerpos en Noticias).

**Logos** en `assets/_compartidas/marca/` (compartidos) y `assets/Fundamentos-Marca/` (variantes de la guía).

---

## 4. Panel de administración

`Portal Admin.dc.html` edita, sin tocar código: comunicado del alcalde, noticias,
agenda cultural y rutas de aseo. Se guarda en el navegador (localStorage) vía
`scripts/guarenas-store.js` y `scripts/rutas-aseo.js`. Para producción, conectar
estos dos módulos a un backend/base de datos real.

---

## 5. Dependencias externas (CDN — requieren internet)

- **Google Fonts** (Poppins, Varela Round, Lora)
- **Leaflet 1.9.4** + **OpenStreetMap** (mapas en Inicio y Aseo Urbano)

El resto (imágenes, video, scripts) es local.
