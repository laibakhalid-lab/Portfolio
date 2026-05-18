/* ============================================================
   main.js  —  Laiba Khalid Portfolio
   Features:
     1. Navbar scroll shadow + hide-on-scroll-down
     2. Mobile menu toggle (hamburger)
     3. Typed text effect (index.html hero subtitle)
     4. Scroll-reveal animations (IntersectionObserver)
     5. Smooth scroll for anchor links
     6. Working search (highlights + jumps to first match)
     7. Contact form feedback
     8. Active nav link highlight
   ============================================================ */

'use strict';

/* ── 1. NAVBAR SCROLL BEHAVIOUR ─────────────────────────── */
(function initNavbarScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  let lastY = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    // Add shadow when scrolled
    header.classList.toggle('scrolled', y > 10);

    // Hide on scroll-down, show on scroll-up (only after 80 px)
    if (y > 80) {
      header.classList.toggle('nav-hidden', y > lastY);
    } else {
      header.classList.remove('nav-hidden');
    }

    lastY = y;
  }, { passive: true });
})();


/* ── 2. MOBILE MENU TOGGLE ───────────────────────────────── */
(function initMobileMenu() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Create hamburger button
  const burger = document.createElement('button');
  burger.id = 'burger';
  burger.setAttribute('aria-label', 'Toggle navigation menu');
  burger.setAttribute('aria-expanded', 'false');
  burger.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `;

  // Insert burger as first child of navbar (after logo)
  navbar.insertBefore(burger, navbar.children[1]);

  // Create mobile nav overlay
  const mobileNav = document.createElement('nav');
  mobileNav.id = 'mobile-nav';
  mobileNav.setAttribute('aria-hidden', 'true');

  // Clone nav links into mobile nav
  const links = navbar.querySelectorAll('a:not(#logo)');
  links.forEach(link => {
    const clone = link.cloneNode(true);
    mobileNav.appendChild(clone);
  });

  document.body.appendChild(mobileNav);

  // Create overlay backdrop
  const backdrop = document.createElement('div');
  backdrop.id = 'nav-backdrop';
  document.body.appendChild(backdrop);

  function openMenu() {
    burger.classList.add('open');
    mobileNav.classList.add('open');
    backdrop.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    burger.classList.remove('open');
    mobileNav.classList.remove('open');
    backdrop.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    burger.classList.contains('open') ? closeMenu() : openMenu();
  });

  backdrop.addEventListener('click', closeMenu);

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
})();


/* ── 3. TYPED TEXT EFFECT ────────────────────────────────── */
(function initTyped() {
  const subtitle = document.querySelector('.hero-text .subtitle');
  if (!subtitle) return;

  const phrases = [
    'Junior WordPress & Frontend Developer',
    'HTML5 · CSS3 · JavaScript · PHP',
    'Building responsive web experiences',
    'Open to internships & freelance work',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPaused    = false;

  // Wrap content in a typed span + cursor
  subtitle.innerHTML = '<span id="typed-text"></span><span class="typed-cursor">|</span>';
  const typedEl = document.getElementById('typed-text');

  function type() {
    if (isPaused) return;

    const current = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
    } else {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
    }

    let delay = isDeleting ? 45 : 80;

    if (!isDeleting && charIndex === current.length) {
      // Pause at end of phrase
      isPaused = true;
      setTimeout(() => {
        isPaused = false;
        isDeleting = true;
        type();
      }, 2000);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
})();


/* ── 4. SCROLL-REVEAL ANIMATIONS ────────────────────────── */
(function initScrollReveal() {
  // Elements to animate
  const selectors = [
    '.skill-card',
    '.project-card',
    '.comp-card',
    '.cert-card',
    '.timeline-item',
    '.contact-item',
    '.about-grid',
    '.stat-item',
    '.section-tag',
    '.section-title',
    '.section-sub',
    '.hero-text',
    '.hero-image',
  ];

  const elements = document.querySelectorAll(selectors.join(','));

  // Add initial hidden state
  elements.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger cards in grids
    const parent = el.parentElement;
    if (parent && (
      parent.classList.contains('skills-grid') ||
      parent.classList.contains('projects-grid') ||
      parent.classList.contains('comp-grid') ||
      parent.classList.contains('cert-grid') ||
      parent.classList.contains('stats-inner')
    )) {
      const siblings = Array.from(parent.children);
      const idx = siblings.indexOf(el);
      el.style.transitionDelay = `${idx * 80}ms`;
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();


/* ── 5. SMOOTH SCROLL ────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


/* ── 6. WORKING SEARCH ───────────────────────────────────── */
(function initSearch() {
  const searchBar    = document.getElementById('search-bar');
  const searchButton = document.getElementById('search-button');
  if (!searchBar || !searchButton) return;

  // Toast notification element
  const toast = document.createElement('div');
  toast.id = 'search-toast';
  document.body.appendChild(toast);

  let highlights = [];
  let currentIdx = 0;

  function clearHighlights() {
    highlights.forEach(el => {
      const parent = el.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize();
      }
    });
    highlights = [];
    currentIdx = 0;
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  function highlightText(query) {
    clearHighlights();
    if (!query.trim()) return;

    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex   = new RegExp(`(${escaped})`, 'gi');

    // Walk all text nodes in main content (skip header/footer)
    const main = document.querySelector('body');
    const walker = document.createTreeWalker(
      main,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const tag = node.parentElement && node.parentElement.tagName;
          // Skip script, style, header, footer, search input
          if (['SCRIPT','STYLE','NOSCRIPT'].includes(tag)) return NodeFilter.FILTER_REJECT;
          if (node.parentElement.closest('header, footer, #search-bar')) return NodeFilter.FILTER_REJECT;
          if (!node.textContent.trim()) return NodeFilter.FILTER_SKIP;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) textNodes.push(node);

    textNodes.forEach(textNode => {
      if (!regex.test(textNode.textContent)) return;
      regex.lastIndex = 0;

      const frag = document.createDocumentFragment();
      let last = 0;
      let match;

      while ((match = regex.exec(textNode.textContent)) !== null) {
        // Text before match
        if (match.index > last) {
          frag.appendChild(document.createTextNode(textNode.textContent.slice(last, match.index)));
        }
        // Highlighted span
        const mark = document.createElement('mark');
        mark.className = 'search-highlight';
        mark.textContent = match[0];
        frag.appendChild(mark);
        highlights.push(mark);
        last = regex.lastIndex;
      }

      // Remaining text
      if (last < textNode.textContent.length) {
        frag.appendChild(document.createTextNode(textNode.textContent.slice(last)));
      }

      textNode.parentNode.replaceChild(frag, textNode);
    });

    if (highlights.length === 0) {
      showToast(`No results for "${query}"`);
      return;
    }

    // Jump to first match
    highlights[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    highlights[0].classList.add('search-highlight-active');
    showToast(`${highlights.length} result${highlights.length > 1 ? 's' : ''} found`);
  }

  function cycleNext() {
    if (highlights.length === 0) return;
    highlights[currentIdx].classList.remove('search-highlight-active');
    currentIdx = (currentIdx + 1) % highlights.length;
    highlights[currentIdx].classList.add('search-highlight-active');
    highlights[currentIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast(`Result ${currentIdx + 1} of ${highlights.length}`);
  }

  searchButton.addEventListener('click', () => {
    const q = searchBar.value.trim();
    if (!q) { clearHighlights(); return; }
    // If same query, cycle through results
    if (highlights.length > 0) { cycleNext(); return; }
    highlightText(q);
  });

  searchBar.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = searchBar.value.trim();
      if (!q) { clearHighlights(); return; }
      if (highlights.length > 0) { cycleNext(); return; }
      highlightText(q);
    }
    if (e.key === 'Escape') {
      clearHighlights();
      searchBar.value = '';
    }
  });

  // Clear highlights when query changes
  searchBar.addEventListener('input', () => {
    if (highlights.length > 0) clearHighlights();
  });
})();


/* ── 7. CONTACT FORM FEEDBACK ────────────────────────────── */
(function initContactForm() {
  const form = document.querySelector('.contact-form form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = form.querySelector('#name')?.value.trim();
    const email   = form.querySelector('#email')?.value.trim();
    const message = form.querySelector('#message')?.value.trim();

    if (!name || !email || !message) {
      showFormMsg('Please fill in all required fields.', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFormMsg('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate send (no backend)
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      showFormMsg('Message sent! I\'ll get back to you soon. 🎉', 'success');
      form.reset();
      btn.textContent = 'Send Message 🚀';
      btn.disabled = false;
    }, 1200);
  });

  function showFormMsg(text, type) {
    let msg = form.querySelector('.form-msg');
    if (!msg) {
      msg = document.createElement('p');
      msg.className = 'form-msg';
      form.appendChild(msg);
    }
    msg.textContent = text;
    msg.className = `form-msg form-msg--${type}`;
  }
})();


/* ── 8. ACTIVE NAV LINK ──────────────────────────────────── */
(function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#navbar a:not(#logo), #mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();
