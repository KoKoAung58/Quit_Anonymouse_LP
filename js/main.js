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

    var submissionUrl = form.getAttribute('data-submit-endpoint') || '/';
    var redirectUrl = form.getAttribute('action') || '/thank-you.html';

    function encodeFormData(formEl) {
      var formData = new FormData(formEl);
      var params = new URLSearchParams();
      formData.forEach(function (value, key) {
        params.append(key, value);
      });
      return params.toString();
    }

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
        fetch(submissionUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: encodeFormData(form)
        })
          .then(function (response) {
            if (response && response.ok) {
              showSuccess();
            } else {
              showFailure();
              form.setAttribute('action', redirectUrl);
              form.submit();
            }
          })
          .catch(function () {
            showFailure();
            form.setAttribute('action', redirectUrl);
            form.submit();
          })
          .finally(function () {
            if (submitBtn && !submitBtn.disabled) {
              submitBtn.removeAttribute('aria-busy');
              submitBtn.textContent = 'Join the Waitlist';
            }
          });
      }
    });
  }

  var timestampForms = document.querySelectorAll('form');
  if (timestampForms.length) {
    function setTimestamp(field) {
      field.value = new Date().toISOString();
    }

    for (var i = 0; i < timestampForms.length; i += 1) {
      var timestampField = timestampForms[i].querySelector('[data-submitted-at]');
      if (!timestampField) continue;
      setTimestamp(timestampField);
      timestampForms[i].addEventListener('submit', function (event) {
        var field = event.target.querySelector('[data-submitted-at]');
        if (field) {
          setTimestamp(field);
        }
      });
    }
  }

  var yearEl = document.querySelector('[data-year]');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
