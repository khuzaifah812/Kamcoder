/**
 * portfolio/js/script.js
 * Khuzaifah Aine Mbabazi — Portfolio
 *
 * Modules:
 *  1.  Theme toggle (dark / light) + localStorage persistence
 *  2.  Navigation — scroll-aware sticky header + active section highlight
 *  3.  Mobile hamburger menu
 *  4.  Typed / rotating title effect in Hero
 *  5.  Floating particle generator in Hero background
 *  6.  Scroll-reveal animations (IntersectionObserver)
 *  7.  Smooth scroll for anchor links
 *  8.  Back-to-top button
 *  9.  Contact form validation (client-side)
 *  10. Keyboard-accessible nav close on Escape
 */

'use strict';

/* ============================================================
   UTILITIES
   ============================================================ */

/**
 * Shorthand querySelectorAll returning a real Array.
 * @param {string} selector
 * @param {Document|Element} root
 * @returns {Element[]}
 */
const $$ = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));

/**
 * Shorthand querySelector.
 * @param {string} selector
 * @param {Document|Element} root
 * @returns {Element|null}
 */
const $ = (selector, root = document) => root.querySelector(selector);

/**
 * Debounce — prevents a function firing more than once per `wait` ms.
 * @param {Function} fn
 * @param {number} wait
 * @returns {Function}
 */
function debounce(fn, wait = 100) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}


/* ============================================================
   1. THEME TOGGLE
   ============================================================ */

(function initTheme() {
  const HTML   = document.documentElement;
  const btn    = $('#theme-toggle');
  const STORAGE_KEY = 'portfolio-theme';

  // Read saved preference → fall back to OS preference → default dark
  function getInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  }

  function applyTheme(theme) {
    HTML.setAttribute('data-theme', theme);
    if (btn) {
      btn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
      btn.setAttribute('title', theme === 'dark' ? 'Light mode' : 'Dark mode');
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }

  // Apply on load (before paint to avoid flash)
  applyTheme(getInitialTheme());

  if (btn) {
    btn.addEventListener('click', () => {
      const current = HTML.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
})();


/* ============================================================
   2. NAVIGATION — sticky header + active-section highlight
   ============================================================ */

(function initNav() {
  const header   = $('#header');
  const navLinks = $$('.nav__link');

  if (!header) return;

  // --- Scrolled class (adds background/blur) ---
  function onScroll() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', debounce(onScroll, 10), { passive: true });
  onScroll(); // run once on load

  // --- Active section highlighting via IntersectionObserver ---
  const sections = $$('section[id]');
  if (!sections.length || !navLinks.length) return;

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const match = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', match);
            link.setAttribute('aria-current', match ? 'page' : 'false');
          });
        }
      });
    },
    {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
})();


/* ============================================================
   3. MOBILE HAMBURGER MENU
   ============================================================ */

(function initMobileMenu() {
  const hamburger = $('#nav-hamburger');
  const navList   = $('#nav-list');

  if (!hamburger || !navList) return;

  function openMenu() {
    navList.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  }

  function closeMenu() {
    navList.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close when a nav link is clicked
  $$('.nav__link', navList).forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      hamburger.focus(); // return focus
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (
      hamburger.getAttribute('aria-expanded') === 'true' &&
      !hamburger.contains(e.target) &&
      !navList.contains(e.target)
    ) {
      closeMenu();
    }
  });
})();


/* ============================================================
   4. TYPED / ROTATING TITLE IN HERO
   ============================================================ */

