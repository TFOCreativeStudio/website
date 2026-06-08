/* ===========================
   TFO Creative Studio — JS
   =========================== */

/* ── 1. Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    // Close mobile menu if open
    closeMobileMenu();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


/* ── 2. Hamburger / Mobile menu ── */
const hamburger   = document.querySelector('.hamburger');
const mobileMenu  = document.querySelector('.mobile-menu');
let menuOpen = false;

function openMobileMenu() {
  menuOpen = true;
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  menuOpen = false;
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  menuOpen ? closeMobileMenu() : openMobileMenu();
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menuOpen) closeMobileMenu();
});


/* ── 3. Scroll-reveal (IntersectionObserver) ── */
const revealEls = document.querySelectorAll(
  '.reveal, .reveal-up, .reveal-left'
);

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseFloat(el.dataset.delay || 0);
      setTimeout(() => {
        el.classList.add('in-view');
      }, delay * 1000);
      revealObserver.unobserve(el);
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));


/* ── 4. Active nav highlight on scroll ── */
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks  = document.querySelectorAll('.nav a');

const navObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach(a => {
        const href = a.getAttribute('href').replace('#', '');
        a.style.opacity = href === id ? '1' : '0.55';
      });
    });
  },
  { threshold: 0.35 }
);

sections.forEach(s => navObserver.observe(s));


/* ── 5. Parallax on hero bg-tfo and outline-mark ── */
const bgTfo      = document.querySelector('.bg-tfo');
const outlineMrk = document.querySelector('.outline-mark');

let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const sy = window.scrollY;
    if (bgTfo)      bgTfo.style.transform      = `translateY(${sy * 0.18}px)`;
    if (outlineMrk) outlineMrk.style.transform = `translateY(${sy * 0.10}px)`;
    ticking = false;
  });
});


/* ── 6. Service item — number counter on hover ── */
// Light micro-interaction: pulse the service-index color on mouseenter
document.querySelectorAll('.service-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    const idx = item.querySelector('.service-index');
    if (!idx) return;
    idx.style.transition = 'color 0.3s ease';
    idx.style.color = '#d60019';
  });
  item.addEventListener('mouseleave', () => {
    const idx = item.querySelector('.service-index');
    if (!idx) return;
    idx.style.color = '';
  });
});


/* ── 7. Back-to-top visibility ── */
const backTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
  if (!backTop) return;
  backTop.style.opacity = window.scrollY > 400 ? '1' : '0.3';
});


/* ── 8. Value card — stagger re-trigger on resize ── */
// Already handled by IntersectionObserver above.
// Additional: add cursor trail effect in hero (subtle red dot)
(function heroTrail() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const dot = document.createElement('div');
  dot.style.cssText = `
    position: absolute;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: rgba(214,0,25,0.6);
    pointer-events: none;
    z-index: 5;
    transform: translate(-50%,-50%);
    transition: opacity 0.4s ease;
    opacity: 0;
  `;
  hero.appendChild(dot);

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    dot.style.left = (e.clientX - rect.left) + 'px';
    dot.style.top  = (e.clientY - rect.top)  + 'px';
    dot.style.opacity = '1';
    clearTimeout(dot._hideTimer);
    dot._hideTimer = setTimeout(() => { dot.style.opacity = '0'; }, 800);
  });
})();


/* ── 9. Number ticker animation on Values section ── */
// Animates the value-num from 00 → 01, 02, etc. when entering view
(function valueTicker() {
  const cards = document.querySelectorAll('.value-card');
  const tickerObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const numEl  = entry.target.querySelector('.value-num');
      if (!numEl || numEl.dataset.ticked) return;
      numEl.dataset.ticked = '1';
      const target = parseInt(numEl.textContent, 10);
      let current  = 0;
      const step   = () => {
        current++;
        numEl.textContent = String(current).padStart(2, '0');
        if (current < target) requestAnimationFrame(step);
      };
      setTimeout(step, 200);
      tickerObserver.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  cards.forEach(c => tickerObserver.observe(c));
})();
