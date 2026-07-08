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

  function run() { try { tag(); addToggle(); initTram(); } catch (e) {} }
  requestAnimationFrame(run);
  setInterval(run, 1200);
  document.addEventListener('DOMContentLoaded', run);
})();
