(function () {
  if (window.__gibTouch) return; window.__gibTouch = 1;
  try { history.scrollRestoration = 'manual'; } catch (e) {}
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  var toTop = function () { scrollTo(0, 0); };
  toTop(); addEventListener('DOMContentLoaded', toTop); addEventListener('load', toTop);
  addEventListener('pageshow', function (e) { if (e.persisted) toTop(); });
  var touch = matchMedia('(hover: none)').matches;
  if (touch) {
    var conv = function () {
      for (var i = 0; i < document.styleSheets.length; i++) {
        var sh = document.styleSheets[i], rules; try { rules = sh.cssRules; } catch (e) { continue; }
        for (var j = 0; j < rules.length; j++) { var r = rules[j]; if (r.selectorText && r.selectorText.indexOf('.scp') > -1 && r.selectorText.indexOf(':hover') > -1) r.selectorText = r.selectorText.replace(/:hover/g, ':active'); }
      }
    };
    document.addEventListener('touchstart', conv, { passive: true, capture: true });
    addEventListener('pointerdown', conv, true);
    var st = document.createElement('style');
    st.textContent = 'a,button,[role=button]{-webkit-tap-highlight-color:transparent}a:active,button:active{opacity:.78;transition:opacity 0s}';
    document.head.appendChild(st);
    setTimeout(conv, 800);
  }
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var boot = function () {
    if (!document.body) return setTimeout(boot, 50);
    var bar = document.createElement('div'); bar.setAttribute('aria-hidden', 'true');
    bar.style.cssText = 'position:fixed;left:0;top:0;right:0;height:2px;z-index:90;pointer-events:none;background:#4edfc7;transform-origin:0 50%;transform:scaleX(0);box-shadow:0 0 10px rgba(78,223,199,.6)';
    document.body.appendChild(bar);
    var pq = 0, prog = function () { pq = 0; var m = document.documentElement.scrollHeight - innerHeight; bar.style.transform = 'scaleX(' + (m > 0 ? Math.min(1, scrollY / m) : 0) + ')'; };
    addEventListener('scroll', function () { if (!pq) pq = requestAnimationFrame(prog); }, { passive: true }); addEventListener('resize', prog); prog();
    if (RM) return;
    new MutationObserver(function (ms) { ms.forEach(function (m) {
      var el = m.target; if (el.id !== 'mobil-menu' || el.getAttribute('aria-hidden') !== 'false') return;
      el.querySelectorAll('nav a, :scope > a').forEach(function (a, i) {
        a.animate([{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: 60 + i * 45, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
      });
    }); }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['aria-hidden'] });
    if (touch) {
      var pressed = null;
      document.addEventListener('pointerdown', function (e) {
        var el = e.target.closest && e.target.closest('a,button,[role=button]'); if (!el) return;
        if (getComputedStyle(el).transform !== 'none') return;
        var big = el.offsetWidth * el.offsetHeight > 40000;
        pressed = el.animate([{ transform: 'none' }, { transform: 'scale(' + (big ? .975 : .94) + ')' }], { duration: 140, easing: 'ease-out', fill: 'forwards' });
      }, { passive: true, capture: true });
      var release = function () { if (!pressed) return; var p = pressed; pressed = null; p.reverse(); p.onfinish = function () { p.cancel(); }; };
      ['pointerup', 'pointercancel', 'scroll'].forEach(function (ev) { addEventListener(ev, release, { passive: true, capture: true }); });
    }
  };
  boot();
  var nativeX = function (w) { if (!w) return false; var o = getComputedStyle(w).overflowX; return (o === 'auto' || o === 'scroll') && w.scrollWidth > w.clientWidth + 2; };
  window.gibScrub = function (el, wrap, ok) {
    if (!el || el.__scrub) return; el.__scrub = 1; if (!wrap) el.style.touchAction = 'pan-y';
    var x0, y0, s0, on = false, moved = false, nat = false, id;
    el.addEventListener('pointerdown', function (e) { if (e.button || (ok && !ok())) return; nat = nativeX(wrap); if (nat && e.pointerType !== 'mouse') return; x0 = e.clientX; y0 = e.clientY; s0 = nat ? wrap.scrollLeft : scrollY; on = true; moved = false; id = e.pointerId; }, { passive: true });
    el.addEventListener('pointermove', function (e) {
      if (!on || e.pointerId !== id) return; var dx = e.clientX - x0, dy = e.clientY - y0;
      if (!moved) { if (Math.abs(dx) < 8) return; if (Math.abs(dy) > Math.abs(dx)) { on = false; return; } moved = true; try { el.setPointerCapture(id); } catch (_) {} }
      if (nat) wrap.scrollLeft = s0 - dx; else scrollTo(0, s0 - dx);
    });
    var end = function () { on = false; };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
    el.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    el.addEventListener('dragstart', function (e) { e.preventDefault(); });
  };
  window.gibStep = function (sec, n, dir, wrap) {
    if (nativeX(wrap)) { var c = wrap.querySelector('a,figure,article') || wrap.firstElementChild; wrap.scrollBy({ left: dir * (c ? c.getBoundingClientRect().width + 16 : wrap.clientWidth * .8), behavior: 'smooth' }); return; }
    if (!sec) return; var range = sec.offsetHeight - (innerHeight - 72); if (range <= 0) return;
    var top = sec.getBoundingClientRect().top + scrollY - 72, step = range / Math.max(1, n - 1);
    var idx = Math.max(0, Math.min(n - 1, Math.round((scrollY - top) / step) + dir));
    scrollTo({ top: top + idx * step, behavior: 'smooth' });
  };
})();
