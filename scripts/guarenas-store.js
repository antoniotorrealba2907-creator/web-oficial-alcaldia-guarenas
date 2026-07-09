/* =====================================================================
   GStore — CMS ligero de la Alcaldía de Guarenas
   Guarda el contenido editable en el navegador (localStorage) y avisa
   a las páginas públicas cuando algo cambia. El Portal Admin escribe;
   las páginas públicas leen.
   NOTA: el acceso por contraseña es del lado del cliente (no es una
   seguridad real de servidor). Para uso interno / demostración.
   ===================================================================== */
(function () {
  var P = {
    plaza: 'assets/news-plaza.png', vial: 'assets/news-vialidad.png',
    salud: 'assets/news-salud.png', alumbrado: 'assets/news-alumbrado.png',
    agua: 'assets/news-agua.png', transporte: 'assets/news-transporte.png',
    aerea: 'assets/banner-noticias.png', brigada: 'assets/news-brigada.png'
  };

  var DEFAULTS = {
    // ---- Comunicado del alcalde ----
    g_comunicado: {
      active: true,
      eyebrow: 'Mensaje del alcalde',
      title: 'El alcalde se dirige a la comunidad guarenera',
      body: [
        'Queridos vecinos, quiero compartir con ustedes los avances alcanzados en este primer semestre y los compromisos que asumimos para los próximos meses. Cada obra y cada programa nace del trabajo conjunto con nuestras comunidades.',
        'Seguiremos construyendo, juntos, una Guarenas más humana, segura y con oportunidades para todos.'
      ],
      author: 'Antonio Galíndez',
      role: 'Alcalde de Guarenas',
      initials: 'AG',
      photo: 'assets/comunicado-alcalde.png'
    },

    // ---- Noticias ----
    g_noticias: {
      ciudad: [
        { tag: 'Ciudad', date: '4 jul 2026', title: 'Nueva jornada de recuperación de espacios públicos en el casco central', desc: 'Cuadrillas municipales intervienen plazas y aceras para devolver el espacio a las familias guareñas.', img: P.brigada },
        { tag: 'Ciudad', date: '2 jul 2026', title: 'Rehabilitación de vías en la parroquia Guarenas', desc: 'Asfaltado y bacheo en las principales arterias del municipio.', img: P.vial },
        { tag: 'Ciudad', date: '28 jun 2026', title: 'Operativo de salud llega a las comunidades del sur', desc: '', img: P.salud },
        { tag: 'Ciudad', date: '25 jun 2026', title: 'Ampliación del alumbrado público en avenidas principales', desc: 'Nuevas luminarias LED para mayor seguridad nocturna.', img: P.alumbrado },
        { tag: 'Ciudad', date: '20 jun 2026', title: 'Jornada de arborización en espacios recuperados', desc: '', img: P.plaza },
        { tag: 'Ciudad', date: '15 jun 2026', title: 'Mejoras en la red de distribución de agua potable', desc: 'Sustitución de tuberías para un servicio más estable.', img: P.agua },
        { tag: 'Ciudad', date: '10 jun 2026', title: 'Nuevas rutas de transporte urbano para las comunidades', desc: '', img: P.transporte },
        { tag: 'Ciudad', date: '6 jun 2026', title: 'Repavimentación de calles en el este del municipio', desc: '', img: P.vial },
        { tag: 'Ciudad', date: '2 jun 2026', title: 'Instalación de semáforos inteligentes en el centro', desc: '', img: P.alumbrado },
        { tag: 'Ciudad', date: '28 may 2026', title: 'Vista aérea del avance de las obras urbanas', desc: '', img: P.aerea }
      ],
      pais: [
        { tag: 'País', date: '5 jul 2026', title: 'Municipios del país coordinan agenda de desarrollo urbano', desc: 'Autoridades locales acuerdan lineamientos comunes para modernizar los servicios ciudadanos.', img: P.aerea },
        { tag: 'País', date: '1 jul 2026', title: 'Nuevos convenios de cooperación entre alcaldías', desc: 'Acuerdos para compartir buenas prácticas de gestión.', img: P.plaza },
        { tag: 'País', date: '27 jun 2026', title: 'Programa nacional de infraestructura beneficia a Miranda', desc: '', img: P.vial },
        { tag: 'País', date: '22 jun 2026', title: 'Encuentro de gobiernos locales sobre transformación digital', desc: 'Servicios en línea más simples para el ciudadano.', img: P.transporte },
        { tag: 'País', date: '17 jun 2026', title: 'Avances del plan nacional de vialidad', desc: '', img: P.vial },
        { tag: 'País', date: '12 jun 2026', title: 'Foro de ciudades sostenibles reúne a municipios del país', desc: 'Agua, energía y espacios verdes en la agenda.', img: P.agua },
        { tag: 'País', date: '8 jun 2026', title: 'Cooperación internacional para proyectos urbanos', desc: '', img: P.salud },
        { tag: 'País', date: '3 jun 2026', title: 'Red de alumbrado público se moderniza en varias regiones', desc: '', img: P.alumbrado },
        { tag: 'País', date: '30 may 2026', title: 'Municipios impulsan planes conjuntos de movilidad', desc: '', img: P.transporte }
      ],
      alcalde: [
        { tag: 'Alcalde', date: '6 jul 2026', title: 'Comunicado del alcalde: balance de gestión del primer semestre', desc: 'El alcalde presenta a la ciudadanía los avances alcanzados y los compromisos para los próximos meses.', img: P.aerea },
        { tag: 'Alcalde', date: '30 jun 2026', title: 'Alcalde inaugura obras de vialidad en el municipio', desc: 'Nuevas vías para conectar mejor a las comunidades.', img: P.vial },
        { tag: 'Alcalde', date: '24 jun 2026', title: 'Encuentro directo del alcalde con líderes comunitarios', desc: '', img: P.plaza },
        { tag: 'Alcalde', date: '18 jun 2026', title: 'Mensaje del alcalde por el aniversario de la ciudad', desc: 'Un llamado al orgullo y al trabajo conjunto.', img: P.salud },
        { tag: 'Alcalde', date: '12 jun 2026', title: 'Supervisión de los trabajos de alumbrado público', desc: '', img: P.alumbrado },
        { tag: 'Alcalde', date: '6 jun 2026', title: 'Reunión con el sector comercial del municipio', desc: 'Impulso a los emprendedores y comercios locales.', img: P.transporte },
        { tag: 'Alcalde', date: '1 jun 2026', title: 'Anuncio del plan de recuperación de espacios deportivos', desc: '', img: P.plaza },
        { tag: 'Alcalde', date: '27 may 2026', title: 'El alcalde recorre las obras de agua potable', desc: '', img: P.agua }
      ]
    },

    // ---- Agenda cultural del mes (fechas culturales) ----
    g_agenda: {
      events: [
        {
          saint: 'San Pedro',
          title: 'Parranda de San Pedro',
          dateLabel: '28 y 29 de junio',
          photo: 'assets/proximo-evento.png',
          desc: 'Patrimonio Cultural Inmaterial de la Humanidad (UNESCO). Guarenas se viste de fiesta con levitas, sombreros de copa, banderas y la María Ignacia cargando su muñeca al ritmo del cuatro y las maracas.',
          program: [
            { time: '5:00 P.M. · Dom 28', title: 'Serenata a San Pedro', place: 'Iglesia Sagrado Corazón de Jesús (Urb. 27 de Febrero)', desc: 'Noche de cantos, fe y tambor para esperar el día del Santo.' },
            { time: '9:00 A.M. · Lun 29', title: 'Misa Solemne', place: 'Catedral Ntra. Sra. de Copacabana', desc: 'Celebración eucarística en honor a San Pedro Apóstol.' },
            { time: '10:00 A.M. · Lun 29', title: 'Salida de procesión y pago de promesa', place: 'Puertas de la Catedral de Copacabana', desc: 'Salida de la procesión y pago de promesas a las puertas de la iglesia.' },
            { time: '11:30 A.M. · Lun 29', title: 'Recorrido de la parranda', place: 'Sectores de Guarenas', desc: 'La parranda sale a recorrer los distintos sectores del municipio.' },
            { time: 'Cierre · Lun 29', title: 'Cierre tradicional', place: 'Comunidad', desc: 'La jornada termina con el sancocho comunitario entre parranderos y vecinos.' }
          ]
        }
      ]
    },

    // ---- Rutas por día (28 y 29). Coordenadas del día 28 aproximadas: edítalas en el portal ----
    g_rutas: {
      '28': [
        { place: 'Concentración de parranderos · Urb. 27 de Febrero', note: '', lat: 10.4705, lng: -66.6165 },
        { place: 'Serenata · Iglesia Sagrado Corazón de Jesús', note: 'Serenata a San Pedro', lat: 10.4712, lng: -66.6158 },
        { place: 'Recorrido por la Urb. 27 de Febrero', note: '', lat: 10.4725, lng: -66.6150 },
        { place: 'Encuentro con la Parranda de San Juan', note: 'Primer encuentro', lat: 10.4738, lng: -66.6140 }
      ],
      '29': [
        { place: 'Bulevar 27 de Febrero y Calle Páez', note: '', lat: 10.4718, lng: -66.6138 },
        { place: 'Calle Comercio hasta el Bulevar La Paz', note: '1er encuentro con la Parranda de San Juan', lat: 10.4732, lng: -66.6110 },
        { place: 'Sector La Pelota', note: '2do encuentro de San Juan y San Pedro', lat: 10.4701, lng: -66.6082 },
        { place: 'Altos de la Hoya y Av. Principal de Ruiz Pineda', note: '', lat: 10.4759, lng: -66.6052 },
        { place: 'Sectores 1 y 2 de la Urb. Trapichito', note: '', lat: 10.4796, lng: -66.6028 },
        { place: 'Plaza Miranda', note: '', lat: 10.4744, lng: -66.6126 },
        { place: 'Bloque 24 · Cierre tradicional', note: 'Sancocho comunitario', lat: 10.4688, lng: -66.6158 }
      ]
    }
  };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  var GStore = {
    DEFAULTS: DEFAULTS,
    ADMIN_KEY: 'g_admin_pass',
    SESSION_KEY: 'g_admin_session',
    DEFAULT_PASS: 'guarenas2026',

    get: function (key) {
      try {
        var raw = localStorage.getItem(key);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      if (key === 'g_aseo' && window.RUTAS_ASEO) return clone(window.RUTAS_ASEO);
      return DEFAULTS[key] !== undefined ? clone(DEFAULTS[key]) : null;
    },
    set: function (key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
      try { window.dispatchEvent(new CustomEvent('gstore', { detail: { key: key } })); } catch (e) {}
    },
    reset: function (key) {
      try { localStorage.removeItem(key); } catch (e) {}
      try { window.dispatchEvent(new CustomEvent('gstore', { detail: { key: key } })); } catch (e) {}
    },
    on: function (fn) { window.addEventListener('gstore', fn); return fn; },
    off: function (fn) { window.removeEventListener('gstore', fn); },

    // ---- auth (cliente) ----
    _pass: function () {
      try { return localStorage.getItem(this.ADMIN_KEY) || this.DEFAULT_PASS; } catch (e) { return this.DEFAULT_PASS; }
    },
    login: function (p) {
      if (p === this._pass()) { try { sessionStorage.setItem(this.SESSION_KEY, '1'); } catch (e) {} return true; }
      return false;
    },
    logout: function () { try { sessionStorage.removeItem(this.SESSION_KEY); } catch (e) {} },
    isAuthed: function () { try { return sessionStorage.getItem(this.SESSION_KEY) === '1'; } catch (e) { return false; } },
    setPass: function (p) { try { localStorage.setItem(this.ADMIN_KEY, p); } catch (e) {} },

    // ---- imagen: reduce y devuelve dataURL para caber en localStorage ----
    imageToDataURL: function (file, maxW) {
      maxW = maxW || 1280;
      return new Promise(function (resolve, reject) {
        if (!file) { reject('no file'); return; }
        var fr = new FileReader();
        fr.onload = function () {
          var img = new Image();
          img.onload = function () {
            var w = img.width, h = img.height;
            if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
            var c = document.createElement('canvas');
            c.width = w; c.height = h;
            c.getContext('2d').drawImage(img, 0, 0, w, h);
            try { resolve(c.toDataURL('image/jpeg', 0.82)); }
            catch (e) { resolve(fr.result); }
          };
          img.onerror = function () { resolve(fr.result); };
          img.src = fr.result;
        };
        fr.onerror = function () { reject('read error'); };
        fr.readAsDataURL(file);
      });
    }
  };

  window.GStore = GStore;
})();
