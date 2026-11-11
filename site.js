// Shared behaviour for every page: custom cursor + keyboard access for index lists.
(function () {
  var root = document.documentElement;

  // ── Custom cursor ──────────────────────────────────────────
  // Only on devices with a real mouse. The native cursor is hidden by the
  // .custom-cursor class, so if this script fails the normal cursor stays.
  var cursor = document.getElementById('cursor');
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (cursor && fine) {
    var x = 0, y = 0, queued = false, shown = false;
    var HOVER = '[data-hover], a, button, input, select, .index-item, .collage-item img';

    cursor.style.opacity = '0';

    function paint() {
      queued = false;
      cursor.style.left = x + 'px';
      cursor.style.top = y + 'px';
    }

    document.addEventListener('mousemove', function (e) {
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        shown = true;
        root.classList.add('custom-cursor');
        cursor.style.opacity = '';
      }
      if (!queued) {
        queued = true;
        requestAnimationFrame(paint);
      }
    }, { passive: true });

    // One delegated listener covers elements added later (e.g. the music player).
    document.addEventListener('mouseover', function (e) {
      var t = e.target;
      cursor.classList.toggle('hovering', !!(t && t.closest && t.closest(HOVER)));
    }, { passive: true });

    root.addEventListener('mouseleave', function () { cursor.style.opacity = '0'; });
    root.addEventListener('mouseenter', function () { if (shown) cursor.style.opacity = ''; });
  }

  // ── Light / dark toggle ────────────────────────────────────
  // Follows the system setting until the visitor picks one; the choice is remembered.
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function isDark() {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : !!(mq && mq.matches);
  }
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'theme-toggle';
  btn.setAttribute('data-hover', '');
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg>';
  function label() {
    var next = isDark() ? 'light' : 'dark';
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var m = 0; m < metas.length; m++) {
      if (root.hasAttribute('data-theme')) metas[m].setAttribute('content', isDark() ? '#0c0f1d' : '#fffff2');
    }
    btn.setAttribute('aria-label', 'Switch to ' + next + ' mode');
    btn.title = 'Switch to ' + next + ' mode';
  }
  btn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.classList.add('theme-anim');
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    label();
    setTimeout(function () { root.classList.remove('theme-anim'); }, 400);
  });
  if (mq && mq.addEventListener) mq.addEventListener('change', label);
  label();
  document.body.appendChild(btn);

  // ── Keyboard access for clickable index rows (Music, Written Works) ──
  var rows = document.querySelectorAll('.index-item');
  for (var i = 0; i < rows.length; i++) {
    rows[i].setAttribute('tabindex', '0');
    rows[i].setAttribute('role', 'button');
    rows[i].addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); this.click(); }
    });
  }
})();
