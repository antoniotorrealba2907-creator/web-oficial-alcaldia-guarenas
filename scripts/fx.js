(function () {
  var root = document.getElementById('guaRoot') || document.body;
  // Modo oscuro eliminado: forzar tema claro siempre.
  try { root.classList.remove('theme-dark'); localStorage.removeItem('gua-theme'); } catch (e) {}
  try { var _tt = document.querySelector('[data-theme-toggle]'); if (_tt) _tt.remove(); } catch (e) {}

  // Pantalla de carga con el isotipo de la Alcaldía (en lugar del icono genérico).
  (function () {
    try {
      if (document.getElementById('__gua-loader')) return;
      var ov = document.createElement('div');
      ov.id = '__gua-loader';
      ov.setAttribute('style', 'position:fixed;inset:0;z-index:99999;background:#ffffff;display:flex;align-items:center;justify-content:center;transition:opacity .35s ease;');
      ov.innerHTML = '<img src="assets/_compartidas/marca/isotipo-blue.svg" alt="Alcaldía de Guarenas" style="width:96px;height:96px;animation:guaPulse 1.15s ease-in-out infinite;">';
      var st = document.createElement('style');
      st.textContent = '@keyframes guaPulse{0%,100%{transform:scale(.9);opacity:.55}50%{transform:scale(1.06);opacity:1}}';
      document.head.appendChild(st);
      var mount = function () { (document.body || document.documentElement).appendChild(ov); };
      if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
      var hide = function () {
        var el = document.getElementById('__gua-loader');
        if (!el) return;
        el.style.opacity = '0';
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 400);
      };
      if (document.readyState === 'complete') setTimeout(hide, 250);
      else window.addEventListener('load', function () { setTimeout(hide, 250); });
      setTimeout(hide, 6000);
    } catch (e) {}
  })();

  // Botón de admin en el header: si hay sesión activa, mostrar avatar + punto verde.
  // OJO: solo CSS + atributos — nunca mutar hijos (el enlace lo controla React).
  function _adminBtn() {
    try {
      if (!window.GStore || !window.GStore.isAuthed()) return;
      var links = document.querySelectorAll('a[aria-label="Portal de administración"]');
      if (!links.length) return;
      var pf = {}; try { pf = window.GStore.get('g_profile') || {}; } catch (e) {}
      var st = document.getElementById('__adm-avatar-css');
      if (!st) { st = document.createElement('style'); st.id = '__adm-avatar-css'; document.head.appendChild(st); }
      var css = '';
      if (pf.photo) {
        css = 'a[data-adm="1"]{position:relative!important;overflow:visible!important;background-image:url("' + pf.photo + '")!important;background-size:cover!important;background-position:center!important;border-color:#c9bdff!important;}'
            + 'a[data-adm="1"]>svg{display:none!important;}';
      } else {
        var nm = ((pf.first || '') + ' ' + (pf.last || '')).trim().split(/\s+/).filter(Boolean);
        var ini = ((nm[0] ? nm[0][0] : '') + (nm[1] ? nm[1][0] : '') || 'A').toUpperCase();
        css = 'a[data-adm="1"]{position:relative!important;overflow:visible!important;background:linear-gradient(135deg,#4a34ff,#6a5cff)!important;border-color:#4a34ff!important;}'
            + 'a[data-adm="1"]>svg{display:none!important;}'
            + 'a[data-adm="1"]::before{content:"' + ini + '";font-family:Poppins,sans-serif;font-weight:700;font-size:13px;color:#fff;}';
      }
      css += 'a[data-adm="1"]::after{content:"";position:absolute;bottom:-1px;right:-1px;width:12px;height:12px;border-radius:50%;background:#3a7d44;border:2px solid #fff;box-shadow:0 0 0 1px rgba(58,125,68,.4);}';
      if (st.textContent !== css) st.textContent = css;
      links.forEach(function (a) {
        if (a.querySelector('img')) return; // Home ya lo pinta reactivo
        if (a.getAttribute('data-adm') !== '1') a.setAttribute('data-adm', '1');
        a.setAttribute('title', 'Sesión de administrador activa');
      });
    } catch (e) {}
  }
  setTimeout(_adminBtn, 400);
  setTimeout(_adminBtn, 1200);
  try { window.addEventListener('gstore', _adminBtn); } catch (e) {}

  document.addEventListener('pointermove', function (e) {
    var c = e.target && e.target.closest ? e.target.closest('.glow') : null;
    if (!c) return;
    var r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });

  // hover-reveal wordmark: move the radial mask to follow the cursor (viewBox coords)
  document.addEventListener('pointermove', function (e) {
    var svg = e.target && e.target.closest ? e.target.closest('.fx-texthover') : null;
    if (!svg) return;
    var rev = svg.querySelector('.fx-reveal');
    if (!rev) return;
    var r = svg.getBoundingClientRect();
    var vb = svg.viewBox && svg.viewBox.baseVal;
    var vw = vb && vb.width ? vb.width : 1000, vh = vb && vb.height ? vb.height : 190;
    rev.setAttribute('cx', (((e.clientX - r.left) / r.width) * vw).toFixed(1));
    rev.setAttribute('cy', (((e.clientY - r.top) / r.height) * vh).toFixed(1));
  });
  document.addEventListener('pointerout', function (e) {
    var svg = e.target && e.target.closest ? e.target.closest('.fx-texthover') : null;
    if (!svg || (e.relatedTarget && svg.contains(e.relatedTarget))) return;
    var rev = svg.querySelector('.fx-reveal');
    if (rev) rev.setAttribute('cx', '-1000');
  });

  function tag() {
    document.querySelectorAll('a[style],div[style]').forEach(function (el) {
      if (el.classList.contains('glow')) return;
      if (el.closest('.svc-menu') || el.closest('.svc-drop')) return;
      var s = el.getAttribute('style') || '';
      var radius = /border-radius:\s*1[0-9]px/.test(s) || /border-radius:\s*2[0-9]px/.test(s);
      var card = /box-shadow:\s*0 |border:\s*1px solid (#e|rgb\(2)/.test(s);
      if (radius && card && el.offsetWidth > 120 && el.offsetHeight > 88) {
        if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
        el.classList.add('glow');
      }
    });
    document.querySelectorAll('button').forEach(function (b) {
      if (b.closest('[data-turpanel]')) return;
      if (b.hasAttribute('data-nofx')) return;
      if (b.closest('.svc-menu') || b.closest('.svc-drop')) return;
      if (!b.classList.contains('gborder')) {
        if (getComputedStyle(b).position === 'static') b.style.position = 'relative';
        b.classList.add('gborder');
      }
    });
        document.querySelectorAll('span[style]').forEach(function (el) {
      if (el.classList.contains('gborder')) return;
      if (el.closest('.svc-menu') || el.closest('.svc-drop')) return;
      var s = el.getAttribute('style') || '';
      if ((/border-radius:\s*1[0-4]px/.test(s) || /border-radius:\s*50%/.test(s)) && el.querySelector('svg') && el.offsetWidth >= 34 && el.offsetWidth <= 66) {
        if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
        el.classList.add('gborder');
      }
    });
  }

  function initTram() {
    document.querySelectorAll('[data-tramscroll]').forEach(function (sc) {
      if (sc._tramInit) return;
      var track = sc.querySelector('.tram-track');
      if (!track || track.offsetWidth < 10) return;
      sc._tramInit = true;
      var down = false, sx = 0, sl = 0, moved = false, paused = false;
      function wrap() { var h = track.offsetWidth / 2; if (h > 0) { if (sc.scrollLeft >= h) sc.scrollLeft -= h; else if (sc.scrollLeft <= 0) sc.scrollLeft += h; } }
      sc.addEventListener('pointerdown', function (e) { down = true; moved = false; sx = e.clientX; sl = sc.scrollLeft; sc.style.cursor = 'grabbing'; try { sc.setPointerCapture(e.pointerId); } catch (_) {} });
      sc.addEventListener('pointermove', function (e) { if (!down) return; var d = e.clientX - sx; if (Math.abs(d) > 4) moved = true; sc.scrollLeft = sl - d; wrap(); });
      function up() { down = false; sc.style.cursor = 'grab'; }
      sc.addEventListener('pointerup', up); sc.addEventListener('pointercancel', up);
      sc.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
      sc.addEventListener('scroll', wrap);
      sc.addEventListener('pointerenter', function () { paused = true; });
      sc.addEventListener('pointerleave', function () { paused = false; });
      sc.scrollLeft = 1;
      function step() { if (!paused && !down) { sc.scrollLeft += 0.4; wrap(); } sc._tramRaf = requestAnimationFrame(step); }
      step();
    });
  }

  function initMobileNav() {
    document.querySelectorAll('header').forEach(function (header) {
      var nav = header.querySelector('nav');
      if (!nav || header._mnavInit) return;
      var bar = nav.parentNode;                 // fila: logo | nav | acciones
      if (!bar) return;
      header._mnavInit = true;
      var btn = document.createElement('button');
      btn.setAttribute('data-mnav-btn', '1');
      btn.setAttribute('aria-label', 'Abrir menú');
      btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 6h18"></path><path d="M3 12h18"></path><path d="M3 18h18"></path></svg>';
      // Insertar la hamburguesa como último elemento de la barra (a la derecha)
      bar.appendChild(btn);
      function close() { header.classList.remove('mnav-open'); btn.setAttribute('aria-label', 'Abrir menú'); }
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = header.classList.toggle('mnav-open');
        btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      });
      // Cerrar al tocar un enlace o fuera del header
      nav.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
      document.addEventListener('click', function (e) { if (!header.contains(e.target)) close(); });
    });
  }

  function initBottomNav() {
    if (document.querySelector('[data-btabbar]')) return;
    var file = '';
    try { file = decodeURIComponent((location.pathname.split('/').pop() || '')); } catch (e) {}
    var t = (document.title || '').toLowerCase();
    function active(hrefs, key) {
      if (file) { for (var i = 0; i < hrefs.length; i++) if (file === hrefs[i]) return true; }
      return key && t.indexOf(key) !== -1;
    }
    var ic = {
      home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
      file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
      pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
      truck: '<path d="M10 17h4V5H2v12h3"/><path d="M14 8h4l4 4v5h-3"/><circle cx="7.5" cy="17.5" r="2"/><circle cx="17.5" cy="17.5" r="2"/>',
      more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
      chart: '<path d="M3 3v18h18"/><rect x="7" y="10" width="3" height="7"/><rect x="13" y="6" width="3" height="11"/>',
      news: '<path d="M4 4h13v16H5a2 2 0 0 1-2-2V6"/><path d="M17 8h3v10a2 2 0 0 1-2 2"/><path d="M7 8h6M7 12h6M7 16h4"/>',
      info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="8" r="0.6" fill="currentColor"/>',
      lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'
    };
    function svg(p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>'; }
    var tabs = [
      { href: 'Home.dc.html', label: 'Inicio', icon: ic.home, keys: ['inicio'] },
      { href: 'Tramites.dc.html', label: 'Trámites', icon: ic.file, keys: ['trámite', 'tramite'] },
      { href: 'Identidad.dc.html', label: 'Turismo', icon: ic.pin, keys: ['identidad', 'turismo', 'cultura'] },
      { href: 'Aseo Urbano.dc.html', label: 'Aseo', icon: ic.truck, keys: ['aseo'] }
    ];
    var moreItems = [
      { href: 'Gestion.dc.html', label: 'Gestión', icon: ic.chart },
      { href: 'Noticias.dc.html', label: 'Noticias', icon: ic.news },
      { href: 'Info Municipal.dc.html', label: 'Info Municipal', icon: ic.info },
      { href: 'Portal Admin.dc.html', label: 'Portal Admin', icon: ic.lock }
    ];
    var moreActive = active(moreItems.map(function (m) { return m.href; }), null) ||
      t.indexOf('gestión') !== -1 || t.indexOf('gestion') !== -1 || t.indexOf('noticia') !== -1 ||
      t.indexOf('municipal') !== -1 || t.indexOf('portal') !== -1;

    var bar = document.createElement('nav');
    bar.setAttribute('data-btabbar', '1');
    bar.setAttribute('aria-label', 'Navegación principal');
    var html = '';
    tabs.forEach(function (tb) {
      var on = active([tb.href], null) || tb.keys.some(function (k) { return t.indexOf(k) !== -1; });
      html += '<a href="' + tb.href + '" data-bt' + (on ? ' data-bt-on' : '') + '><span data-bt-ico>' + svg(tb.icon) + '</span><span data-bt-lbl>' + tb.label + '</span></a>';
    });
    html += '<button type="button" data-bt data-bt-more' + (moreActive ? ' data-bt-on' : '') + '><span data-bt-ico>' + svg(ic.more) + '</span><span data-bt-lbl>Más</span></button>';
    bar.innerHTML = html;
    document.body.appendChild(bar);

    var sheet = document.createElement('div');
    sheet.setAttribute('data-msheet', '1');
    var si = '<div data-msheet-bd></div><div data-msheet-panel role="dialog" aria-label="Más secciones"><div data-msheet-grab></div><div data-msheet-title>Más secciones</div><div data-msheet-grid>';
    moreItems.forEach(function (m) {
      si += '<a href="' + m.href + '"><span data-ms-ico>' + svg(m.icon) + '</span><span>' + m.label + '</span></a>';
    });
    si += '</div></div>';
    sheet.innerHTML = si;
    document.body.appendChild(sheet);

    function openSheet() { sheet.classList.add('open'); }
    function closeSheet() { sheet.classList.remove('open'); }
    bar.querySelector('[data-bt-more]').addEventListener('click', function (e) { e.stopPropagation(); sheet.classList.toggle('open'); });
    sheet.querySelector('[data-msheet-bd]').addEventListener('click', closeSheet);
    sheet.querySelector('[data-msheet-grab]').addEventListener('click', closeSheet);
  }

  function markActiveNav() {
    var file = '';
    try { file = decodeURIComponent((location.pathname.split('/').pop() || '')); } catch (e) {}
    var title = (document.title || '').toLowerCase();
    document.querySelectorAll('header nav a[href]').forEach(function (a) {
      if (a.closest('.svc-menu')) return;
      var href = '';
      try { href = decodeURIComponent(a.getAttribute('href') || ''); } catch (e) { href = a.getAttribute('href') || ''; }
      var label = (a.textContent || '').trim().toLowerCase();
      var byFile = file && href === file;
      var byTitle = label && label.split(/\s+/).some(function (w) { return w.length > 4 && title.indexOf(w) !== -1; });
      if (byFile || byTitle) {
        a.style.background = /aseo/i.test(href) ? 'linear-gradient(135deg,#2f8a4e,#5bbf6a)' : 'linear-gradient(135deg,#4a34ff,#3ca2fa)';
        a.style.color = '#fff';
        a.setAttribute('data-navactive', '1');
      }
    });
  }

  function initDockNav() {
    if (document.querySelector('[data-dock]')) { dockUpdate(); return; }
    if (!document.body) return;
    var st = document.createElement('style');
    st.textContent = '[data-dock]{position:fixed;left:50%;bottom:24px;transform:translateX(-50%) translateY(170%);opacity:0;z-index:350;display:flex;align-items:center;gap:2px;padding:8px;border-radius:999px;background:rgba(255,255,255,.62);backdrop-filter:blur(24px) saturate(1.7);-webkit-backdrop-filter:blur(24px) saturate(1.7);border:1px solid rgba(255,255,255,.7);box-shadow:0 18px 44px -16px rgba(20,18,56,.34),inset 0 1px 0 rgba(255,255,255,.7);transition:transform .55s cubic-bezier(.22,1,.36,1),opacity .4s ease;font-family:Poppins,sans-serif;}'
      + '[data-dock].show{transform:translateX(-50%) translateY(0);opacity:1;}'
      + '[data-dock] a,[data-dock] button{all:unset;box-sizing:border-box;cursor:pointer;display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:999px;font-family:Poppins,sans-serif;font-weight:600;font-size:14px;color:#3a2fa0;white-space:nowrap;transition:color .2s ease,box-shadow .25s ease,background .25s ease;}'
      + '[data-dock] a:hover,[data-dock] button:hover{color:#4220e5;}'
      + '[data-dock] a[data-on]{color:#4220e5;background:rgba(255,255,255,.55);box-shadow:inset 2px 2px 6px rgba(20,18,56,.1),inset -2px -2px 6px rgba(255,255,255,.7);}'
      + '[data-dock] svg{width:16px;height:16px;flex:none;opacity:.75;}'
      + '[data-dock] a[data-on] svg{opacity:1;}'
      + '[data-dock] [data-dlbl]{display:inline;}'
      + '[data-dockpop]{position:fixed;z-index:351;bottom:86px;transform:translateY(8px);opacity:0;visibility:hidden;min-width:236px;background:rgba(255,255,255,.5);backdrop-filter:blur(22px) saturate(1.6);-webkit-backdrop-filter:blur(22px) saturate(1.6);border:1px solid rgba(255,255,255,.6);box-shadow:0 22px 50px -18px rgba(20,18,56,.36);border-radius:20px;padding:9px;transition:opacity .2s ease,transform .2s ease;font-family:Poppins,sans-serif;}'
      + '[data-dockpop].open{opacity:1;visibility:visible;transform:translateY(0);}'
      + '[data-dockpop] a{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;color:#3a3a44;text-decoration:none;font-weight:600;font-size:13.5px;transition:background .18s ease,transform .18s cubic-bezier(.22,1,.36,1);opacity:0;transform:translateY(6px);animation:dockPopIn .35s cubic-bezier(.22,1,.36,1) forwards;}'
      + '[data-dockpop].open a{animation:dockPopIn .38s cubic-bezier(.22,1,.36,1) forwards;}'
      + '[data-dockpop] a:nth-child(1){animation-delay:.02s;}[data-dockpop] a:nth-child(2){animation-delay:.07s;}[data-dockpop] a:nth-child(3){animation-delay:.12s;}[data-dockpop] a:nth-child(4){animation-delay:.17s;}'
      + '[data-dockpop] a:hover{background:#4220e5;color:#fff;transform:translateX(2px);}'
      + '[data-dockpop] a:hover .di{transform:scale(1.08) rotate(-4deg);background:rgba(255,255,255,.22) !important;color:#fff !important;box-shadow:none !important;}'
      + '[data-dockpop] .di{flex:none;display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:12px;transition:transform .25s cubic-bezier(.34,1.56,.64,1),background .2s ease,color .2s ease,box-shadow .25s ease;}'
      + '[data-dockpop] a:hover .di svg{opacity:1;}'
      + '@keyframes dockPopIn{to{opacity:1;transform:translateY(0);}}'
      + '@media (max-width:940px){[data-dock] a[data-dhref]:not([data-on]) [data-dlbl]{display:none;}}'
      + '@media (max-width:760px){[data-dock],[data-dockpop]{display:none !important;}}';
    document.head.appendChild(st);

    function svg(p){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'; }
    var IC = {
      home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
      chart:'<path d="M3 3v18h18"/><rect x="7" y="10" width="3" height="7"/><rect x="13" y="6" width="3" height="11"/>',
      file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
      news:'<path d="M4 4h13v16H5a2 2 0 0 1-2-2V6"/><path d="M17 8h3v10a2 2 0 0 1-2 2"/><path d="M7 8h6M7 12h6M7 16h4"/>',
      pin:'<path d="M12 2 4 8v13h5v-5a3 3 0 0 1 6 0v5h5V8z"/><path d="M12 2V0M10.5 4.5h3"/>',
      info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="8" r="0.6" fill="currentColor"/>',
      grid:'<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
      truck:'<rect x="1.6" y="6.5" width="12" height="9.5" rx="1.6"/><path d="M13.6 10h3.6l3.2 3.2V16h-6.8z"/><circle cx="6" cy="18" r="1.7"/><circle cx="16.5" cy="18" r="1.7"/>',
      shield:'<path d="M12 3l7 2.4v5.1c0 4.4-3 7.4-7 8.9-4-1.5-7-4.5-7-8.9V5.4z"/>',
      cross:'<circle cx="12" cy="12" r="8.6"/><path d="M12 8.4v7.2M8.4 12h7.2"/>',
      heart:'<path d="M12 20s-6.6-4.1-8.6-8.1A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8.6 4.9C18.6 15.9 12 20 12 20z"/>'
    };
    var items = [
      { href:'Home.dc.html', label:'Inicio', icon:IC.home, keys:['inicio'] },
      { href:'Gestion.dc.html', label:'Gestión', raw:'<svg viewBox="0 0 1242.2 1308.78" style="width:16px;height:16px;flex:none;"><path fill="currentColor" d="M935.68,207.4c1.93,3.96,27.2,47.77-58.06,95.53-18.58,10.41-16.35,38.31-5.26,55.92,10.94,17.38,31.8,25.08,51.92,19.18,86.99-25.54,221.16-85.95,282-159.55,20.04-24.24,30.67-55.41,27.53-86.7-12.41-123.57-211.82-147.23-367.47-123.63C408.45,71.9-150.49,558.02,37.33,1047.05c196.13,442.14,846.15,255.24,1084.96-54.52,279.69-310.9,32.74-696.46-356.18-517.91-127.21-161.43-408.57,15.44-401.24,233.45,4.74,89.92,25.4,160.39,59.25,151.1,41.85-24.97-25.12-119.22,96.79-225.23,62.59-54.43,162.04-1.67,129.98,96.75-8.43,23.92,24.65,41.67,39.83,20.93,19.73-22.94,65.92-76.66,121.59-115.36,64.58-44.9,128.09-41.2,165.91-23,127.51,74.72,4.22,249.17-106.8,334.74-138.87,107.02-253.77,144.78-394.73,125.64-218.91-59.94-271.44-253.42-164.62-489.3,89.79-216.19,313.05-327,405.25-359.6,0,0,191.81-71.78,218.35-17.33Z"/></svg>', keys:['gestión','gestion'] },
      { href:'Tramites.dc.html', label:'Trámites', icon:IC.file, keys:['trámite','tramite'] },
      { href:'Noticias.dc.html', label:'Noticias', icon:IC.news, keys:['noticia'] },
      { href:'Identidad.dc.html', label:'Identidad', icon:IC.pin, keys:['identidad','turismo','cultura'] },
      { href:'Info Municipal.dc.html', label:'Info', icon:IC.info, keys:['municipal'] }
    ];
    var svcItems = [
      { href:'Aseo Urbano.dc.html', label:'Aseo Urbano', icon:IC.truck, c:'#3a7d44' },
      { href:'Policia.dc.html', label:'Policía de Guarenas', icon:IC.shield, c:'#2a5bd0' },
      { href:'Ambulancia.dc.html', label:'Ambulancia', icon:IC.cross, c:'#ea3755' },
      { href:'CPNNA.dc.html', label:'CPNNA', icon:IC.heart, c:'#7b3fd0' }
    ];

    var dock = document.createElement('nav');
    dock.setAttribute('data-dock', '1');
    dock.setAttribute('aria-label', 'Navegación flotante');
    var html = '';
    items.forEach(function (it) {
      var ico = it.raw ? it.raw : (it.glyph ? '<span style="display:inline-flex;align-items:center;justify-content:center;width:17px;height:17px;font-family:Poppins,sans-serif;font-weight:800;font-size:15px;line-height:1;letter-spacing:-.02em;">' + it.glyph + '</span>' : svg(it.icon));
      html += '<a href="' + it.href + '" data-dhref="' + it.href + '">' + ico + '<span data-dlbl>' + it.label + '</span></a>';
    });
    html += '<button type="button" data-dsvc>' + svg(IC.grid) + '<span data-dlbl>Servicios</span></button>';
    dock.innerHTML = html;
    document.body.appendChild(dock);

    var pop = document.createElement('div');
    pop.setAttribute('data-dockpop', '1');
    var ph = '';
    svcItems.forEach(function (s) {
      ph += '<a href="' + s.href + '"><span class="di" style="background:' + s.c + '12;color:' + s.c + ';box-shadow:inset 0 0 0 1px ' + s.c + '22;">' + svg(s.icon).replace('stroke-width="2"', 'stroke-width="1.5"') + '</span>' + s.label + '</a>';
    });
    pop.innerHTML = ph;
    document.body.appendChild(pop);

    dock.querySelector('[data-dsvc]').addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !pop.classList.contains('open');
      if (open) {
        var db = dock.getBoundingClientRect();
        pop.style.left = 'auto';
        pop.style.right = Math.max(12, (window.innerWidth - db.right)) + 'px';
        pop.style.bottom = (window.innerHeight - db.top + 12) + 'px';
      }
      pop.classList.toggle('open');
    });
    document.addEventListener('click', function (e) { if (!pop.contains(e.target) && !e.target.closest('[data-dsvc]')) pop.classList.remove('open'); });
    window.addEventListener('scroll', dockUpdate, { passive: true });
    dockUpdate();
  }
  function dockUpdate() {
    var dock = document.querySelector('[data-dock]');
    if (!dock) return;
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    var atFooter = false;
    var ft = document.querySelector('footer');
    if (ft) { var fr = ft.getBoundingClientRect(); if (fr.top < window.innerHeight - 40) atFooter = true; }
    if (y > 460 && !atFooter) dock.classList.add('show'); else { dock.classList.remove('show'); var p = document.querySelector('[data-dockpop]'); if (p) p.classList.remove('open'); }
    if (dock._marked) return;
    var file = '';
    try { file = decodeURIComponent((location.pathname.split('/').pop() || '')); } catch (e) {}
    var t = (document.title || '').toLowerCase();
    dock.querySelectorAll('a[data-dhref]').forEach(function (a) {
      var href = a.getAttribute('data-dhref');
      var on = (file && file === href);
      if (on) a.setAttribute('data-on', '1');
    });
    dock._marked = true;
  }

  function initAdminLink() {
    var authed = false;
    try { authed = !!(window.GStore && window.GStore.isAuthed && window.GStore.isAuthed()); } catch (e) {}
    if (!authed) return;
    document.querySelectorAll('a[href="Portal Admin.dc.html"]').forEach(function (a) {
      if (a._adminProfile) return;
      a._adminProfile = true;
      a.setAttribute('title', 'Mi perfil de administrador');
      a.setAttribute('aria-label', 'Perfil de administrador');
      a.innerHTML = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.4"></circle><path d="M5 20v-.5A5.5 5.5 0 0 1 10.5 14h3A5.5 5.5 0 0 1 19 19.5V20"></path></svg>';
      a.style.background = '#4220e5';
      a.style.borderColor = '#4220e5';
      a.style.color = '#fff';
      a.style.boxShadow = '0 6px 16px -6px rgba(66,32,229,.6)';
    });
  }

  function run() { try { tag(); initTram(); initMobileNav(); initBottomNav(); initDockNav(); markActiveNav(); } catch (e) {} }
  requestAnimationFrame(run);
  setInterval(run, 1200);
  document.addEventListener('DOMContentLoaded', run);
})();
