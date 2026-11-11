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
