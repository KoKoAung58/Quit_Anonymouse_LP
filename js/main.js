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
    var successEl = form.querySelector('[data-form-success]');
    var failureEl = form.querySelector('[data-form-error]');
    var submitBtn = form.querySelector('button[type="submit"]');
    var iframe = document.querySelector('iframe[name="form-target"]');
    var pendingSubmit = false;

    function showSuccess() {
      form.classList.add('form--success');
      form.classList.remove('form--error');
      if (successEl) {
        successEl.hidden = false;
      }
      if (failureEl) {
        failureEl.hidden = true;
      }
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Added to waitlist';
      }
      form.reset();
    }

    function showFailure() {
      form.classList.add('form--error');
      form.classList.remove('form--success');
      if (failureEl) {
        failureEl.hidden = false;
      }
      if (successEl) {
        successEl.hidden = true;
      }
      if (submitBtn) {
        submitBtn.removeAttribute('disabled');
        submitBtn.textContent = 'Try again';
      }
    }

    function handleComplete(isOk) {
      pendingSubmit = false;
      if (submitBtn) {
        submitBtn.removeAttribute('aria-busy');
        submitBtn.textContent = 'Join the Waitlist';
      }
      if (isOk) {
        showSuccess();
      } else {
        showFailure();
      }
    }

    if (iframe) {
      iframe.addEventListener('load', function () {
        if (!pendingSubmit) return;
        var doc = iframe.contentDocument;
        var isOk = true;
        if (doc) {
          var text = doc.body ? doc.body.textContent || '' : '';
          if (/404|not found/i.test(text)) {
            isOk = false;
          }
        }
        handleComplete(isOk);
      });
    }

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

        if (!window.fetch) return;
        event.preventDefault();
        if (submitBtn) {
          submitBtn.setAttribute('aria-busy', 'true');
          submitBtn.textContent = 'Sending...';
        }
        pendingSubmit = true;
        form.submit();
        // If the iframe never loads (unlikely), fail safe after 6 seconds.
        setTimeout(function () {
          if (pendingSubmit) {
            handleComplete(false);
          }
        }, 6000);
      }
    });
  }

  var yearEl = document.querySelector('[data-year]');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
