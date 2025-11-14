(function () {
  var prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var navToggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-nav]');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      document.body.classList.toggle('nav-open', !expanded);
    });

    nav.addEventListener('click', function (event) {
      if (
        event.target.tagName === 'A' &&
        document.body.classList.contains('nav-open')
      ) {
        document.body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener(
      'scroll',
      function () {
        if (window.scrollY > 8) {
          header.classList.add('site-header--scrolled');
        } else {
          header.classList.remove('site-header--scrolled');
        }
      },
      { passive: true }
    );
  }

  var howLink = document.querySelector('[data-scroll-to="how-it-works"]');
  if (howLink && !prefersReduced) {
    howLink.addEventListener('click', function (event) {
      var target = document.getElementById('how-it-works');
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  var form = document.querySelector('form[name="waitlist"]');
  if (form) {
    var emailInput = form.querySelector('input[name="email"]');
    var errorEl = form.querySelector('[data-error-for="email"]');

    form.addEventListener('submit', function (event) {
      if (!emailInput) return;
      if (!emailInput.value || !emailInput.validity.valid) {
        event.preventDefault();
        form.classList.add('form--has-error');
        if (errorEl) {
          errorEl.textContent = 'Please enter a valid email address.';
        }
        emailInput.focus();
      } else {
        form.classList.remove('form--has-error');
        if (errorEl) {
          errorEl.textContent = '';
        }
      }
    });
  }

  var yearEl = document.querySelector('[data-year]');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
