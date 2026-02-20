/* ============================================
   BlackOnVibe UK — Main JavaScript
   ============================================ */

'use strict';

/* -------- 1. EVENT COUNTDOWN (hero) -------- */
(function initEventCountdown() {
  // Target: 7 March 2026, 20:00:00 UTC
  const eventDate = new Date('2026-03-07T20:00:00Z');

  const daysEl  = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl  = document.getElementById('cd-mins');
  const secsEl  = document.getElementById('cd-secs');

  if (!daysEl) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCountdown() {
    const now  = new Date();
    const diff = eventDate - now;

    if (diff <= 0) {
      daysEl.textContent  = '00';
      hoursEl.textContent = '00';
      minsEl.textContent  = '00';
      secsEl.textContent  = '00';
      const banner = document.getElementById('event-countdown');
      if (banner) {
        banner.innerHTML = '<p class="text-primary font-black text-2xl uppercase tracking-tighter animate-pulse">Doors Are Open Tonight!</p>';
      }
      return;
    }

    const totalSecs  = Math.floor(diff / 1000);
    const days  = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins  = Math.floor((totalSecs % 3600) / 60);
    const secs  = totalSecs % 60;

    daysEl.textContent  = pad(days);
    hoursEl.textContent = pad(hours);
    minsEl.textContent  = pad(mins);
    secsEl.textContent  = pad(secs);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

/* -------- 2. URGENCY BAR MIDNIGHT COUNTDOWN -------- */
(function initUrgencyCountdown() {
  const el1 = document.getElementById('urgency-countdown');
  const el2 = document.getElementById('urgency-countdown-2');

  if (!el1) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  function getTimeToMidnightGMT() {
    const now = new Date();
    // Midnight GMT
    const midnight = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0, 0, 0
    ));
    const diff = midnight - now;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  function update() {
    const t = getTimeToMidnightGMT();
    if (el1) el1.textContent = t;
    if (el2) el2.textContent = t;
  }

  update();
  setInterval(update, 1000);
})();

/* -------- 3. MOBILE HAMBURGER MENU -------- */
(function initMobileMenu() {
  const toggle    = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!toggle || !mobileMenu) return;

  toggle.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden', isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });

  // Close when a nav link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.add('hidden');
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* -------- 4. SCROLL ANIMATIONS (Intersection Observer) -------- */
(function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* -------- 5. SMOOTH SCROLL -------- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerHeight = 80; // fixed header height in px
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* -------- 6. BACK TO TOP BUTTON -------- */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* -------- 7. FAQ ACCORDION -------- */
(function initFAQ() {
  document.querySelectorAll('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item   = trigger.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('active');

      // Close all others
      document.querySelectorAll('.faq-item.active').forEach(openItem => {
        openItem.classList.remove('active');
        openItem.querySelector('.faq-answer').classList.remove('open');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('active');
        answer.classList.add('open');
      }
    });
  });
})();

/* -------- 8. RAFFLE FORM VALIDATION & SUBMISSION -------- */
(function initForm() {
  const form      = document.getElementById('raffle-form-element');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  function showError(inputId, errId, show) {
    const input = document.getElementById(inputId);
    const err   = document.getElementById(errId);
    if (!input || !err) return;
    input.classList.toggle('field-error', show);
    err.classList.toggle('hidden', !show);
  }

  function clearErrors() {
    ['full_name', 'email', 'phone', 'city', 'social_handle'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('field-error');
    });
    document.querySelectorAll('.error-msg').forEach(e => e.classList.add('hidden'));
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateUKPhone(phone) {
    const cleaned = phone.replace(/\s/g, '');
    // UK mobile: 07xxx or +447xxx
    return /^(07\d{9}|\+447\d{9})$/.test(cleaned);
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    clearErrors();

    const name   = document.getElementById('full_name').value.trim();
    const email  = document.getElementById('email').value.trim();
    const phone  = document.getElementById('phone').value.trim();
    const city   = document.getElementById('city').value.trim();
    const social = document.getElementById('social_handle').value.trim();
    const gdpr   = document.getElementById('gdpr_consent').checked;

    let valid = true;

    if (!name || name.length < 2) {
      showError('full_name', 'err-name', true);
      valid = false;
    }
    if (!validateEmail(email)) {
      showError('email', 'err-email', true);
      valid = false;
    }
    if (!validateUKPhone(phone)) {
      showError('phone', 'err-phone', true);
      valid = false;
    }
    if (!city || city.length < 2) {
      showError('city', 'err-city', true);
      valid = false;
    }
    if (!social) {
      showError('social_handle', 'err-social', true);
      valid = false;
    }
    if (!gdpr) {
      const gdprErr = document.getElementById('err-gdpr');
      if (gdprErr) gdprErr.classList.remove('hidden');
      valid = false;
    }

    if (!valid) {
      // Scroll to first error
      const firstError = form.querySelector('.field-error');
      if (firstError) {
        const top = firstError.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      return;
    }

    // Show loading state
    if (submitBtn) {
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
    }

    // Submit via fetch (AJAX)
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
    .then(res => {
      if (res.ok) {
        window.location.href = 'thank-you.html';
      } else {
        return res.json().then(data => { throw data; });
      }
    })
    .catch(err => {
      if (submitBtn) {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Try Again — Something Went Wrong';
      }
      console.error('Form submission error:', err);
    });
  });

  // Real-time field clearing on input
  ['full_name', 'email', 'phone', 'city', 'social_handle'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        el.classList.remove('field-error');
        const errEl = document.getElementById('err-' + id.replace('full_name', 'name').replace('social_handle', 'social'));
        if (errEl) errEl.classList.add('hidden');
      });
    }
  });
})();

/* -------- 9. HEADER SCROLL BEHAVIOUR -------- */
(function initHeaderScroll() {
  const header = document.querySelector('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.style.background = 'rgba(10,10,10,0.97)';
    } else {
      header.style.background = 'rgba(10,10,10,0.9)';
    }
  }, { passive: true });
})();
