/* GİB Teknoloji — açık / koyu tema anahtarı.
   Koyu tema varsayılandır. Açık temada sayfadaki satır içi renklerin açık karşılıkları
   hesaplanıp tek bir stil sayfasına yazılır; seçim localStorage'da hatırlanır. */
(function () {
  if (window.__gibTheme) return; window.__gibTheme = 1;
  var KEY = 'gibTheme', root = document.documentElement;
  var get = function () { try { return localStorage.getItem(KEY) === 'light' ? 'light' : 'dark'; } catch (e) { return 'dark'; } };
  var save = function (t) { try { localStorage.setItem(KEY, t); } catch (e) {} };
  var theme = get();
  root.setAttribute('data-theme', theme);

  /* ---------- renk dönüşümü ---------- */
  var key3 = function (c) { return c[0] + ',' + c[1] + ',' + c[2]; };
  /* Açık tema paleti — GİB Teknoloji Marka Rehberi: Koyu Antrasit metin, Kano Mavisi tonlu zeminler,
     Teal Mavi vurgu, Turkuaz Yeşili buton, Koyu Mor ikincil vurgu. Biçimler koyu temayla aynı. */
  var INK = [37, 37, 37];
  var TEAL = [11, 122, 134];
  var TEXT = {
    '236,234,246': INK, '255,255,255': INK, '214,211,226': [68, 72, 76], '212,209,230': [68, 72, 76],
    '201,199,216': [68, 72, 76], '201,198,220': [68, 72, 76], '201,198,218': [68, 72, 76], '201,199,214': [68, 72, 76],
    '164,161,187': [86, 91, 96], '138,135,163': [98, 103, 108], '78,223,199': TEAL, '169,155,255': [23, 77, 101], '195,184,255': [23, 77, 101], '240,212,246': INK, '191,244,247': INK,
    '22,11,26': [37, 37, 37], '11,9,22': [37, 37, 37]
  };
  var PAGE = [255, 255, 255], LAGOON = [240, 244, 247], CARD = [255, 255, 255];
  var BG = {
    '22,11,26': PAGE, '43,26,52': CARD, '29,16,34': CARD, '16,13,31': CARD,
    '46,28,56': CARD, '11,9,22': CARD, '74,28,88': [222, 230, 236], '169,155,255': [234, 224, 247]
  };
  var ZEBRA = 'var(--g-zebra,rgba(27,86,112,.04))';
  var CARDKEYS = { '43,26,52': 1, '29,16,34': 1, '16,13,31': 1, '46,28,56': 1 };
  var CARDBG = 'var(--g-card,#ffffff)'; /* kartlar düz, çok açık gri-mavi */
  var LIFT = '0 1px 0 rgba(255,255,255,.9) inset,0 20px 44px -24px rgba(90,45,140,.24)';
  var hsl = function (r, g, b) {
    r /= 255; g /= 255; b /= 255; var mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, h = 0, s = 0, d = mx - mn;
    if (d) { s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; }
    return [h, s, l];
  };
  var rgb = function (h, s, l) {
    if (!s) { var v = Math.round(l * 255); return [v, v, v]; }
    var q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    var f = function (t) { t < 0 && (t += 1); t > 1 && (t -= 1); return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
    return [Math.round(f(h + 1 / 3) * 255), Math.round(f(h) * 255), Math.round(f(h - 1 / 3) * 255)];
  };
  var accent = function (s, l) { return s > .45 && l > .3 && l < .8; };
  function mapColor(c, a, role) {
    var k = key3(c), x = hsl(c[0], c[1], c[2]), s = x[1], l = x[2];
    if (role === 'grad') {
      if (s > .45) return [TEAL, a];
      return [INK, a];
      var tl = l > .8 ? .44 : l > .55 ? .38 : .32;
      if (s > .45) return [rgb(x[0], Math.min(s, .8), tl), a];
      return [l > .85 ? INK : l > .7 ? [42, 20, 56] : [75, 43, 102], a];
    }
    if (role === 'text') {
      if (TEXT[k]) return [TEXT[k], a];
      if (l < .3) return [c, a];
      if (accent(s, l)) return [rgb(x[0], s, Math.min(l, .38)), a];
      return [rgb(x[0], s * .6, Math.max(.12, 1 - l)), a];
    }
    if (role === 'shadow') {
      if (l < .25) return [[27, 40, 50], a * .16];
      if (accent(s, l)) return [c, Math.round(a * .2 * 1000) / 1000];
      return [c, a];
    }
    if (role === 'line') {
      if (k === '78,223,199') return [[11, 132, 145], a];
      if (accent(s, l)) return [c, a];
      return [l > .5 ? INK : [236, 234, 246], a];
    }
    /* arka plan */
    if (k === '80,45,95') return [LAGOON, .5];
    if (k === '0,0,0') return [INK, a * .25];
    if (a < 1 && k === '22,11,26') return [PAGE, a * .25];
    if (a < 1 && l > .85) return [INK, a];
    if (BG[k]) return [BG[k], a];
    if (accent(s, l)) return [c, a];
    if (l > .85) return [c, a];
    if (l < .4) return [rgb(x[0], Math.min(s, .5), 1 - l * .45), a];
    return [c, a];
  }
  var CRE = /rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/g;
  function mapValue(val, role) {
    return val.replace(CRE, function (m, r, g, b, a) {
      var o = mapColor([+r, +g, +b], a === undefined ? 1 : +a, role), c = o[0], al = Math.round(o[1] * 1000) / 1000;
      /* renk panelinden değiştirilebilen tonlar değişkenle yazılır */
      var vn = c === INK ? ['text', '#252525'] : c === TEAL ? ['accent', '#0b7a86'] : null;
      if (vn && (role === 'text' || role === 'grad')) return al >= 1 ? 'var(--g-' + vn[0] + ',' + vn[1] + ')' : 'color-mix(in srgb,var(--g-' + vn[0] + ',' + vn[1] + ') ' + Math.round(al * 100) + '%,transparent)';
      return al >= 1 ? 'rgb(' + c.join(', ') + ')' : 'rgba(' + c.join(', ') + ', ' + al + ')';
    });
  }
  function roleOf(prop, val) {
    if (/^(color|-webkit-text-fill-color|caret-color|fill|stroke|text-decoration-color)$/.test(prop)) return 'text';
    if (/^background/.test(prop)) return / text$/.test(val) ? 'grad' : 'bg';
    if (/^(border|outline)/.test(prop)) return 'line';
    if (/shadow$/.test(prop)) return 'shadow';
    return null;
  }
  function mapDecl(prop, val) {
    if (prop === 'filter') {
      if (/brightness\(0\) invert\(1\)/.test(val)) return val.replace(/brightness\(0\) invert\(1\)/, 'brightness(0)');
      if (/invert\(1\) hue-rotate\(180deg\)/.test(val)) return 'none';
      if (/drop-shadow/.test(val) && val.indexOf('rgb') > -1) return val.replace(CRE, function (m, r, g, b, a) { return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + Math.round((a === undefined ? 1 : +a) * 300) / 1000 + ')'; });
      return null;
    }
    if (prop === 'background' && /^rgba\(80, 45, 95, 0\.\d+\)$/.test(val)) return ZEBRA;
    var role = roleOf(prop, val); if (!role || val.indexOf('rgb') < 0 || val.indexOf('url(') > -1) return null;
    /* açık zeminde renkli parıltılar (radyal degradeler) patlamasın: canlı renklerin yoğunluğu düşürülür */
    if (role === 'bg' && /radial-gradient/.test(val)) {
      var g = val.replace(CRE, function (m, r, gg, b, a) {
        var c = [+r, +gg, +b], al = a === undefined ? 1 : +a, x = hsl(c[0], c[1], c[2]);
        if (x[1] > .45 && x[2] > .3) return 'rgba(' + c.join(', ') + ', ' + Math.round(al * .4 * 1000) / 1000 + ')';
        var o = mapColor(c, al, 'bg'), oa = Math.round(o[1] * 1000) / 1000; return oa >= 1 ? 'rgb(' + o[0].join(', ') + ')' : 'rgba(' + o[0].join(', ') + ', ' + oa + ')';
      });
      return g === val ? null : g;
    }
    var out = mapValue(val, role); return out === val ? null : out;
  }
  function splitDecls(st) {
    var out = [], depth = 0, q = '', cur = '';
    for (var i = 0; i < st.length; i++) {
      var ch = st[i];
      if (q) { if (ch === q) q = ''; } else if (ch === '"' || ch === "'") q = ch;
      else if (ch === '(') depth++; else if (ch === ')') depth--;
      else if (ch === ';' && !depth) { out.push(cur); cur = ''; continue; }
      cur += ch;
    }
    if (cur.trim()) out.push(cur); return out;
  }
  /* Açık temada zebra düzeni: koyu tema için işaretli (mürdüm tonlu) bölümler koyu kalır */
  /* Açık temada mürdüm bant yok; seçili bölümlerde kart rengi olarak kullanılır */
  var PLUMIDS = []; /* tasarım DNA'sı: koyu temada ikinci bir yüzey rengi yok, açıkta da mürdüm kart yok */
  /* Açık tema kartları: beyaz zemin üstünde kurumsal Kano Mavisi kartlar. Kartın içi koyu temadaki
     açık renkli yazılarla kalır (dönüştürülmez). */
  /* Kartların çoğu açık renkli kalır; her 6 karttan 2'si vurgu olarak marka renginde dolu olur
     (2. kart Koyu Mor, 5. kart Kano Mavisi). Vurgu kartlarının içi koyu temadaki açık yazılarla kalır. */
  var CARDBASE = ['[style*="background: rgb(43, 26, 52)"]', '[style*="background: rgb(29, 16, 34)"]'];
  var ACC = []; /* kartlar sıraya göre renklendirilmez; vurgu rengi İletişim bandında */
  var PLUMSEL = [];
  ACC.forEach(function (a) { CARDBASE.forEach(function (b) { PLUMSEL.push(b + a[0]); }); });
    var PLUMCARD = PLUMSEL.join(',');
  var PLUMDESC = PLUMSEL.map(function (x) { return x + ' *'; }).join(',');
  var BANDIDS = [], BAND = PLUMCARD, BANDDESC = PLUMDESC;
  var DARKZ = ['.gib-tt,.gib-tt *,.gib-top,.gib-top *', '#iletisim,#iletisim *', '#profil,#profil *', '#teknolojiler,#teknolojiler *', '#yolculuk,#yolculuk *', 'aside[aria-label="Filtreler"],aside[aria-label="Filtreler"] *', '#programlar [data-pcard]:first-child,#programlar [data-pcard]:first-child *', PLUMCARD, PLUMDESC].filter(Boolean).join(',');
  if (!BANDDESC) BANDDESC = '#gib-none';
  var esc = function (s) { return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"'); };

  /* Sayfa çizilmeden önce hazır olan kurallar: degradeli başlıklar ve standart yazı renkleri.
     (Animasyondaki bir yazının rengi sonradan değişirse tarayıcı onu geç boyuyor.) */
  function PRE() {
    var nd = ':not(' + DARKZ + ')', out = [];
    out.push('html[data-theme="light"] [style*=") text"]:not([style*="223, 199"])' + nd + ':not(#gib-x){background:linear-gradient(#252525,#252525)!important;-webkit-background-clip:text!important;background-clip:text!important}');
    out.push('html[data-theme="light"] [style*=") text"][style*="223, 199"]' + nd + ':not(#gib-x){background:linear-gradient(#0b7a86,#0b7a86)!important;-webkit-background-clip:text!important;background-clip:text!important}');
    Object.keys(TEXT).forEach(function (k) {
      var c = TEXT[k]; if (k === key3(c)) return;
      ['; color: rgb(' + k.split(',').join(', ') + ')', '"color: rgb(' + k.split(',').join(', ') + ')'].forEach(function (needle, n) {
        var sel = n ? '[style^="color: rgb(' + k.split(',').join(', ') + ')"]' : '[style*="' + needle.slice(0) + '"]';
        out.push('html[data-theme="light"] ' + sel + nd + '{color:rgb(' + c.join(', ') + ')!important}');
      });
    });
    return out;
  }

  /* ---------- stil sayfası ---------- */
  var BASE = [
    'html[data-theme="light"]{background:#ffffff!important}',
    'html[data-theme="light"] body{color:var(--g-text,#252525)!important;background:#ffffff!important}',
    'html[data-theme="light"] div[lang="tr"]:not(#gib-x):not(#gib-y):not(#gib-z){background:radial-gradient(1200px 820px at 0% 0%,color-mix(in srgb,var(--g-glow1,#2a7fa3) 14%,transparent),transparent 72%),radial-gradient(1000px 720px at 100% 0%,color-mix(in srgb,var(--g-glow2,#0b8491) 16%,transparent),transparent 70%),radial-gradient(900px 560px at 50% 45%,rgba(27,86,112,.05),transparent 72%),linear-gradient(180deg,var(--g-page,#f3f6f8) 0%,var(--g-page,#f3f6f8) 100%),var(--g-page,#f3f6f8)!important;background-size:100% 1000px,100% 1000px,100% 1000px,100% 1000px,auto!important;background-repeat:no-repeat!important}',
    'html[data-theme="light"] header:not(#gib-x),html[data-theme="light"] header[style]:not(#gib-x):not(#gib-y){background:var(--g-header,#ffffff)!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;border-bottom:1px solid rgba(37,37,37,.08)!important;box-shadow:none}',
    'html[data-theme="light"] img[data-gib-dsrc]:not(#gib-x):not(#gib-y):not(#gib-z){filter:none!important;opacity:1!important}',
    'html[data-theme="light"] #iletisim:not(#gib-x){background:var(--g-band,#174d65)!important}',
    'html[data-theme="light"] #iletisim p:not(#gib-x){color:rgba(255,255,255,.86)!important}',
    'html[data-theme="light"] #iletisim h2:not(#gib-x){color:#ffffff!important}',
    /* Kullanılan Teknolojiler çipleri: koyu temadaki üç tür korunur (mint dolu, lila dolu, çerçeveli cam);
       renkler koyu mavi zemine göre ayarlı */
    'html[data-theme="light"] #teknolojiler [data-chip]:not(#gib-x):not(#gib-y):not(#gib-z){box-shadow:0 18px 32px -18px rgba(4,22,32,.6)!important}',
    'html[data-theme="light"] #teknolojiler [data-chip][style*="background: rgb(191, 244, 247)"]:not(#gib-x):not(#gib-y):not(#gib-z){background:#c6f2ec!important;border-color:#c6f2ec!important;color:#0f3343!important}',
    'html[data-theme="light"] #teknolojiler [data-chip][style*="background: rgb(240, 212, 246)"]:not(#gib-x):not(#gib-y):not(#gib-z){background:#ead9f5!important;border-color:#ead9f5!important;color:#340738!important}',
    'html[data-theme="light"] #teknolojiler [data-chip][style*="background: transparent"]:not(#gib-x):not(#gib-y):not(#gib-z){background:rgba(255,255,255,.07)!important;border-color:rgba(255,255,255,.38)!important;color:#ffffff!important;box-shadow:none!important;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}',
    /* Projelerimiz atlama şeridinde seçili proje: Kano Mavisi dolu */
    'html[data-theme="light"] [aria-label="Projeye atla"] [role="tab"][aria-selected="true"]:not(#gib-x):not(#gib-y):not(#gib-z){background:var(--g-btn,#0b8491)!important;border-color:transparent!important;color:var(--g-btntext,#ffffff)!important}',
    /* Ödüllerimiz: görsellerin arkasındaki renkli zemin yok */
    'html[data-theme="light"] #odullerimiz div[style*="radial-gradient(circle at 50% 62%"]:not(#gib-x):not(#gib-y):not(#gib-z){background:transparent!important}',
    /* Ödüllerimiz: noktalı süs görselleri açık temada kurumsal renkli kopyalarıyla değişir (SWAPS);
       kartın üzerine gelince [data-aimg] gri filtresiyle griye döner. */
    'html[data-theme="light"] #odullerimiz img[src*="-l.png"]:not(#gib-x):not(#gib-y){filter:none!important;opacity:1!important}',
    /* Kurum Çalışan Profili: açık temada koyu Kano Mavisi bant, içi koyu temadaki açık yazılarla */
    'html[data-theme="light"] #profil:not(#gib-x){background:var(--g-profil,#174d65)!important;color:#ffffff!important}',
    'html[data-theme="light"] #profil p:not(#gib-x):not(#gib-y){color:rgba(255,255,255,.82)!important}',
    'html[data-theme="light"] #profil [data-r][style*="background: rgb(29, 16, 34)"]:not(#gib-x):not(#gib-y){background:rgba(255,255,255,.08)!important;border-color:rgba(255,255,255,.16)!important;box-shadow:none!important}',
    'html[data-theme="light"] #profil [data-ring] circle[data-arc]:not(#gib-x):not(#gib-y):not(#gib-z){stroke:#4edfc7!important;filter:none!important}',
    'html[data-theme="light"] #profil [data-ring] circle:not([data-arc]):not(#gib-x):not(#gib-y):not(#gib-z){stroke:rgba(255,255,255,.16)!important}',
    /* Kullanılan Teknolojiler: koyu Kano Mavisi zemin, kılavuz çizgileri ve açık yazılar koyu temadaki gibi */
    'html[data-theme="light"] #teknolojiler:not(#gib-x){background:var(--g-tech,#174d65)!important}',
    'html[data-theme="light"] #teknolojiler [style*="background-color: rgb(29, 16, 34)"]:not(#gib-x):not(#gib-y){background-color:var(--g-tech,#174d65)!important;background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px),radial-gradient(ellipse 55% 60% at 50% 55%,rgba(64,150,180,.45) 0%,rgba(64,150,180,0) 72%)!important;background-size:clamp(40px,3.4vw,60px) clamp(40px,3.4vw,60px),clamp(40px,3.4vw,60px) clamp(40px,3.4vw,60px),100% 100%!important}',
    'html[data-theme="light"] #teknolojiler p:not(#gib-x):not(#gib-y){color:rgba(255,255,255,.82)!important}',
    /* Staj sayfası Stajdan Profesyonelliğe: koyu Kano Mavisi bant, içi koyu temadaki açık yazılarla */
    'html[data-theme="light"] #yolculuk:not(#gib-x){background:var(--g-yolculuk,#174d65)!important;color:#ffffff!important}',
    /* Staj programları: ilk kart (Program Hakkında) öne çıkan koyu Kano Mavisi kart; diğer kartlar açık, başlıkları Kano Mavisi */
    'html[data-theme="light"] #programlar [data-pcard]:first-child:not(#gib-x):not(#gib-y):not(#gib-z){background:radial-gradient(120% 90% at 100% 0%,rgba(78,223,199,.18),rgba(78,223,199,0) 55%),linear-gradient(160deg,#1f6688 0%,#174d65 60%)!important;border-color:transparent!important;box-shadow:0 30px 60px -36px rgba(10,40,55,.55)!important}',
    'html[data-theme="light"] #programlar [data-pcard]:first-child h3:not(#gib-x):not(#gib-y):not(#gib-z){color:#ffffff!important}',
    'html[data-theme="light"] #programlar [data-pcard]:first-child p[data-pi]:not(:first-child):not(#gib-x):not(#gib-y):not(#gib-z){color:rgba(255,255,255,.74)!important}',
    'html[data-theme="light"] #programlar [data-pcard]:first-child p[data-pi]:first-child:not(#gib-x):not(#gib-y):not(#gib-z){color:#ffffff!important}',
    'html[data-theme="light"] #programlar [data-pcard]:not(:first-child) h3:not(#gib-x):not(#gib-y):not(#gib-z){color:var(--g-yolculuk,#174d65)!important}',
    /* Neler Sunuyoruz kutucukları: tek tip açık kutu + lacivert ikon; geniş son kutu (öne çıkan kazanım) lacivert */
    'html[data-theme="light"] #programlar [data-pcard] div[data-pi][style*="grid-column"]:not(#gib-x):not(#gib-y):not(#gib-z){background:#eef3f6!important;border-color:#dbe5eb!important}',
    'html[data-theme="light"] #programlar [data-pcard] div[data-pi][style*="grid-column"]:not(#gib-x):not(#gib-y):not(#gib-z) > span[aria-hidden]{background:#174d65!important;color:#ffffff!important}',
    'html[data-theme="light"] #programlar [data-pcard] div[data-pi][style*="grid-column"]:last-child:nth-child(odd):not(#gib-x):not(#gib-y):not(#gib-z):not(#gib-w){background:linear-gradient(160deg,#1f6688 0%,#174d65 60%)!important;border-color:transparent!important}',
    'html[data-theme="light"] #programlar [data-pcard] div[data-pi][style*="grid-column"]:last-child:nth-child(odd):not(#gib-x):not(#gib-y):not(#gib-z):not(#gib-w) > span[aria-hidden]{background:rgba(255,255,255,.16)!important;color:#ffffff!important}',
    'html[data-theme="light"] #programlar [data-pcard] div[data-pi][style*="grid-column"]:last-child:nth-child(odd):not(#gib-x):not(#gib-y):not(#gib-z):not(#gib-w) > span:not([aria-hidden]){color:#ffffff!important}',
    /* Ekibimizi Tanıyın kartları: açık kartlar; koyu temada turkuaz vurgulu kart açıkta lacivert öne çıkan kart */
    'html[data-theme="light"] #tanitim article:not(#gib-x):not(#gib-y):not(#gib-z){background:var(--g-card,#ffffff)!important;border-color:var(--g-cardline,rgba(23,77,101,.11))!important}',
    'html[data-theme="light"] #tanitim article[style*="rgba(78, 223, 199, 0.08)"]:not(#gib-x):not(#gib-y):not(#gib-z):not(#gib-w){background:linear-gradient(160deg,#1f6688 0%,#174d65 60%)!important;border-color:transparent!important}',
    'html[data-theme="light"] #tanitim article[style*="rgba(78, 223, 199, 0.08)"]:not(#gib-x):not(#gib-y):not(#gib-z):not(#gib-w) h3{color:#ffffff!important}',
    'html[data-theme="light"] #tanitim article[style*="rgba(78, 223, 199, 0.08)"]:not(#gib-x):not(#gib-y):not(#gib-z):not(#gib-w) p{color:rgba(255,255,255,.8)!important}',
    /* Açık Pozisyonlar: arama çubuğu yalnızca yapışınca zemin alır; filtre paneli lacivert; kategori renkleri kurumsal (Yazılım teal, Tasarım mor, Analiz lacivert, GİB kırmızı) */
    'html[data-theme="light"] [style*="position: sticky"][style*="rgba(22, 11, 26, 0.92)"]:not(#gib-x):not(#gib-y):not(#gib-z){background:transparent!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important}',
    'html[data-theme="light"] [style*="position: sticky"][style*="rgba(22, 11, 26, 0.92)"][data-gib-stuck]:not(#gib-x):not(#gib-y):not(#gib-z):not(#gib-w){background:color-mix(in srgb,var(--g-page,#f3f6f8) 92%,transparent)!important;-webkit-backdrop-filter:blur(14px)!important;backdrop-filter:blur(14px)!important;box-shadow:0 12px 24px -20px rgba(23,77,101,.5)!important}',
    'html[data-theme="light"] aside[aria-label="Filtreler"]:not(#gib-x):not(#gib-y):not(#gib-z){background:linear-gradient(170deg,#1f6688 0%,#174d65 55%,#143f53 100%)!important;border-color:transparent!important;box-shadow:0 30px 60px -36px rgba(10,40,55,.55)!important;color:#ffffff!important}',
    'html[data-theme="light"] aside[aria-label="Filtreler"] h2:not(#gib-x):not(#gib-y):not(#gib-z){color:#ffffff!important}',
    'html[data-theme="light"] aside[aria-label="Filtreler"] [style*="rgb(239, 159, 224)"]:not(#gib-x):not(#gib-y):not(#gib-z){background:#d7b8e6!important}',
    'html[data-theme="light"] aside[aria-label="Filtreler"] [style*="rgb(169, 155, 255)"]:not(#gib-x):not(#gib-y):not(#gib-z){background:#9fc4d6!important}',
    'html[data-theme="light"] a[href="#ilan"] span[style*="height: 3px"][style*="rgb(239, 159, 224)"]:not(#gib-x):not(#gib-y):not(#gib-z){background:#6e3a80!important}',
    'html[data-theme="light"] a[href="#ilan"] span[style*="height: 3px"][style*="rgb(169, 155, 255)"]:not(#gib-x):not(#gib-y):not(#gib-z){background:#174d65!important}',
    'html[data-theme="light"] a[href="#ilan"] span[style*="height: 3px"][style*="rgb(201, 198, 220)"]:not(#gib-x):not(#gib-y):not(#gib-z){background:#ed1c24!important}',
    'html[data-theme="light"] a[href="#ilan"] span[style*="color: rgb(239, 159, 224)"]:not(#gib-x):not(#gib-y):not(#gib-z){color:#6e3a80!important}',
    'html[data-theme="light"] a[href="#ilan"] span[style*="color: rgb(169, 155, 255)"]:not(#gib-x):not(#gib-y):not(#gib-z){color:#174d65!important}',
    'html[data-theme="light"] a[href="#ilan"] span[style*="color: rgb(201, 198, 220)"][style*="Geist Mono"]:not(#gib-x):not(#gib-y):not(#gib-z){color:#c4161c!important}',
    /* Filtre paneli (lacivert) okunurluk: etiketler, sayılar ve kutular yüksek kontrast */
    'html[data-theme="light"] aside[aria-label="Filtreler"] [style*="color: rgb(138, 135, 163)"]:not(#gib-x):not(#gib-y):not(#gib-z){color:rgba(255,255,255,.78)!important}',
    'html[data-theme="light"] aside[aria-label="Filtreler"] [style*="color: rgb(111, 108, 134)"]:not(#gib-x):not(#gib-y):not(#gib-z){color:rgba(255,255,255,.75)!important}',
    'html[data-theme="light"] aside[aria-label="Filtreler"] button[role="checkbox"]:not(#gib-x):not(#gib-y):not(#gib-z){color:#ffffff!important}',
    'html[data-theme="light"] aside[aria-label="Filtreler"] button[role="checkbox"] > span[aria-hidden]:not(#gib-x):not(#gib-y):not(#gib-z){border-color:rgba(255,255,255,.6)!important}',
    'html[data-theme="light"] aside[aria-label="Filtreler"] button[role="checkbox"][aria-checked="true"] > span[aria-hidden]:not(#gib-x):not(#gib-y):not(#gib-z):not(#gib-w){background:#ffffff!important;border-color:#ffffff!important}',
    'html[data-theme="light"] aside[aria-label="Filtreler"] [role="group"]:not(#gib-x):not(#gib-y):not(#gib-z){border-top-color:rgba(255,255,255,.18)!important}',
    'html[data-theme="light"] aside[aria-label="Filtreler"] h2 + button:not(#gib-x):not(#gib-y):not(#gib-z){color:#8ff0de!important;font-weight:500}',
    /* Staj hero etiketleri: lila olanlar açık temada teal kadar koyu mor */
    'html[data-theme="light"] [style*="border-radius: 999px"][style*="background: rgb(169, 155, 255)"][style*="rotate("]:not(#gib-x):not(#gib-y):not(#gib-z){background:#7b4fb0!important;color:#ffffff!important}',
    'html[data-theme="light"] [style*="border-radius: 999px"][style*="background: rgb(236, 234, 246)"][style*="rotate("]:not(#gib-x):not(#gib-y):not(#gib-z){background:#1f6688!important;color:#ffffff!important}',
    /* Anasayfa hero: sağ üstte teal, sol altta yumuşak bir mor ışık */
    'html[data-theme="light"] section#top:not(#gib-x):not(#gib-y){background:radial-gradient(800px 560px at 95% 10%,rgba(11,132,145,.12),transparent 70%)!important}',
    /* İmleç halkası: açık temada hem açık zeminde hem lacivert bantlarda görünsün (teal halka + ince beyaz kontur) */
    'html[data-theme="light"] [style*="position: fixed"][style*="width: 36px"][style*="margin: -18px 0px 0px -18px"]:not(#gib-x):not(#gib-y):not(#gib-z){border:1.5px solid #0b8491!important;box-shadow:0 0 0 1px rgba(255,255,255,.75),inset 0 0 0 1px rgba(255,255,255,.75)!important}',
    'html[data-theme="light"] #top > div[style*="120% 90% at 50% 0%"]:not(#gib-x):not(#gib-y):not(#gib-z){background:radial-gradient(1000px 640px at 0% 100%,color-mix(in srgb,var(--g-herop,#7b4fb0) 22%,transparent),transparent 70%),linear-gradient(180deg,transparent 80%,var(--g-page,#f3f6f8) 100%)!important}',
    /* Fotoğraflarımız etiketleri: açık temada pastel yerine Staj etiketleriyle aynı koyu mor / teal */
    'html[data-theme="light"] #fotograflar span[style*="border-radius: 999px"][style*="background: rgb(240, 212, 246)"]:not(#gib-x):not(#gib-y):not(#gib-z){background:#7b4fb0!important;color:#ffffff!important}',
    'html[data-theme="light"] #fotograflar span[style*="border-radius: 999px"][style*="background: rgb(191, 244, 247)"]:not(#gib-x):not(#gib-y):not(#gib-z){background:#0b8491!important;color:#ffffff!important}',
    /* CV Gönder butonu: Kano Mavisi */
    'html[data-theme="light"] a[href="cv-gonder.html"][style*="height"]:not(#gib-x):not(#gib-y):not(#gib-z){background-color:var(--g-btn,#0b8491)!important;color:var(--g-btntext,#ffffff)!important}',
    'html[data-theme="light"] a[href="cv-gonder.html"][style*="height"]:not(#gib-x):not(#gib-y):not(#gib-z)[style*="width: 136px"]:hover{background-image:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27none%27 stroke=%27%23ffffff%27 stroke-width=%271.8%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27M3 8h10M9 4l4 4-4 4%27/%3E%3C/svg%3E")!important}',
    'html[data-theme="light"] footer:not(#gib-x),html[data-theme="light"] footer[style]:not(#gib-x):not(#gib-y){background:var(--g-footer,#ffffff)!important;border-top:1px solid rgba(23,77,101,.1)}',
    'html[data-theme="light"] footer > div[style*="rgba(0, 0, 0, 0.24)"]:not(#gib-x):not(#gib-y):not(#gib-z){background:transparent!important;border-top-color:rgba(23,77,101,.1)!important}',
    'html[data-theme="light"] footer > div[style*="rgba(0, 0, 0, 0.24)"] span:not(#gib-x):not(#gib-y):not(#gib-z){color:#5b636b!important}',
    (PLUMSEL.length ? PLUMSEL.map(function (x) { return 'html[data-theme="light"] ' + x + ':not(#gib-x)'; }).join(',') + '{background-color:#1b5670!important;background-image:none!important;color:#f2f6f8!important;border-color:rgba(255,255,255,.14)!important;box-shadow:none!important}' : '/* mürdüm kart yok */'),
    /* kartlar sırayla marka renklerini alır: Kano Mavisi, Koyu Mor, Koyu Teal */
    ACC.map(function (a) { return CARDBASE.map(function (b) { return 'html[data-theme="light"] ' + b + a[0] + ':not(#gib-x):not(#gib-y)'; }).join(',') + '{background-color:' + a[1] + '!important}'; }).join('\n'),
    'html[data-theme="light"] [data-ring]:not(' + BANDDESC + ') circle[data-arc]{filter:none!important;stroke:#0b8491}',
    'html[data-theme="light"] [data-ring]:not(' + BANDDESC + ') circle:not([data-arc]){stroke:rgba(37,37,37,.1)}',
    'html[data-theme="light"] canvas:not(.gib-fx):not(' + BANDDESC + '){filter:invert(1) hue-rotate(180deg) saturate(1.2);mix-blend-mode:multiply;opacity:.8}',
    'html[data-theme="light"] img[src*="assets/logo-"][src$="-w.png"]{filter:brightness(0)!important;opacity:.88}',
    /* açık zeminde solarak belirme yazıyı beyazdan siyaha geçiyormuş gibi gösteriyor: açık temada yalnızca kayarak gelsin */
    'html[data-theme="light"] [data-r]:not(#gib-x){opacity:1!important}',
    /* menüde seçili sayfa çizgisi: açık temada parıltısız, düz koyu turkuaz */
    'html[data-theme="light"] header a span[style*="bottom: -7px"]:not(#gib-x):not(#gib-y):not(#gib-z){background:var(--g-btn,#0b8491)!important;box-shadow:none!important;left:0!important;right:0!important}',
    /* Hakkımızda: tanıtım filmi yazısı videonun üstünde, açık temada da beyaz kalsın */
    'html[data-theme="light"] [data-wov] span[data-w]:not(#gib-x):not(#gib-y){color:#ffffff!important;text-shadow:0 2px 18px rgba(0,0,0,.35)}',
    /* Ödüller: açık temada normalde renkli, üzerine gelince siyah-beyaz (koyu temanın tersi) */
    'html[data-theme="light"] [data-aimg]:not(#gib-x):not(#gib-y){filter:drop-shadow(0 16px 20px rgba(60,40,90,.22))!important}',
    'html[data-theme="light"] :hover > div > [data-aimg]:not(#gib-x):not(#gib-y){filter:grayscale(1) contrast(1.05) drop-shadow(0 16px 20px rgba(60,40,90,.22))!important}',
    /* mobil menü açık temada da açık renkli */
    'html[data-theme="light"] #mobil-menu:not(#gib-x):not(#gib-y){background:#ffffff!important;border-top:1px solid rgba(37,37,37,.08)}',
    'html[data-theme="light"] ::selection{background:rgba(11,132,145,.22);color:inherit}',
    'html[data-theme="light"] input,html[data-theme="light"] textarea,html[data-theme="light"] select{color-scheme:light}',
    '.gib-tt{position:fixed;left:calc(16px + env(safe-area-inset-left));bottom:calc(16px + env(safe-area-inset-bottom));z-index:95;display:flex;align-items:center;gap:10px;height:44px;padding:0 14px 0 8px;border:1px solid rgba(236,234,246,.18);border-radius:999px;background:rgba(22,11,26,.82);color:#eceaf6;font:500 14px/1 Geist,system-ui,sans-serif;cursor:pointer;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:0 10px 30px -12px rgba(0,0,0,.6);transition:background-color .25s ease,color .25s ease,border-color .25s ease}',
    /* mobil menü açıkken anahtar, menüdeki CV Gönder butonunun üstüne binmesin */
    'body:has(#mobil-menu[aria-hidden="false"]) .gib-tt{bottom:calc(104px + env(safe-area-inset-bottom))}',
    '.gib-tt:focus-visible{outline:2px solid #4edfc7;outline-offset:3px}',
    '.gib-tt__track{position:relative;flex:none;width:46px;height:28px;border-radius:999px;background:rgba(236,234,246,.16);transition:background-color .25s ease}',
    '.gib-tt__knob{position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#4edfc7;color:#0b0916;display:grid;place-items:center;transition:transform .3s cubic-bezier(.2,.8,.2,1)}',
    '.gib-tt__knob svg{width:14px;height:14px;display:block}',
    '.gib-top{position:fixed;right:calc(16px + env(safe-area-inset-right));bottom:calc(16px + env(safe-area-inset-bottom));z-index:95;display:grid;place-items:center;width:48px;height:48px;padding:0;border:0;border-radius:50%;background:#4edfc7;color:#160B1A;cursor:pointer;box-shadow:0 12px 28px -12px rgba(0,0,0,.55);opacity:0;visibility:hidden;transform:translateY(12px);transition:opacity .25s ease,transform .3s cubic-bezier(.22,1,.36,1),visibility 0s linear .3s,background-color .2s ease}',
    '.gib-top.is-on{opacity:1;visibility:visible;transform:none;transition:opacity .25s ease,transform .3s cubic-bezier(.22,1,.36,1),visibility 0s,background-color .2s ease}',
    '.gib-top:hover{transform:translateY(-2px)}',
    '.gib-top:focus-visible{outline:2px solid #4edfc7;outline-offset:3px}',
    '.gib-top svg{width:18px;height:18px;display:block}',
    'html[data-theme=\"light\"] .gib-top{background:var(--g-btn,#0b8491);color:var(--g-btntext,#ffffff);box-shadow:0 12px 28px -14px rgba(23,77,101,.55)}',
    'html[data-theme=\"light\"] .gib-top:hover{background:var(--g-btnhover,#08707b)}',
    'html[data-theme=\"light\"] .gib-top:focus-visible{outline-color:#0b8491}',
    'body:has(#mobil-menu[aria-hidden=\"false\"]) .gib-top{opacity:0;visibility:hidden}',
    'html.gib-sheet .gib-tt,html.gib-sheet .gib-top{opacity:0!important;visibility:hidden!important;pointer-events:none!important}',
    '@media (prefers-reduced-motion:reduce){.gib-top,.gib-top.is-on{transition:none}}',
    '.gib-tt .i-sun{display:none}',
    'html[data-theme="light"] .gib-tt{background:rgba(255,255,255,.9);color:#1d1022;border-color:rgba(29,16,34,.14);box-shadow:0 10px 30px -14px rgba(60,40,90,.35)}',
    'html[data-theme="light"] .gib-tt__track{background:rgba(29,16,34,.1)}',
    'html[data-theme="light"] .gib-tt__knob{transform:translateX(18px);background:#1d1022;color:#f7f5fb}',
    'html[data-theme="light"] .gib-tt .i-sun{display:block}html[data-theme="light"] .gib-tt .i-moon{display:none}',
    '@media (max-width:719px){.gib-tt__label{display:none}.gib-tt{padding:0 8px}}',
    /* ana sayfa başlığının harf harf giriş animasyonu: geçici span'lar baştan açık tema renginde */
    'html[data-theme="light"] #top h1 span[style*="will-change: transform"]:not(#gib-x):not(#gib-y):not(#gib-z){background-image:linear-gradient(#252525,#252525)!important;color:transparent!important}',
    'html[data-theme="light"] #top h1 em span[style*="will-change: transform"]:not(#gib-x):not(#gib-y):not(#gib-z):not(#gib-w){background-image:linear-gradient(#0b7a86,#0b7a86)!important}',
  ].concat(PRE()).join('\n');
  var baseEl = document.createElement('style'); baseEl.id = 'gib-theme-base'; baseEl.textContent = BASE;
  var dynEl = document.createElement('style'); dynEl.id = 'gib-theme-light';
  (document.head || root).appendChild(baseEl); (document.head || root).appendChild(dynEl);

  var seen = Object.create(null), seenRules = Object.create(null), rules = [];
  function addDecl(d) {
    var i = d.indexOf(':'); if (i < 0) return;
    var prop = d.slice(0, i).trim().toLowerCase(), val = d.slice(i + 1).trim().replace(/\s*!important$/, '');
    var id = prop + ': ' + val; if (seen[id]) return; seen[id] = 1;
    var nv = mapDecl(prop, val), extra = '';
    var m = /^background(-color)?$/.test(prop) && /^rgb\((\d+), (\d+), (\d+)\)$/.exec(val), k = m ? m[1] + ',' + m[2] + ',' + m[3] : '';
    if (k === '78,223,199') {
      /* açık temada tüm turkuaz butonlar Kano Mavisi, yazı/ikon beyaz */
      nv = 'var(--g-btn,#0b8491)'; extra = ';box-shadow:none!important;color:var(--g-btntext,#ffffff)!important';
      rules.push('html[data-theme="light"] [style*="' + esc(id) + '"]:not(' + DARKZ + '):not(#gib-x),html[data-theme="light"] [style*="' + esc(id) + '"]:not(' + DARKZ + '):not(#gib-x) *{color:var(--g-btntext,#ffffff)!important}');
      rules.push('html[data-theme="light"] [style*="' + esc(id) + '"]:not(' + DARKZ + '):not(#gib-x):not(#gib-y):hover{background-color:var(--g-btnhover,#08707b)!important;background-image:none!important;color:var(--g-btntext,#ffffff)!important}');
    } else if (CARDKEYS[k]) {
      nv = CARDBG; extra = ';box-shadow:none!important;border-color:var(--g-cardline,rgba(23,77,101,.11))!important;-webkit-backdrop-filter:blur(16px) saturate(1.3);backdrop-filter:blur(16px) saturate(1.3)';
      /* gölge yalnızca tıklanabilir kartlarda */
      rules.push('html[data-theme="light"] a[style*="' + esc(id) + '"][style*="' + esc(id) + '"]:not(' + DARKZ + '){box-shadow:' + LIFT + '!important}');
    }
    if (nv === null) return;
    rules.push('html[data-theme="light"] [style*="' + esc(id) + '"]:not(' + DARKZ + '){' + prop + ':' + nv + '!important' + extra + '}');
  }
  /* bantların içi: koyu yüzeyler bandın üstünde yarı saydam açık yüzeye, koyu perdeler bant rengine döner */
  var BANDC = [75, 43, 102];
  function bandDecl(prop, val, id) {
    if (!/^background/.test(prop) || val.indexOf('rgb') < 0 || val.indexOf('url(') > -1) return;
    var nv = val.replace(CRE, function (m, r, g, b, a) {
      var c = [+r, +g, +b], al = a === undefined ? 1 : +a, l = hsl(c[0], c[1], c[2])[2], k = key3(c);
      if (k === '78,223,199' || l >= .2) return m;
      if (al >= 1) return 'rgba(255, 255, 255, 0.08)';
      return 'rgba(' + BANDC.join(', ') + ', ' + al + ')';
    });
    if (nv === val) return;
    var x = CARDKEYS[key3((/rgb\((\d+), (\d+), (\d+)\)/.exec(val) || [0, 0, 0, 0]).slice(1).map(Number))] ? ';border-color:rgba(255,255,255,.14)!important' : '';
    rules.push(BANDIDS.map(function (i) { return 'html[data-theme="light"] ' + i + ' [style*="' + esc(id) + '"]:not(#gib-x)'; }).join(',') + '{' + prop + ':' + nv + '!important' + x + '}');
  }
  /* açık temada beyaz görsellerin renkli karşılıkları.
     Dosya adı adresin herhangi bir yerinde (yol, ?path=…, kodlanmış hali) geçse de yakalanır;
     tasarım ekranı görselleri farklı biçimde sunabiliyor. */
  var SWAPS = [
    ['gib-teknoloji-logo.png', 'gib-teknoloji-logo-renkli.svg'],
    ['logo-gibtek-w.png', 'gib-teknoloji-logo-renkli.svg'],
    ['gib-logo-beyaz.svg', 'gib-logo-renkli.svg'],
    ['tasarim-illus-w.png', 'tasarim-illus.png'],
    ['odul-c.png', 'odul-c-l.png'], ['odul-d.png', 'odul-d-l.png'], ['odul-e.png', 'odul-e-l.png']
  ];
  var UNI_T = function (n) { return n <= 11 || [16, 17, 20, 21].indexOf(n) > -1; };
  function lightSrc(src) {
    for (var k = 0; k < SWAPS.length; k++) {
      var a = SWAPS[k][0], b = SWAPS[k][1];
      if (src.indexOf(a) > -1) return src.split(a).join(b);
      var ea = encodeURIComponent(a); if (src.indexOf(ea) > -1) return src.split(ea).join(encodeURIComponent(b));
    }
    var u = /uni-(\d+)-d\.png/.exec(src);
    if (u && UNI_T(+u[1])) return src.replace(/uni-(\d+)-d\.png/, 'uni-$1-t.png');
    return null;
  }
  function swapImg(img, light) {
    var cur = img.getAttribute('src'); if (!cur) return;
    if (light) {
      /* React adresi geri yazdıysa (koyu görsel geri geldiyse) yeniden değiştir */
      if (img.hasAttribute('data-gib-dsrc') && cur === img.getAttribute('data-gib-lsrc')) return;
      var ls = lightSrc(cur);
      if (ls) { img.setAttribute('data-gib-dsrc', cur); img.setAttribute('data-gib-lsrc', ls); img.setAttribute('src', ls); }
    }
    else if (img.hasAttribute('data-gib-dsrc')) { var d = img.getAttribute('data-gib-dsrc'); img.removeAttribute('data-gib-dsrc'); img.removeAttribute('data-gib-lsrc'); img.setAttribute('src', d); }
  }
  function swapAll(light) { var a = document.querySelectorAll('img'); for (var i = 0; i < a.length; i++) swapImg(a[i], light); }
  function scanEl(el) {
    if (el.tagName === 'IMG') swapImg(el, true); var st = el.getAttribute && el.getAttribute('style'); if (st && /rgb|invert/.test(st)) splitDecls(st).forEach(addDecl); }
  function scanSheets() {
    for (var i = 0; i < document.styleSheets.length; i++) {
      var sh = document.styleSheets[i], rs; if (sh.ownerNode === dynEl || sh.ownerNode === baseEl) continue;
      try { rs = sh.cssRules; } catch (e) { continue; }
      for (var j = 0; j < rs.length; j++) {
        var r = rs[j]; if (!r.selectorText || !/\.scp\d+/.test(r.selectorText) || seenRules[r.cssText]) continue;
        seenRules[r.cssText] = 1; var body = [], tealHover = 0;
        for (var k = 0; k < r.style.length; k++) {
          var p = r.style[k], v = r.style.getPropertyValue(p), nv = mapDecl(p, v);
          if (/^background/.test(p) && v.indexOf('rgb(78, 223, 199)') > -1) { nv = v.split('rgb(78, 223, 199)').join('var(--g-btn,#0b8491)'); tealHover = 1; }
          body.push(p + ':' + (nv === null ? v : nv) + '!important');
        }
        if (tealHover) body = body.filter(function (d) { return !/^color:/.test(d); }).concat(['color:var(--g-btntext,#ffffff)!important']);
        if (body.length) rules.push(r.selectorText.split(',').map(function (s) { return 'html[data-theme="light"] ' + s.trim() + ':not(' + DARKZ + ')'; }).join(',') + '{' + body.join(';') + '}');
      }
    }
  }
  var lastLen = 0;
  function flush() { if (rules.length !== lastLen) { lastLen = rules.length; dynEl.textContent = rules.join('\n'); } }
  function scanAll() { swapAll(true); var all = document.querySelectorAll('[style]'); for (var i = 0; i < all.length; i++) scanEl(all[i]); scanSheets(); flush(); }

  /* yapışkan (sticky) çubuklar: yalnızca gerçekten yapıştığında zemin alsın */
  var stuckRaf = 0;
  function checkStuck() {
    stuckRaf = 0; var a = document.querySelectorAll('[style*="position: sticky"]');
    for (var i = 0; i < a.length; i++) { var el = a[i], t = parseFloat(getComputedStyle(el).top) || 0, on = el.getBoundingClientRect().top <= t + 1 && scrollY > 0;
      if (on !== el.hasAttribute('data-gib-stuck')) on ? el.setAttribute('data-gib-stuck', '') : el.removeAttribute('data-gib-stuck'); }
  }
  addEventListener('scroll', function () { if (!stuckRaf) stuckRaf = requestAnimationFrame(checkStuck); }, { passive: true });
  addEventListener('resize', function () { if (!stuckRaf) stuckRaf = requestAnimationFrame(checkStuck); });
  var pending = [], raf = 0, mo = null;
  function onMut(ms) {
    for (var i = 0; i < ms.length; i++) {
      var m = ms[i];
      if (m.type === 'attributes') pending.push(m.target);
      else for (var j = 0; j < m.addedNodes.length; j++) { var n = m.addedNodes[j]; if (n.nodeType === 1) { pending.push(n); if (n.querySelectorAll) { var q = n.querySelectorAll('[style],img'); for (var k = 0; k < q.length; k++) pending.push(q[k]); } } }
    }
    if (!raf) raf = requestAnimationFrame(function () { raf = 0; var p = pending; pending = []; for (var i = 0; i < p.length; i++) scanEl(p[i]); scanSheets(); flush(); });
  }
  function watch(on) {
    if (on && !mo) { mo = new MutationObserver(onMut); mo.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['style', 'src'] }); scanAll(); }
    if (!on && mo) { mo.disconnect(); mo = null; swapAll(false); }
  }

  /* ---------- anahtar ---------- */
  var SUN = '<svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg>';
  var MOON = '<svg class="i-moon" viewBox="0 0 24 24" fill="currentColor"><path d="M20.3 14.6A8.5 8.5 0 0 1 9.4 3.7a8.5 8.5 0 1 0 10.9 10.9z"></path></svg>';
  var btn;
  function sync() {
    if (!btn) return; var light = theme === 'light';
    btn.setAttribute('aria-checked', light ? 'true' : 'false');
    btn.querySelector('.gib-tt__label').textContent = light ? 'Açık tema' : 'Koyu tema';
  }
  function set(t) { theme = t; root.setAttribute('data-theme', t); save(t); watch(t === 'light'); sync(); }
  function mount() {
    if (!document.body) return setTimeout(mount, 30);
    btn = document.createElement('button'); btn.type = 'button'; btn.className = 'gib-tt';
    btn.setAttribute('role', 'switch'); btn.setAttribute('aria-label', 'Açık tema');
    btn.innerHTML = '<span class="gib-tt__track" aria-hidden="true"><span class="gib-tt__knob">' + MOON + SUN + '</span></span><span class="gib-tt__label"></span>';
    btn.addEventListener('click', function () { set(theme === 'light' ? 'dark' : 'light'); });
    document.body.appendChild(btn); sync();
    /* yukarı dön: sayfa bir ekrandan fazla kaydırılınca sağ altta belirir */
    var top = document.createElement('button'); top.type = 'button'; top.className = 'gib-top'; top.setAttribute('aria-label', 'Sayfanın başına dön');
    top.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 13V3M4 7l4-4 4 4"/></svg>';
    top.addEventListener('click', function () { var r = matchMedia('(prefers-reduced-motion: reduce)').matches; scrollTo({ top: 0, behavior: r ? 'auto' : 'smooth' }); });
    document.body.appendChild(top);
    /* butonun altına tıklanabilir bir öğe (ör. İstatistikler'deki yıl butonu) denk gelirse geçici olarak gizlenir */
    var IA = 'a,button,input,select,textarea,label,[role="button"],[role="tab"],[role="checkbox"],[role="radio"]';
    var overInteractive = function () {
      var r = top.getBoundingClientRect(), pts = [[r.left + r.width / 2, r.top + r.height / 2], [r.left + 4, r.top + 4], [r.right - 4, r.top + 4], [r.left + 4, r.bottom - 4], [r.right - 4, r.bottom - 4]];
      for (var i = 0; i < pts.length; i++) {
        var els = document.elementsFromPoint ? document.elementsFromPoint(pts[i][0], pts[i][1]) : [];
        for (var j = 0; j < els.length; j++) { var e = els[j]; if (e === top || top.contains(e) || e.closest('.gib-tt')) continue; if (e.closest && e.closest(IA)) return true; }
      }
      return false;
    };
    var topRaf = 0, upd = function () { topRaf = 0; var on = scrollY > innerHeight * 1.2 && !overInteractive(); if (on !== top.classList.contains('is-on')) { top.classList.toggle('is-on', on); top.tabIndex = on ? 0 : -1; } };
    addEventListener('resize', function () { if (!topRaf) topRaf = requestAnimationFrame(upd); });
    addEventListener('scroll', function () { if (!topRaf) topRaf = requestAnimationFrame(upd); }, { passive: true }); upd();
  }
  mount();

  /* ---------- lacivert bantlarda nokta alanı (açık tema) ----------
     Koyu temada fareyle dağılan nokta alanı yarı saydam bantların arkasından görünür. Açık temada lacivert bantlar
     opak olduğu için alanı örter; bu yüzden alanın açık renkli hâlini yalnızca bu bantların üstüne, 'screen' karışımıyla kopyalarız. */
  var BANDS = '#iletisim,#profil,#teknolojiler,#yolculuk,aside[aria-label="Filtreler"]';
  var fx = null, fxc = null, fxRaf = 0;
  function fxLoop() {
    fxRaf = 0;
    var src = document.querySelector('canvas[style*="position: fixed"][style*="z-index: 0"]');
    if (theme !== 'light' || !src || !src.width) { if (fx) fx.style.display = 'none'; fxRaf = requestAnimationFrame(fxLoop); return; }
    if (!fx) {
      fx = document.createElement('canvas'); fx.setAttribute('aria-hidden', 'true'); fx.className = 'gib-fx';
      fx.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;z-index:2;pointer-events:none;mix-blend-mode:screen;opacity:.9';
      document.body.appendChild(fx); fxc = fx.getContext('2d');
    }
    var W = innerWidth, H = innerHeight, rects = [], els = document.querySelectorAll(BANDS);
    for (var i = 0; i < els.length; i++) { var r = els[i].getBoundingClientRect(); if (r.bottom > 0 && r.top < H && r.width) rects.push(r); }
    if (!rects.length) { fx.style.display = 'none'; fxRaf = requestAnimationFrame(fxLoop); return; }
    fx.style.display = 'block';
    if (fx.width !== src.width || fx.height !== src.height) { fx.width = src.width; fx.height = src.height; }
    var sx = fx.width / W, sy = fx.height / H;
    fxc.clearRect(0, 0, fx.width, fx.height); fxc.save(); fxc.beginPath();
    rects.forEach(function (r) { fxc.rect(r.left * sx, r.top * sy, r.width * sx, r.height * sy); });
    fxc.clip(); fxc.drawImage(src, 0, 0); fxc.restore();
    fxRaf = requestAnimationFrame(fxLoop);
  }
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) fxRaf = requestAnimationFrame(fxLoop);

  /* ---------- renk paneli (açık tema renklerini elle denemek için) ----------
     Adrese ?renk eklenince ya da Alt+Shift+R ile açılır. Seçilen renkler bu tarayıcıda saklanır
     ve tüm sayfalarda uygulanır; "Sıfırla" ile varsayılanlara döner. */
  var CKEY = 'gibColors', PKEY = 'gibColorPanel';
  var TOKENS = [
    ['page', 'Sayfa zemini', '#f3f6f8'], ['zebra', 'Bölüm şeridi', '#f6f8f9'], ['header', 'Üst menü zemini', '#ffffff'],
    ['glow1', 'Hero parıltısı (sol)', '#2a7fa3'], ['herop', 'Anasayfa hero mor ışığı', '#7b4fb0'], ['glow2', 'Hero parıltısı (sağ)', '#0b8491'],
    ['card', 'Kart zemini', '#ffffff'], ['cardline', 'Kart kenarı', '#dde5ea'],
    ['btn', 'Buton ve seçili durumlar', '#0b8491'], ['btnhover', 'Buton (üzerine gelince)', '#08707b'], ['btntext', 'Buton yazısı', '#ffffff'],
    ['band', 'İletişim bandı', '#174d65'], ['profil', 'Kurum Çalışan Profili zemini', '#174d65'], ['tech', 'Kullanılan Teknolojiler zemini', '#174d65'], ['yolculuk', 'Stajdan Profesyonelliğe zemini', '#174d65'], ['footer', 'Alt bilgi zemini', '#ffffff'],
    ['text', 'Ana yazı', '#252525'], ['accent', 'Vurgu yazısı', '#0b7a86']
  ];
  var cget = function () { try { return JSON.parse(localStorage.getItem(CKEY) || '{}') || {}; } catch (e) { return {}; } };
  var cset = function (o) { try { localStorage.setItem(CKEY, JSON.stringify(o)); } catch (e) {} };
  var colors = cget(), varEl = document.createElement('style'); varEl.id = 'gib-theme-vars';
  (document.head || root).appendChild(varEl);
  function applyVars() {
    var d = []; for (var n in colors) if (/^#[0-9a-f]{6}$/i.test(colors[n])) d.push('--g-' + n + ':' + colors[n]);
    varEl.textContent = d.length ? 'html[data-theme="light"]{' + d.join(';') + '}' : '';
  }
  applyVars();
  var pnl;
  function exportText() {
    return TOKENS.map(function (t) { return t[1] + ': ' + (colors[t[0]] || t[2]).toUpperCase(); }).join('\n');
  }
  function openPanel() {
    try { localStorage.setItem(PKEY, '1'); } catch (e) {}
    if (theme !== 'light') set('light');
    if (pnl) { pnl.hidden = false; return; }
    if (!document.body) return setTimeout(openPanel, 30);
    var css = document.createElement('style');
    css.textContent = '.gib-cp{position:fixed;z-index:2147483646;top:84px;right:16px;width:300px;max-height:calc(100vh - 100px);overflow:auto;background:#fff;color:#252525;border:1px solid rgba(0,0,0,.12);border-radius:16px;box-shadow:0 24px 60px -20px rgba(0,0,0,.35);font:13px/1.4 Inter,system-ui,sans-serif;padding:14px 14px 12px}'
      + '.gib-cp[hidden]{display:none}.gib-cp h3{margin:0 0 2px;font-size:15px;font-weight:600}.gib-cp p{margin:0 0 10px;color:#5a6066;font-size:12px}'
      + '.gib-cp__row{display:flex;align-items:center;gap:8px;padding:5px 0;border-top:1px solid rgba(0,0,0,.06)}.gib-cp__row label{flex:1;min-width:0}'
      + '.gib-cp__row input[type=color]{width:34px;height:26px;padding:0;border:1px solid rgba(0,0,0,.15);border-radius:6px;background:none;cursor:pointer}'
      + '.gib-cp__row input[type=text]{width:76px;height:26px;padding:0 6px;border:1px solid rgba(0,0,0,.15);border-radius:6px;font:12px ui-monospace,monospace;text-transform:uppercase;color:#252525;background:#fff}'
      + '.gib-cp__row.is-set label{font-weight:600}.gib-cp__bar{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap}'
      + '.gib-cp__bar button{flex:1;height:32px;border-radius:999px;border:1px solid rgba(0,0,0,.15);background:#fff;color:#252525;font:500 12px Inter,system-ui,sans-serif;cursor:pointer}'
      + '.gib-cp__bar button.pri{background:#1b5670;border-color:#1b5670;color:#fff}.gib-cp__x{position:absolute;top:8px;right:8px;width:28px;height:28px;border:0;background:none;font-size:18px;cursor:pointer;color:#5a6066}'
      + '.gib-cp__msg{margin-top:8px;font-size:12px;color:#0b7a86;min-height:16px}';
    document.head.appendChild(css);
    pnl = document.createElement('div'); pnl.className = 'gib-cp'; pnl.setAttribute('role', 'dialog'); pnl.setAttribute('aria-label', 'Açık tema renkleri');
    pnl.innerHTML = '<button class="gib-cp__x" type="button" aria-label="Kapat">×</button><h3>Açık tema renkleri</h3><p>Değişiklikler anında uygulanır ve tüm sayfalarda bu tarayıcıda saklanır.</p><div class="gib-cp__list"></div>'
      + '<div class="gib-cp__bar"><button type="button" class="pri" data-a="copy">Renkleri kopyala</button><button type="button" data-a="reset">Sıfırla</button></div><div class="gib-cp__msg" aria-live="polite"></div>';
    var list = pnl.querySelector('.gib-cp__list'), msg = pnl.querySelector('.gib-cp__msg');
    TOKENS.forEach(function (t) {
      var row = document.createElement('div'); row.className = 'gib-cp__row' + (colors[t[0]] ? ' is-set' : '');
      var v = colors[t[0]] || t[2], id = 'gib-cp-' + t[0];
      row.innerHTML = '<label for="' + id + '">' + t[1] + '</label><input id="' + id + '" type="color" value="' + v + '"><input type="text" value="' + v + '" aria-label="' + t[1] + ' (hex)" maxlength="7">';
      var pick = row.children[1], txt = row.children[2];
      function put(val) { colors[t[0]] = val.toLowerCase(); cset(colors); applyVars(); row.classList.add('is-set'); }
      pick.addEventListener('input', function () { txt.value = pick.value.toUpperCase(); put(pick.value); });
      txt.addEventListener('input', function () { var x = txt.value.trim(); if (x[0] !== '#') x = '#' + x; if (/^#[0-9a-f]{6}$/i.test(x)) { pick.value = x.toLowerCase(); put(x); } });
      list.appendChild(row);
    });
    pnl.addEventListener('click', function (e) {
      var a = e.target.getAttribute && e.target.getAttribute('data-a');
      if (e.target.className === 'gib-cp__x') { pnl.hidden = true; try { localStorage.removeItem(PKEY); } catch (er) {} return; }
      if (a === 'reset') {
        colors = {}; cset(colors); applyVars();
        TOKENS.forEach(function (t, i) { var r = list.children[i]; r.classList.remove('is-set'); r.children[1].value = t[2]; r.children[2].value = t[2].toUpperCase(); });
        msg.textContent = 'Varsayılan renklere dönüldü.';
      }
      if (a === 'copy') {
        var tx = exportText();
        var done = function () { msg.textContent = 'Kopyalandı. Claude\'a yapıştırıp gönderebilirsin.'; };
        if (navigator.clipboard) navigator.clipboard.writeText(tx).then(done, function () { prompt('Renkler:', tx); });
        else prompt('Renkler:', tx);
      }
    });
    document.body.appendChild(pnl);
  }
  addEventListener('keydown', function (e) { if (e.altKey && e.shiftKey && (e.code === 'KeyR')) { e.preventDefault(); if (pnl && !pnl.hidden) { pnl.hidden = true; try { localStorage.removeItem(PKEY); } catch (er) {} } else openPanel(); } });
  var wantPanel = /[?&#]renk\b/.test(location.search + location.hash);
  try { wantPanel = wantPanel || localStorage.getItem(PKEY) === '1'; } catch (e) {}
  watch(theme === 'light');
  if (wantPanel) openPanel();
  addEventListener('load', function () { if (theme === 'light') scanAll(); });
  addEventListener('storage', function (e) { if (e.key === KEY) set(get()); if (e.key === CKEY) { colors = cget(); applyVars(); } });
})();
