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
})();
