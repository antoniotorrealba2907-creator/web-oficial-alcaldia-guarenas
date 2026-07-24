/* video-slot.js — recuadro para cargar videos grandes (sin límite de ~5MB).
   Guarda el archivo en IndexedDB (admite cientos de MB) y lo reproduce por objectURL.
   Uso: <video-slot id="mi-id" placeholder="Arrastra tu video"></video-slot>
   El id es la clave de persistencia: el video sobrevive a recargas. */
(function () {
  if (window.customElements && customElements.get('video-slot')) return;

  var DB_NAME = 'gua-video-slots';
  var STORE = 'blobs';
  var _dbp = null;
  function db() {
    if (_dbp) return _dbp;
    _dbp = new Promise(function (res, rej) {
      var r = indexedDB.open(DB_NAME, 1);
      r.onupgradeneeded = function () {
        var d = r.result;
        if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE);
      };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
    });
    return _dbp;
  }
  function idbGet(key) {
    return db().then(function (d) {
      return new Promise(function (res, rej) {
        var t = d.transaction(STORE, 'readonly').objectStore(STORE).get(key);
        t.onsuccess = function () { res(t.result || null); };
        t.onerror = function () { rej(t.error); };
      });
    });
  }
  function idbSet(key, val) {
    return db().then(function (d) {
      return new Promise(function (res, rej) {
        var t = d.transaction(STORE, 'readwrite').objectStore(STORE).put(val, key);
        t.onsuccess = function () { res(); };
        t.onerror = function () { rej(t.error); };
      });
    });
  }
  function idbDel(key) {
    return db().then(function (d) {
      return new Promise(function (res) {
        var t = d.transaction(STORE, 'readwrite').objectStore(STORE).delete(key);
        t.onsuccess = function () { res(); };
        t.onerror = function () { res(); };
      });
    });
  }

  function fmtMB(bytes) { return (bytes / (1024 * 1024)).toFixed(1) + ' MB'; }

  // Helper global: saber si una clave tiene video guardado (Promise<boolean>)
  window.VideoSlotHas = function (key) { return idbGet(key).then(function (b) { return !!b; }).catch(function () { return false; }); };

  class VideoSlot extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      this._url = null;
      this.style.display = this.style.display || 'block';
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this._render();
      this._restore();
    }
    disconnectedCallback() { if (this._url) { URL.revokeObjectURL(this._url); this._url = null; } }

    get slotKey() { return this.getAttribute('id') || 'video-slot-default'; }

    _render() {
      var ph = this.getAttribute('placeholder') || 'Arrastra aquí tu video o toca para elegir';
      this.innerHTML =
        '<div class="vs-drop" style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; text-align:center; padding:22px; cursor:pointer; color:#aeb4d6; font-family:\'Varela Round\',system-ui,sans-serif;">' +
          '<span class="vs-ic" style="display:inline-flex; align-items:center; justify-content:center; width:66px; height:66px; border-radius:50%; background:rgba(255,255,255,.92); box-shadow:0 12px 30px -8px rgba(0,0,0,.5);">' +
            '<svg width="28" height="28" viewBox="0 0 24 24" fill="#4220e5" style="margin-left:3px;"><path d="M8 5v14l11-7z"/></svg>' +
          '</span>' +
          '<span class="vs-ph" style="font-size:13.5px; line-height:1.5; max-width:240px;">' + ph + '</span>' +
          '<span class="vs-sub" style="font-size:11px; opacity:.7;">MP4 · sin límite de tamaño</span>' +
        '</div>' +
        '<video class="vs-video" playsinline controls style="display:none; width:100%; height:100%; object-fit:cover; background:#000;"></video>' +
        '<button class="vs-clear" title="Quitar video" style="display:none; position:absolute; top:10px; right:10px; z-index:3; width:32px; height:32px; border:none; border-radius:50%; background:rgba(0,0,0,.55); color:#fff; cursor:pointer; font-size:16px; line-height:1;">&times;</button>' +
        '<input class="vs-file" type="file" accept="video/*" style="display:none;">';

      this._drop = this.querySelector('.vs-drop');
      this._video = this.querySelector('.vs-video');
      this._clear = this.querySelector('.vs-clear');
      this._input = this.querySelector('.vs-file');

      var self = this;
      this._drop.addEventListener('click', function () { self._input.click(); });
      this._input.addEventListener('change', function (e) {
        if (e.target.files && e.target.files[0]) self._accept(e.target.files[0]);
      });
      this._clear.addEventListener('click', function (e) {
        e.stopPropagation();
        idbDel(self.slotKey).then(function () { self._showEmpty(); });
      });
      ['dragenter', 'dragover'].forEach(function (ev) {
        self.addEventListener(ev, function (e) { e.preventDefault(); self.style.outline = '2px dashed #4220e5'; self.style.outlineOffset = '-6px'; });
      });
      ['dragleave', 'drop'].forEach(function (ev) {
        self.addEventListener(ev, function (e) { e.preventDefault(); self.style.outline = 'none'; });
      });
      this.addEventListener('drop', function (e) {
        var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) self._accept(f);
      });
    }

    _accept(file) {
      if (!/^video\//.test(file.type)) {
        this._flash('Ese archivo no es un video.');
        return;
      }
      this._drop.querySelector('.vs-ph').textContent = 'Guardando ' + fmtMB(file.size) + '…';
      var self = this;
      idbSet(this.slotKey, file).then(function () {
        self._play(file);
      }).catch(function () {
        // fallback: reproducir sin guardar
        self._play(file);
        self._flash('El video es muy grande para guardarse; se muestra solo esta sesión.');
      });
    }

    _restore() {
      var self = this;
      idbGet(this.slotKey).then(function (blob) {
        if (blob) self._play(blob); else self._showEmpty();
      }).catch(function () { self._showEmpty(); });
    }

    _play(blob) {
      if (this._url) URL.revokeObjectURL(this._url);
      this._url = URL.createObjectURL(blob);
      this._video.src = this._url;
      this._video.style.display = 'block';
      this._drop.style.display = 'none';
      this._clear.style.display = 'block';
    }

    _showEmpty() {
      if (this._url) { URL.revokeObjectURL(this._url); this._url = null; }
      this._video.removeAttribute('src'); this._video.load && this._video.load();
      this._video.style.display = 'none';
      this._drop.style.display = 'flex';
      this._clear.style.display = 'none';
      var ph = this.getAttribute('placeholder') || 'Arrastra aquí tu video o toca para elegir';
      this._drop.querySelector('.vs-ph').textContent = ph;
    }

    _flash(msg) {
      var sub = this._drop.querySelector('.vs-sub');
      if (!sub) return;
      var old = sub.textContent;
      sub.textContent = msg;
      setTimeout(function () { sub.textContent = old; }, 3500);
    }
  }

  customElements.define('video-slot', VideoSlot);
})();