(function initTypedTitle() {
  const el = $('#typed-title');
  if (!el) return;

  const phrases = [
    'Software Engineering Student',
    'Python & Django Developer',
    'Aspiring Full-Stack Dev',
    'Backend Engineer',
    'Problem Solver',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPaused    = false;

  const TYPING_SPEED  = 65;   // ms per char while typing
  const DELETING_SPEED= 35;   // ms per char while deleting
  const PAUSE_AFTER   = 2000; // ms pause at full phrase
  const PAUSE_BEFORE  = 400;  // ms pause before next phrase

  function tick() {
    const phrase = phrases[phraseIndex];

    if (!isDeleting) {
      // Typing forward
      charIndex++;
      el.textContent = phrase.slice(0, charIndex);

      if (charIndex === phrase.length) {
        // Pause at end
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          isDeleting = true;
          tick();
        }, PAUSE_AFTER);
        return;
      }
    } else {
      // Deleting
      charIndex--;
      el.textContent = phrase.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, PAUSE_BEFORE);
        return;
      }
    }

    setTimeout(tick, isDeleting ? DELETING_SPEED : TYPING_SPEED);
  }

  // Small initial delay so page paint finishes first
  setTimeout(tick, 800);
})();


/* ============================================================
   5. HERO PARTICLES
   ============================================================ */

(function initParticles() {
  const container = $('#particles');
  if (!container) return;

  // Respect reduced-motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const COUNT = 18;

  for (let i = 0; i < COUNT; i++) {
    const particle = document.createElement('span');
    particle.className = 'particle';

    const size  = Math.random() * 4 + 2;            // 2–6 px
    const left  = Math.random() * 100;               // 0–100 %
    const top   = Math.random() * 100;               // 0–100 %
    const dur   = (Math.random() * 8 + 6).toFixed(1); // 6–14 s
    const delay = (Math.random() * 6).toFixed(1);     // 0–6 s

    particle.style.cssText = `
      width:${size}px;
      height:${size}px;
      left:${left}%;
      top:${top}%;
      --dur:${dur}s;
      --delay:${delay}s;
    `;

    container.appendChild(particle);
  }
})();


/* ============================================================
   6. SCROLL-REVEAL ANIMATIONS
   ============================================================ */

(function initScrollReveal() {
  // Respect reduced-motion: reveal everything immediately
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $$('.reveal').forEach((el) => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target); // fire once only
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  $$('.reveal').forEach((el) => observer.observe(el));
})();


/* ============================================================
   7. SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */

(function initSmoothScroll() {
  // CSS scroll-behavior handles most cases. This JS fallback
  // also accounts for the fixed nav height offset.
  const NAV_HEIGHT = 68;

  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 8;

    window.scrollTo({ top, behavior: 'smooth' });

    // Update URL without adding to history stack
    history.replaceState(null, '', href);
  });
})();


/* ============================================================
   8. BACK-TO-TOP BUTTON
   ============================================================ */

(function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;

  function toggleVisibility() {
    if (window.scrollY > 400) {
      btn.hidden = false;
    } else {
      btn.hidden = true;
    }
  }

  window.addEventListener('scroll', debounce(toggleVisibility, 50), { passive: true });
  toggleVisibility();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Shift focus to top of page for keyboard / screen reader users
    const main = $('#main-content') || document.body;
    main.setAttribute('tabindex', '-1');
    main.focus({ preventScroll: true });
    main.addEventListener('blur', () => main.removeAttribute('tabindex'), { once: true });
  });
})();


/* ============================================================
   9. CONTACT FORM VALIDATION
   ============================================================ */

