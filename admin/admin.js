/* Perfect Room — admin : produits, galerie, téléphone, horaires, textes. */
(function () {
  'use strict';
  var URL_ = 'https://rvreusugrtiubqtafgbk.supabase.co', KEY = 'sb_publishable_rTrEZB4mivU7kr9IwabvBQ_Q31CFt_1', BUCKET = 'perfect-room';
  var sb = window.supabase.createClient(URL_, KEY);
  var $ = function (s) { return document.querySelector(s); };
  var DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  var D = null, TAB = 'produits', DIRTY = false;

  function h(tag, a) {
    var e = document.createElement(tag); a = a || {};
    Object.keys(a).forEach(function (k) {
      var v = a[k]; if (v == null || v === false) return;
      if (k === 'text') e.textContent = v; else if (k === 'value') e.value = v; else if (k === 'checked') e.checked = !!v;
      else if (k.indexOf('on') === 0) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v === true ? '' : v);
    });
    for (var i = 2; i < arguments.length; i++) [].concat(arguments[i]).forEach(function (c) { if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  function toast(t, err) { var x = h('div', { class: 'toast' + (err ? ' e' : ''), text: t }); $('#toasts').appendChild(x); setTimeout(function () { x.remove(); }, 3500); }
  function src(p) { return !p ? '' : /^https?:/.test(p) ? p : '../' + p; }
  function uid() { return Math.random().toString(36).slice(2, 9); }
  function dirty() { DIRTY = true; var d = $('#dirty'); if (d) d.textContent = 'Modifications non enregistrées'; }
  window.addEventListener('beforeunload', function (e) { if (DIRTY) { e.preventDefault(); e.returnValue = ''; } });

  function showLogin(msg) {
    $('#who').innerHTML = '';
    var em = h('input', { type: 'email', autocomplete: 'username' }), pw = h('input', { type: 'password', autocomplete: 'current-password' });
    var err = h('p', { class: 'err', text: msg || '' }), btn = h('button', { class: 'btn y', type: 'submit' }, 'Se connecter');
    var f = h('form', { class: 'login' }, h('h1', { text: 'Admin Perfect Room' }),
      h('p', { class: 'muted', text: 'Ouvrez le lien de connexion directe qui vous a été envoyé. Sinon :' }),
      h('label', { text: 'Email' }), em, h('label', { text: 'Mot de passe' }), pw, err, btn);
    f.onsubmit = function (e) {
      e.preventDefault(); btn.disabled = true;
      sb.auth.signInWithPassword({ email: em.value.trim(), password: pw.value }).then(function (r) { btn.disabled = false; if (r.error) err.textContent = 'Identifiants incorrects.'; else start(); });
    };
    var app = $('#app'); app.innerHTML = ''; app.appendChild(f);
  }

  function start() {
    sb.rpc('perfect_room_is_admin').then(function (r) {
      if (r.error || !r.data) { showLogin('Ce compte n’a pas accès à l’admin de Perfect Room.'); return; }
      $('#who').innerHTML = '';
      $('#who').appendChild(h('button', { class: 'btn sm', onclick: function () { sb.auth.signOut().then(function () { location.reload(); }); } }, 'Déconnexion'));
      return sb.from('perfect_room_content').select('data').eq('id', 1).single().then(function (c) {
        if (c.error) { $('#app').innerHTML = ''; $('#app').appendChild(h('p', { class: 'err pad', text: 'Impossible de charger le contenu.' })); return; }
        D = c.data.data; D.products = D.products || []; D.gallery = D.gallery || []; D.hours = D.hours || [];
        draw();
      });
    });
  }

  function draw() {
    var app = $('#app'); app.innerHTML = '';
    app.appendChild(h('h1', { text: 'Bonjour 👋' }));
    app.appendChild(h('p', { class: 'muted', text: 'Modifiez votre site puis appuyez sur « Enregistrer ». Les changements sont visibles tout de suite.' }));
    var tabs = h('div', { class: 'tabs' });
    [['produits', 'Produits'], ['galerie', 'Galerie'], ['infos', 'Téléphone & horaires'], ['textes', 'Textes']].forEach(function (t) {
      tabs.appendChild(h('button', { class: TAB === t[0] ? 'on' : '', onclick: function () { TAB = t[0]; draw(); } }, t[1]));
    });
    app.appendChild(tabs);
    var body = h('div'); app.appendChild(body);
    ({ produits: drawProducts, galerie: drawGallery, infos: drawInfos, textes: drawTexts })[TAB](body);
    var save = h('button', { class: 'btn y', id: 'saveBtn', onclick: saveAll }, 'Enregistrer');
    app.appendChild(h('div', { class: 'savebar' }, h('span', { class: 'dirty', id: 'dirty', text: DIRTY ? 'Modifications non enregistrées' : '' }), save,
      h('a', { class: 'btn', href: '../', target: '_blank' }, 'Voir le site')));
  }

  function move(arr, i, d) { var j = i + d; if (j < 0 || j >= arr.length) return; var t = arr[i]; arr[i] = arr[j]; arr[j] = t; dirty(); draw(); }

  function resize(file, max) {
    return new Promise(function (res, rej) {
      var img = new Image(), u = URL.createObjectURL(file);
      img.onload = function () {
        var k = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement('canvas');
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(u);
        c.toBlob(function (b) { b ? res(b) : rej(new Error('conversion')); }, 'image/webp', 0.82);
      };
      img.onerror = function () { rej(new Error('image illisible')); }; img.src = u;
    });
  }
  function upload(file, folder) {
    var base = folder + '/' + Date.now() + '-' + uid();
    return Promise.all([resize(file, 1400), resize(file, 700)]).then(function (b) {
      return Promise.all([
        sb.storage.from(BUCKET).upload(base + '.webp', b[0], { contentType: 'image/webp', upsert: false }),
        sb.storage.from(BUCKET).upload(base + '-700.webp', b[1], { contentType: 'image/webp', upsert: false })]);
    }).then(function (r) {
      if (r[0].error || r[1].error) throw (r[0].error || r[1].error);
      return { photo: sb.storage.from(BUCKET).getPublicUrl(base + '.webp').data.publicUrl, thumb: sb.storage.from(BUCKET).getPublicUrl(base + '-700.webp').data.publicUrl };
    });
  }
  function photoBtn(label, onFile) {
    var inp = h('input', { type: 'file', accept: 'image/*' });
    var b = h('span', { class: 'btn sm up' }, label, inp);
    inp.onchange = function () {
      var f = inp.files[0]; if (!f) return; b.firstChild.textContent = 'Envoi…';
      onFile(f).then(function () { toast('Photo ajoutée. Pensez à enregistrer.'); }).catch(function (e) { toast('Échec de l’envoi de la photo : ' + (e.message || e), true); b.firstChild.textContent = label; });
    };
    return b;
  }

  function drawProducts(body) {
    body.appendChild(h('p', { class: 'hint', text: 'Ces produits s’affichent en premier sur le site. Prix facultatif : vide = « Prix sur demande ».' }));
    D.products.forEach(function (p, i) {
      var f = h('div', { class: 'fields' },
        h('div', {}, h('label', { text: 'Nom' }), h('input', { type: 'text', value: p.name || '', oninput: function (e) { p.name = e.target.value; dirty(); } })),
        h('div', {}, h('label', { text: 'Prix (facultatif)' }), h('input', { type: 'text', value: p.price || '', placeholder: 'ex. 3 500 DA', oninput: function (e) { p.price = e.target.value; dirty(); } })),
        h('div', {}, h('label', { text: 'Description' }), h('textarea', { oninput: function (e) { p.description = e.target.value; dirty(); } }, p.description || '')),
        h('div', { class: 'row' },
          h('label', { class: 'chk' }, h('input', { type: 'checkbox', checked: p.visible !== false, onchange: function (e) { p.visible = e.target.checked; dirty(); draw(); } }), 'Visible sur le site'),
          photoBtn('Changer la photo', function (file) { return upload(file, 'produits').then(function (u) { p.photo = u.photo; p.thumb = u.thumb; dirty(); draw(); }); }),
          h('button', { class: 'btn sm', onclick: function () { move(D.products, i, -1); }, 'aria-label': 'Monter' }, '↑'),
          h('button', { class: 'btn sm', onclick: function () { move(D.products, i, 1); }, 'aria-label': 'Descendre' }, '↓'),
          h('button', { class: 'btn sm red', onclick: function () { if (confirm('Supprimer « ' + (p.name || 'ce produit') + ' » ?')) { D.products.splice(i, 1); dirty(); draw(); } } }, 'Supprimer')));
      body.appendChild(h('div', { class: 'item' + (p.visible === false ? ' hiddenp' : '') }, h('img', { class: 'thumb', src: src(p.thumb || p.photo), alt: '' }), f));
    });
    body.appendChild(h('div', { class: 'row' }, photoBtn('+ Ajouter un produit (photo)', function (file) {
      return upload(file, 'produits').then(function (u) { D.products.push({ id: 'p' + uid(), name: 'Nouveau produit', price: '', description: '', visible: true, photo: u.photo, thumb: u.thumb }); dirty(); draw(); });
    })));
  }

  function drawGallery(body) {
    body.appendChild(h('p', { class: 'hint', text: 'Photos de la galerie (ouvertes en grand, à faire glisser).' }));
    D.gallery.forEach(function (g, i) {
      body.appendChild(h('div', { class: 'item' }, h('img', { class: 'thumb', src: src(g.thumb || g.photo), alt: '' }),
        h('div', { class: 'fields' },
          h('div', {}, h('label', { text: 'Légende (facultatif)' }), h('input', { type: 'text', value: g.caption || '', oninput: function (e) { g.caption = e.target.value; dirty(); } })),
          h('div', { class: 'row' },
            h('button', { class: 'btn sm', onclick: function () { move(D.gallery, i, -1); } }, '↑'),
            h('button', { class: 'btn sm', onclick: function () { move(D.gallery, i, 1); } }, '↓'),
            h('button', { class: 'btn sm red', onclick: function () { if (confirm('Retirer cette photo ?')) { D.gallery.splice(i, 1); dirty(); draw(); } } }, 'Retirer')))));
    });
    body.appendChild(h('div', { class: 'row' }, photoBtn('+ Ajouter une photo', function (file) {
      return upload(file, 'galerie').then(function (u) { D.gallery.push({ id: 'g' + uid(), caption: '', photo: u.photo, thumb: u.thumb }); dirty(); draw(); });
    })));
  }

  function field(label, key, type, ph) {
    var inp = type === 'area' ? h('textarea', { oninput: function (e) { D[key] = e.target.value; dirty(); } }, D[key] || '')
      : h('input', { type: type || 'text', value: D[key] || '', placeholder: ph || '', oninput: function (e) { D[key] = e.target.value; dirty(); } });
    return h('div', { style: 'margin-bottom:12px' }, h('label', { text: label }), inp);
  }
  function drawInfos(body) {
    body.appendChild(h('h2', { text: 'Contact' }));
    body.appendChild(field('Téléphone (affiché et bouton Appeler)', 'phone', 'tel', '0561 12 29 11'));
    body.appendChild(field('WhatsApp (format international sans +, vide = masqué)', 'whatsapp', 'tel', '213561122911'));
    body.appendChild(h('h2', { text: 'Horaires' }));
    [6, 0, 1, 2, 3, 4, 5].forEach(function (d) {
      var x = D.hours.filter(function (k) { return k.dow === d; })[0];
      if (!x) { x = { dow: d, closed: true, open: '09:00', close: '20:00' }; D.hours.push(x); }
      var o = h('input', { type: 'time', value: x.open, disabled: x.closed, onchange: function (e) { x.open = e.target.value; dirty(); } });
      var c = h('input', { type: 'time', value: x.close, disabled: x.closed, onchange: function (e) { x.close = e.target.value; dirty(); } });
      body.appendChild(h('div', { class: 'hours-row' }, h('strong', { text: DAYS[d] }),
        h('label', { class: 'chk' }, h('input', { type: 'checkbox', checked: x.closed, onchange: function (e) { x.closed = e.target.checked; o.disabled = c.disabled = x.closed; dirty(); } }), 'Fermé'), o, c));
    });
    D.hours.sort(function (a, b) { return ((a.dow + 1) % 7) - ((b.dow + 1) % 7); });
  }
  function drawTexts(body) {
    body.appendChild(field('Petite ligne au-dessus du titre', 'kicker'));
    body.appendChild(field('Phrase d’accroche (sous le titre)', 'lead', 'area'));
    body.appendChild(field('Titre de la section produits', 'products_title'));
    body.appendChild(field('Texte de la section produits', 'products_intro', 'area'));
    body.appendChild(field('Texte « L’atelier »', 'about_intro', 'area'));
  }

  function saveAll() {
    var b = $('#saveBtn');
    for (var i = 0; i < D.hours.length; i++) { var x = D.hours[i]; if (!x.closed && (!x.open || !x.close || x.close <= x.open)) return toast(DAYS[x.dow] + ' : l’heure de fermeture doit être après l’ouverture.', true); }
    if (D.products.some(function (p) { return !String(p.name || '').trim(); })) return toast('Chaque produit doit avoir un nom.', true);
    b.disabled = true; b.textContent = 'Enregistrement…';
    sb.from('perfect_room_content').update({ data: D, updated_at: new Date().toISOString() }).eq('id', 1).select('id').then(function (r) {
      b.disabled = false; b.textContent = 'Enregistrer';
      if (r.error || !r.data || !r.data.length) return toast('Échec de l’enregistrement.', true);
      DIRTY = false; $('#dirty').textContent = ''; toast('Enregistré ✔ Le site est à jour.');
    });
  }

  function consumeLoginLink() {
    var m = /^#connexion=([A-Za-z0-9_-]{20,200})$/.exec(location.hash);
    if (!m) return Promise.resolve(false);
    history.replaceState(null, '', location.pathname + location.search);
    $('#app').innerHTML = ''; $('#app').appendChild(h('p', { class: 'muted pad', text: 'Connexion par lien sécurisé…' }));
    return sb.auth.verifyOtp({ type: 'magiclink', token_hash: m[1] }).then(function (r) {
      if (r.error) { showLogin('Ce lien de connexion a expiré ou a déjà été utilisé. Demandez un nouveau lien.'); return true; }
      start(); return true;
    });
  }
  consumeLoginLink().then(function (used) { if (!used) sb.auth.getSession().then(function (s) { s.data.session ? start() : showLogin(); }); });
})();
