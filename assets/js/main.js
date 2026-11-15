/* Security Research portfolio — progressive enhancement only.
   All content is visible without JavaScript. */
(function () {
  'use strict';

  var doc = document;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Mobile navigation ---------- */
  var toggle = doc.querySelector('[data-nav-toggle]');
  var menu = doc.getElementById('mobile-menu');
  var header = doc.querySelector('[data-header]');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      if (open) {
        menu.hidden = true;
        menu.classList.remove('is-open');
        doc.body.classList.remove('menu-open');
      } else {
        menu.hidden = false;
        /* allow transition from the hidden/initial state */
        window.requestAnimationFrame(function () {
          menu.classList.add('is-open');
        });
        doc.body.classList.add('menu-open');
      }
    });

    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        toggle.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
        menu.classList.remove('is-open');
        doc.body.classList.remove('menu-open');
        toggle.focus();
      }
    });

    doc.addEventListener('click', function (e) {
      if (
        toggle.getAttribute('aria-expanded') === 'true' &&
        !header.contains(e.target)
      ) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
        menu.classList.remove('is-open');
        doc.body.classList.remove('menu-open');
      }
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
        menu.classList.remove('is-open');
        doc.body.classList.remove('menu-open');
      }
    });
  }

  /* ---------- Sticky header shadow ---------- */
  var onScroll = function () {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll-triggered reveal (IntersectionObserver) ---------- */
  var revealTargets = doc.querySelectorAll('.reveal');
  if (
    revealTargets.length &&
    'IntersectionObserver' in window &&
    !reducedMotion.matches
  ) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 }
    );
    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ---------- Statistic counters ---------- */
  var counters = doc.querySelectorAll('[data-count-to]');
  var finishCounter = function (el) {
    el.textContent = el.getAttribute('data-count-to');
    el.classList.add('is-counted');
  };
  if (counters.length) {
    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      counters.forEach(finishCounter);
    } else {
      var countObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            countObserver.unobserve(entry.target);
            var el = entry.target;
            var target = parseInt(el.getAttribute('data-count-to'), 10);
            var start = null;
            var duration = 900;
            var step = function (ts) {
              if (start === null) start = ts;
              var progress = Math.min((ts - start) / duration, 1);
              var eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = String(Math.round(eased * target));
              if (progress < 1) {
                window.requestAnimationFrame(step);
              } else {
                el.classList.add('is-counted');
              }
            };
            window.requestAnimationFrame(step);
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach(function (el) {
        countObserver.observe(el);
      });
    }
  }

  /* ---------- Homepage section scroll-spy ---------- */
  var spySections = doc.querySelectorAll('[data-nav-section]');
  var navLinks = doc.querySelectorAll('.nav-link[href]');
  if (spySections.length && navLinks.length && 'IntersectionObserver' in window) {
    var linkFor = {};
    navLinks.forEach(function (link) {
      linkFor[link.getAttribute('href')] = link;
    });
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var href = entry.target.getAttribute('data-nav-section');
          navLinks.forEach(function (link) {
            link.classList.toggle('is-active', link === linkFor[href]);
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    spySections.forEach(function (section) {
      spy.observe(section);
    });
  }

  /* ---------- Background particle network ---------- */
  var canvas = doc.getElementById('bg-particles');
  var particlesEnabled =
    canvas &&
    canvas.getContext &&
    !reducedMotion.matches;

  if (particlesEnabled) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var bokeh = [];
    var running = false;
    var rafId = null;
    var dpr = 1;
    var BLUE = '99, 168, 255';
    var CYAN = '64, 205, 230';
    var sprites = null;

    var makeSprite = function (color) {
      var s = doc.createElement('canvas');
      s.width = s.height = 128;
      var sc = s.getContext('2d');
      var g = sc.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, 'rgba(' + color + ',0.5)');
      g.addColorStop(0.35, 'rgba(' + color + ',0.16)');
      g.addColorStop(1, 'rgba(' + color + ',0)');
      sc.fillStyle = g;
      sc.fillRect(0, 0, 128, 128);
      return s;
    };

    var density = function () {
      /* Responsive density: fewer nodes on small/low-power screens. */
      var base = window.innerWidth < 640 ? 30 : 62;
      if (window.innerWidth < 380) base = 22;
      return base;
    };

    var spawn = function (initial) {
      var speed = 8 + Math.random() * 16;
      var angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.9;
      return {
        x: Math.random() * canvas.width,
        y: initial ? Math.random() * canvas.height : canvas.height + 12,
        r: 0.8 + Math.random() * 1.4,
        vx: Math.cos(angle) * speed * 0.4,
        vy: Math.sin(angle) * speed,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.3 + Math.random() * 0.35,
        tint: Math.random() > 0.35 ? CYAN : BLUE
      };
    };

    var spawnBokeh = function (initial) {
      return {
        x: Math.random() * canvas.width,
        y: initial ? Math.random() * canvas.height : canvas.height + 140,
        r: (26 + Math.random() * 70) * dpr,
        vx: (Math.random() - 0.5) * 4 * dpr,
        vy: -(2 + Math.random() * 5) * dpr,
        alpha: 0.04 + Math.random() * 0.05,
        sprite: Math.floor(Math.random() * sprites.length),
        phase: Math.random() * Math.PI * 2
      };
    };

    var resize = function () {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      var count = density();
      particles.length = 0;
      for (var i = 0; i < count; i++) {
        particles.push(spawn(true));
      }
      bokeh.length = 0;
      var bokehCount = window.innerWidth < 640 ? 5 : 9;
      for (var b = 0; b < bokehCount; b++) {
        bokeh.push(spawnBokeh(true));
      }
    };

    var draw = function (dt) {
      var w = canvas.width;
      var h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      /* soft bokeh orbs (behind everything) */
      var b, s;
      for (var i = 0; i < bokeh.length; i++) {
        b = bokeh[i];
        b.phase += dt * 0.4;
        b.x += (b.vx + Math.sin(b.phase) * 2 * dpr) * dt;
        b.y += b.vy * dt;
        if (b.y < -b.r * 2 || b.x < -b.r * 2 || b.x > w + b.r * 2) {
          bokeh[i] = spawnBokeh(false);
          continue;
        }
        s = sprites[b.sprite];
        ctx.globalAlpha = b.alpha;
        ctx.drawImage(s, b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
      }
      ctx.globalAlpha = 1;

      /* constellation lines between nearby nodes */
      var p, q, dx, dy, dist2;
      var linkDist = 120 * dpr;
      var linkDist2 = linkDist * linkDist;
      ctx.lineWidth = Math.max(1, dpr * 0.6);
      for (i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          p = particles[i];
          q = particles[j];
          dx = p.x - q.x;
          dy = p.y - q.y;
          dist2 = dx * dx + dy * dy;
          if (dist2 < linkDist2) {
            var la = (1 - Math.sqrt(dist2) / linkDist) * 0.22;
            ctx.strokeStyle = 'rgba(74, 176, 222,' + la.toFixed(3) + ')';
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      /* glowing nodes */
      for (i = 0; i < particles.length; i++) {
        p = particles[i];
        p.phase += dt * 0.9;
        p.x += (p.vx + Math.sin(p.phase) * 3) * dt;
        p.y += p.vy * dt;
        if (p.y < -16 || p.x < -24 || p.x > w + 24) {
          particles[i] = spawn(false);
          continue;
        }
        var twinkle = 0.75 + Math.sin(p.phase * 1.6) * 0.25;
        var a = p.alpha * twinkle * dpr;
        /* soft halo */
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + p.tint + ',' + (a * 0.3).toFixed(3) + ')';
        ctx.arc(p.x, p.y, p.r * 3.4 * dpr, 0, Math.PI * 2);
        ctx.fill();
        /* bright core */
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + p.tint + ',' + a.toFixed(3) + ')';
        ctx.arc(p.x, p.y, p.r * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    var frame = function (ts) {
      if (!running) {
        rafId = null;
        return;
      }
      if (last === null) last = ts;
      var dt = Math.min((ts - last) / 1000, 0.05);
      last = ts;
      draw(dt);
      rafId = window.requestAnimationFrame(frame);
    };

    var start = function () {
      if (running || document.hidden) return;
      running = true;
      last = null;
      rafId = window.requestAnimationFrame(frame);
    };

    var stop = function () {
      running = false;
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    var last = null;
    var resizeTimer = null;

    sprites = [makeSprite(BLUE), makeSprite(CYAN), makeSprite('120, 150, 190')];
    resize();
    start();

    window.addEventListener(
      'resize',
      function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(resize, 150);
      },
      { passive: true }
    );

    doc.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    });

    /* Respect live reduced-motion changes */
    reducedMotion.addEventListener
      ? reducedMotion.addEventListener('change', function (e) {
          if (e.matches) {
            stop();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          } else {
            start();
          }
        })
      : reducedMotion.addListener(function (e) {
          if (e.matches) {
            stop();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          } else {
            start();
          }
        });
  }
})();