(function initContactForm() {
  const form    = $('#contact-form');
  if (!form) return;

  const submitBtn   = $('#form-submit');
  const successBox  = $('#form-success');

  // ---- Validation rules ----
  const RULES = {
    'form-name': {
      errorId: 'name-error',
      validate(val) {
        if (!val.trim()) return 'Your name is required.';
        if (val.trim().length < 2) return 'Please enter at least 2 characters.';
        return '';
      },
    },
    'form-email': {
      errorId: 'email-error',
      validate(val) {
        if (!val.trim()) return 'Your email address is required.';
        // Simple RFC-ish pattern
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!pattern.test(val.trim())) return 'Please enter a valid email address.';
        return '';
      },
    },
    'form-subject': {
      errorId: 'subject-error',
      validate(val) {
        if (!val.trim()) return 'Please enter a subject.';
        if (val.trim().length < 3) return 'Subject must be at least 3 characters.';
        return '';
      },
    },
    'form-message': {
      errorId: 'message-error',
      validate(val) {
        if (!val.trim()) return 'A message is required.';
        if (val.trim().length < 10) return 'Message must be at least 10 characters.';
        return '';
      },
    },
  };

  // ---- Show / clear a single field error ----
  function setError(fieldId, message) {
    const field = $(`#${fieldId}`);
    const err   = $(`#${RULES[fieldId].errorId}`);
    if (!field || !err) return;

    if (message) {
      field.classList.add('is-invalid');
      err.textContent = message;
      field.setAttribute('aria-describedby', RULES[fieldId].errorId);
    } else {
      field.classList.remove('is-invalid');
      err.textContent = '';
      field.removeAttribute('aria-describedby');
    }
  }

  // ---- Validate a single field ----
  function validateField(fieldId) {
    const field = $(`#${fieldId}`);
    if (!field) return true;
    const rule  = RULES[fieldId];
    const error = rule.validate(field.value);
    setError(fieldId, error);
    return !error;
  }

  // ---- Live validation on blur ----
  Object.keys(RULES).forEach((id) => {
    const field = $(`#${id}`);
    if (!field) return;
    field.addEventListener('blur', () => validateField(id));
    // Clear error as soon as user starts correcting
    field.addEventListener('input', () => {
      if (field.classList.contains('is-invalid')) validateField(id);
    });
  });

  // ---- Full form validation ----
  function validateAll() {
    let valid = true;
    Object.keys(RULES).forEach((id) => {
      if (!validateField(id)) valid = false;
    });
    return valid;
  }

  // ---- Submit handler ----
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateAll()) {
      // Move focus to first invalid field for accessibility
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // --- Form is valid ---
    // NOTE: The form is not yet connected to a backend service.
    // When you integrate Formspree / EmailJS / Web3Forms, replace
    // this block with your API call.

    // Simulate a brief loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round"
           aria-hidden="true" class="spin">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      Sending…
    `;

    setTimeout(() => {
      // Show success message
      if (successBox) {
        successBox.hidden = false;
        successBox.focus();
      }
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
        Send Message
      `;
      // Hide success after 8 s
      setTimeout(() => {
        if (successBox) successBox.hidden = true;
      }, 8000);
    }, 900);
  });
})();


/* ============================================================
   10. SPINNER KEYFRAME (for submit loading state)
   ============================================================ */

(function injectSpinnerStyle() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .spin {
      animation: spin 0.8s linear infinite;
    }
  `;
  document.head.appendChild(style);
})();


/* ============================================================
   11. HERO ENTRANCE ANIMATION
       Staggered fade-in for hero elements on page load
   ============================================================ */

(function initHeroEntrance() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // The hero .reveal element is handled by scroll-reveal,
  // but since the hero is immediately visible we trigger it on load.
  const heroReveals = $$('.hero .reveal');
  heroReveals.forEach((el, i) => {
    el.style.transitionDelay = `${i * 120}ms`;
    // Use rAF to ensure layout is complete before adding class
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.add('revealed');
      });
    });
  });
})();


/* ============================================================
   12. ACCESSIBILITY — Trap focus inside mobile menu when open
   ============================================================ */

(function initFocusTrap() {
  const navList   = $('#nav-list');
  const hamburger = $('#nav-hamburger');
  if (!navList || !hamburger) return;

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (hamburger.getAttribute('aria-expanded') !== 'true') return;

    const focusable = $$('a, button, [tabindex]:not([tabindex="-1"])', navList);
    if (!focusable.length) return;

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
})();


/* ============================================================
   13. SKILL TAGS — Subtle entrance stagger on scroll
   ============================================================ */

(function initSkillTagStagger() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  $$('.skill-category').forEach((category) => {
    const tags = $$('.skill-tag', category);
    tags.forEach((tag, i) => {
      tag.style.opacity = '0';
      tag.style.transform = 'translateY(8px)';
      tag.style.transition = `opacity 0.35s ease ${i * 50}ms, transform 0.35s ease ${i * 50}ms`;
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tags.forEach((tag) => {
              tag.style.opacity = '1';
              tag.style.transform = 'translateY(0)';
            });
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(category);
  });
})();


/* ============================================================
   END OF SCRIPT
   ============================================================ */
