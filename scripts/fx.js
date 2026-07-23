(function () {
  var root = document.getElementById('guaRoot') || document.body;
  try { if (localStorage.getItem('gua-theme') === 'dark') root.classList.add('theme-dark'); } catch (e) {}

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
      if (!b.classList.contains('gborder')) {
        if (getComputedStyle(b).position === 'static') b.style.position = 'relative';
        b.classList.add('gborder');
      }
    });
        document.querySelectorAll('span[style]').forEach(function (el) {
      if (el.classList.contains('gborder')) return;
      var s = el.getAttribute('style') || '';
      if ((/border-radius:\s*1[0-4]px/.test(s) || /border-radius:\s*50%/.test(s)) && el.querySelector('svg') && el.offsetWidth >= 34 && el.offsetWidth <= 66) {
        if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
        el.classList.add('gborder');
      }
    });
  }

  function addToggle() {
    if (document.querySelector('[data-theme-toggle]')) return;
    var btn = document.createElement('button');
    btn.setAttribute('data-theme-toggle', '1');
    btn.setAttribute('aria-label', 'Cambiar tema');
    btn.style.cssText = 'position:fixed; top:16px; right:16px; z-index:9999; width:44px; height:44px; border-radius:999px; border:1px solid rgba(0,0,0,.12); background:#fff; cursor:pointer; color:#4220e5; display:inline-flex; align-items:center; justify-content:center; box-shadow:0 8px 20px -8px rgba(20,18,56,.4);';
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"></path></svg>';
    btn.onclick = function () {
      var d = !root.classList.contains('theme-dark');
      root.classList.toggle('theme-dark', d);
      try { localStorage.setItem('gua-theme', d ? 'dark' : 'light'); } catch (e) {}
      try { syncDark(); } catch (e) {}
    };
    document.body.appendChild(btn);
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

  // ---- Modo oscuro por luminancia (el runtime normaliza inline a rgb) ----
  function parseColor(s) {
    if (!s) return null;
    var m = s.match(/rgba?\(([^)]+)\)/i);
    if (m) { var p = m[1].split(',').map(function (x) { return parseFloat(x); }); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; }
    m = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (m) { var h = m[1]; if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]; return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: 1 }; }
    return null;
  }
  function lum(c) { return (0.299 * c.r + 0.587 * c.g + 0.114 * c.b) / 255; }
  function sat(c) { var mx = Math.max(c.r, c.g, c.b), mn = Math.min(c.r, c.g, c.b); return mx === 0 ? 0 : (mx - mn) / mx; }

  var _darkLast = null;
  function applyDark(on) {
    var els = document.querySelectorAll('[style]');
    els.forEach(function (el) {
      if (el.closest('[data-btabbar]') || el.closest('[data-msheet]') || el.hasAttribute('data-theme-toggle')) return;
      // TEXTO
      var col = el.style && el.style.color;
      if (col) {
        if (on) {
          var c = parseColor(col);
          if (c && c.a > 0.3 && sat(c) < 0.22 && lum(c) < 0.6) {
            if (!el.hasAttribute('data-oc')) el.setAttribute('data-oc', col);
            el.style.color = lum(c) < 0.28 ? '#ececf5' : '#b6bad6';
          }
        } else if (el.hasAttribute('data-oc')) { el.style.color = el.getAttribute('data-oc'); el.removeAttribute('data-oc'); }
      }
      // FONDO (solo background-color liso claro; respeta degradados/imágenes)
      var bg = el.style && el.style.backgroundColor;
      if (bg) {
        if (on) {
          var b = parseColor(bg);
          if (b && b.a > 0.5 && sat(b) < 0.22 && lum(b) > 0.82) {
            if (!el.hasAttribute('data-ob')) el.setAttribute('data-ob', bg);
            el.style.backgroundColor = '#16192f';
            var bc = el.style.borderColor;
            if (bc) { var bcp = parseColor(bc); if (bcp && sat(bcp) < 0.3 && lum(bcp) > 0.8) { if (!el.hasAttribute('data-obc')) el.setAttribute('data-obc', bc); el.style.borderColor = 'rgba(255,255,255,.14)'; } }
          }
        } else {
          if (el.hasAttribute('data-ob')) { el.style.backgroundColor = el.getAttribute('data-ob'); el.removeAttribute('data-ob'); }
          if (el.hasAttribute('data-obc')) { el.style.borderColor = el.getAttribute('data-obc'); el.removeAttribute('data-obc'); }
        }
      }
    });
  }
  function syncDark() {
    var on = root.classList.contains('theme-dark');
    if (on) { try { applyDark(true); } catch (e) {} _darkLast = true; }
    else if (_darkLast !== false) { try { applyDark(false); } catch (e) {} _darkLast = false; }
  }

  function run() { try { tag(); addToggle(); initTram(); initMobileNav(); initBottomNav(); markActiveNav(); syncDark(); } catch (e) {} }
  requestAnimationFrame(run);
  setInterval(run, 1200);
  document.addEventListener('DOMContentLoaded', run);
})();
