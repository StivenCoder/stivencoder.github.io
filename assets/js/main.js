document.getElementById('year').textContent = new Date().getFullYear();

  (function () {
    var header = document.querySelector('.site-header');
    function onScroll() {
      header.classList.toggle('is-scrolled', window.scrollY > 4);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  (function () {
    var revealEls = document.querySelectorAll('.reveal');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  })();

  (function () {
    var counters = document.querySelectorAll('.stat-value');
    if (!counters.length) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animate(el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      if (reduceMotion) { el.textContent = '+' + target; return; }
      var duration = 1400;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = '+' + Math.round(eased * target);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    counters.forEach(function (el) { el.textContent = '+0'; });

    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (el) { animate(el); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(function (el) { io.observe(el); });
  })();

  (function () {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var root = document.documentElement;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var busy = false;

    function apply(t) {
      root.setAttribute('data-theme', t);
      btn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', t === 'dark' ? '#171614' : '#F1EAD9');
    }

    function save(t) {
      try { localStorage.setItem('theme', t); } catch (e) {}
    }

    function hasStoredTheme() {
      try { return localStorage.getItem('theme') !== null; } catch (e) { return false; }
    }

    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    function onSystemChange(e) {
      if (!hasStoredTheme()) apply(e.matches ? 'dark' : 'light');
    }
    if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
    else if (mq.addListener) mq.addListener(onSystemChange);

    apply(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

    btn.addEventListener('click', function () {
      if (busy) return;
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';

      if (reduce || !document.startViewTransition) {
        apply(next);
        save(next);
        return;
      }

      busy = true;
      var rect = btn.getBoundingClientRect();
      var x = rect.left + rect.width / 2;
      var y = rect.top + rect.height / 2;
      var r = Math.ceil(Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2)));

      root.style.setProperty('--ripple-x', x + 'px');
      root.style.setProperty('--ripple-y', y + 'px');
      root.style.setProperty('--ripple-r', r + 'px');

      var vt = document.startViewTransition(function () {
        apply(next);
        save(next);
      });

      vt.finished.finally(function () {
        busy = false;
      });
    });
  })();

  (function () {
    var marquees = document.querySelectorAll('.marquee-section, .tag-marquee');
    if (!marquees.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('is-paused', !entry.isIntersecting);
      });
    }, { rootMargin: '120px' });
    marquees.forEach(function (el) { io.observe(el); });
  })();
