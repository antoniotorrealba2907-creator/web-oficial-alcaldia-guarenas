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
    deporte: 'assets/noticia-deporte-1.jpg', deporte2: 'assets/noticia-deporte-2.jpg',
    balance: 'assets/noticia-balance.jpg',
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
      banner: 'assets/banner-noticias.png',
      photo: 'assets/alcalde-perfil.png'
    },

    // ---- Noticias ----
    g_noticias: {
      ciudad: [
        { tag: 'Ciudad', date: '4 jul 2026', title: 'Nueva jornada de recuperación de espacios públicos en el casco central', desc: 'Cuadrillas municipales intervienen plazas y aceras para devolver el espacio a las familias guareñas.', img: P.brigada },
        { tag: 'Ciudad', date: '2 jul 2026', title: 'Rehabilitación de vías en la parroquia Guarenas', desc: 'Asfaltado y bacheo en las principales arterias del municipio.', img: 'assets/noticia-real-1.png' },
        { tag: 'Ciudad', date: '28 jun 2026', title: 'Operativo de salud llega a las comunidades del sur', desc: '', img: P.salud },
        { tag: 'Ciudad', date: '25 jun 2026', title: 'Ampliación del alumbrado público en avenidas principales', desc: 'Nuevas luminarias LED para mayor seguridad nocturna.', img: 'assets/noticia-real-2.png' },
        { tag: 'Ciudad', date: '20 jun 2026', title: 'Jornada de arborización en espacios recuperados', desc: '', img: 'assets/noticia-real-3.png' },
        { tag: 'Ciudad', date: '15 jun 2026', title: 'Mejoras en la red de distribución de agua potable', desc: 'Sustitución de tuberías para un servicio más estable.', img: 'assets/noticia-real-4.png' },
        { tag: 'Ciudad', date: '10 jun 2026', title: 'Inauguración de nuevas canchas deportivas para la juventud', desc: 'El alcalde entregó espacios deportivos recuperados para el deporte y la recreación comunitaria.', img: P.deporte },
        { tag: 'Comunidad', date: '8 jun 2026', title: 'Entrega de bolsos y útiles escolares a estudiantes del municipio', desc: 'Jornada educativa para acompañar a las familias guareñas en el regreso a clases.', img: 'assets/news-educacion.png' },
        { tag: 'Ciudad', date: '6 jun 2026', title: 'Repavimentación de calles en el este del municipio', desc: '', img: 'assets/noticia-real-5.png' }
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
        { tag: 'Alcalde', date: '6 jul 2026', title: 'Comunicado del alcalde: balance de gestión del primer semestre', desc: 'El alcalde presenta a la ciudadanía los avances alcanzados y los compromisos para los próximos meses.', img: P.balance },
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
      ],
      festivos: [
        { dia:1,  mes:1,  nombre:'Año Nuevo', icon:'fuegos', color:'#4220e5' },
        { dia:12, mes:2,  nombre:'Carnaval', icon:'mascara', color:'#ff9d00' },
        { dia:13, mes:2,  nombre:'Carnaval', icon:'mascara', color:'#ff9d00' },
        { dia:19, mes:3,  nombre:'San José', icon:'iglesia', color:'#3a7d44' },
        { dia:3,  mes:5,  nombre:'Velorios de Cruz de Mayo', icon:'iglesia', color:'#3a7d44' },
        { dia:24, mes:6,  nombre:'Fiestas de San Juan Bautista', icon:'tambor', color:'#ea3755' },
        { dia:28, mes:6,  nombre:'Parranda de San Pedro (víspera)', icon:'tambor', color:'#ea3755' },
        { dia:29, mes:6,  nombre:'Parranda de San Pedro', icon:'tambor', color:'#ea3755' },
        { dia:5,  mes:7,  nombre:'Día de la Independencia', icon:'bandera', color:'#4220e5' },
        { dia:24, mes:7,  nombre:'Natalicio del Libertador Simón Bolívar', icon:'bandera', color:'#4220e5' },
        { dia:14, mes:8,  nombre:'Fundación de Guarenas (1621)', icon:'corona', color:'#ff9d00' },
        { dia:16, mes:7,  nombre:'Virgen del Carmen', icon:'iglesia', color:'#3a7d44' },
        { dia:12, mes:10, nombre:'Día de la Resistencia Indígena', icon:'estrella', color:'#4220e5' },
        { dia:1,  mes:11, nombre:'Día de Todos los Santos', icon:'iglesia', color:'#3a7d44' },
        { dia:8,  mes:12, nombre:'Día de la Inmaculada Concepción', icon:'iglesia', color:'#3a7d44' },
        { dia:24, mes:12, nombre:'Nochebuena', icon:'estrella', color:'#ea3755' },
        { dia:25, mes:12, nombre:'Navidad', icon:'estrella', color:'#ea3755' },
        { dia:31, mes:12, nombre:'Fin de Año', icon:'fuegos', color:'#4220e5' }
      ]
    },

    // ---- Contador de días de gestión (fecha de inicio, editable) ----
    g_gestion: {
      startISO: '2025-01-01',
      startLabel: '1 de enero de 2025'
    },

    // ---- Perfil del administrador ----
    g_profile: {
      first: 'Antonio',
      last: 'Galíndez',
      role: 'Alcalde de Guarenas',
      dept: 'Despacho de la Alcaldía',
      photo: 'assets/alcalde-perfil.png',
      zoom: 1, posX: 0, posY: 0
    },

    // ---- Gestión en cifras (Home) — editable por el administrador ----
    g_cifras: {
      items: [
        { icon:'road', pre:'', to:2100, suf:'', label:'Toneladas de asfalto colocadas' },
        { icon:'bulb', pre:'', to:710, suf:'', label:'Luminarias instaladas en vías' },
        { icon:'drop', pre:'+', to:120, suf:'', label:'Destapes de aguas servidas' },
        { icon:'moto', pre:'', to:50, suf:'', label:'Motos nuevas para la seguridad' },
        { icon:'court', pre:'', to:9, suf:'', label:'Canchas deportivas reinauguradas' }
      ]
    },

    // ---- Línea de tiempo de la gestión (editable por el administrador) ----
    g_hitos: {
      items: [
        { fecha:'Ene 2025', icon:'gab', title:'Instalación del gabinete municipal', desc:'Arranque de la gestión con el diagnóstico de servicios en las cinco parroquias del Municipio Ambrosio Plaza.', img:'assets/tl-inicio.png' },
        { fecha:'Abr 2025', icon:'luz', title:'Guarenas más iluminada', desc:'710 luminarias LED instaladas en avenidas y comunidades: Falcón, Anzoátegui, Comercio, 19 de Abril, Andrés Bello y más.', img:'assets/tl-alumbrado.png' },
        { fecha:'Jul 2025', icon:'vial', title:'Plan de asfaltado', desc:'2.100 toneladas de asfalto colocadas en Las Clavellinas, Ruiz Pineda, Casco Central, Nueva Casarapa y Quebrada Seca.', img:'assets/tl-vial.png' },
        { fecha:'Oct 2025', icon:'edu', title:'Escuelas y espacios educativos', desc:'Recuperación de planteles, dotación escolar y reactivación de escuelas deportivas municipales.', img:'assets/tl-escuelas.png' },
        { fecha:'Ene 2026', icon:'seg', title:'Seguridad ciudadana reforzada', desc:'Incorporación de 10 patrullas, 50 motos nuevas y dotación de 200 uniformes completos para la policía municipal.', img:'assets/news-brigada.png' },
        { fecha:'Jun 2026', icon:'balance', title:'Balance del primer semestre', desc:'Rendición de cuentas pública con los principales resultados de la gestión y los compromisos para el segundo semestre.', img:'assets/tl-balance.png' }
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
    ADMIN_USER_KEY: 'g_admin_user',
    DEFAULT_USER: 'admin',
    SESSION_KEY: 'g_admin_session',
    DEFAULT_PASS: 'guarenas2026',

    get: function (key) {
      try {
        var raw = localStorage.getItem(key);
        if (raw) {
          var val = JSON.parse(raw);
          if (key === 'g_noticias' && val && Array.isArray(val.ciudad)) {
            var mig = false;
            val.ciudad = val.ciudad.map(function (n) {
              if (n && n.title === 'Nuevas rutas de transporte urbano para las comunidades') {
                mig = true;
                return { tag: 'Ciudad', date: n.date || '10 jun 2026', title: 'Inauguración de nuevas canchas deportivas para la juventud', desc: 'El alcalde entregó espacios deportivos recuperados para el deporte y la recreación comunitaria.', img: 'assets/noticia-deporte-1.jpg' };
              }
              return n;
            });
            if (mig) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
          }
          return val;
        }
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
    adminUser: function () {
      try { return localStorage.getItem(this.ADMIN_USER_KEY) || this.DEFAULT_USER; } catch (e) { return this.DEFAULT_USER; }
    },
    setAdminUser: function (u) { try { if (u && u.trim()) localStorage.setItem(this.ADMIN_USER_KEY, u.trim()); } catch (e) {} },
    _setSession: function (obj) { try { sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(obj)); } catch (e) {} },
    session: function () {
      try {
        var raw = sessionStorage.getItem(this.SESSION_KEY);
        if (!raw) return null;
        if (raw === '1') return { auth: true, principal: true, role: 'Administrador', name: '' };
        return JSON.parse(raw);
      } catch (e) { return null; }
    },
    login: function (p) {
      if (p === this._pass()) {
        var nm = '';
        try { var pf = this.get('g_profile') || {}; nm = ((pf.first || '') + ' ' + (pf.last || '')).trim(); } catch (e) {}
        this._setSession({ auth: true, principal: true, role: 'Administrador', name: nm });
        return true;
      }
      return false;
    },
    loginUser: function (email, pass) {
      var e2 = (email || '').trim().toLowerCase();
      // administrador principal por usuario + contraseña
      if (e2 && e2 === (this.adminUser() || '').trim().toLowerCase() && pass === this._pass()) {
        var nm = '';
        try { var pf = this.get('g_profile') || {}; nm = ((pf.first || '') + ' ' + (pf.last || '')).trim(); } catch (e) {}
        this._setSession({ auth: true, principal: true, role: 'Administrador', name: nm });
        return true;
      }
      var users = [];
      try { users = this.get('g_users') || []; } catch (e) {}
      if (!Array.isArray(users)) return false;
      for (var i = 0; i < users.length; i++) {
        var u = users[i];
        var ue = (u.email || '').trim().toLowerCase();
        var un = (u.username || '').trim().toLowerCase();
        if (((ue && ue === e2) || (un && un === e2)) && (u.pass || '') === pass && (u.status || 'Activo') === 'Activo') {
          this._setSession({ auth: true, principal: false, role: u.role || 'Editor', name: u.name || '' });
          return true;
        }
      }
      return false;
    },
    logout: function () { try { sessionStorage.removeItem(this.SESSION_KEY); } catch (e) {} },
    isAuthed: function () { var s = this.session(); return !!(s && s.auth); },
    isPrincipal: function () { var s = this.session(); return !!(s && s.principal); },
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
