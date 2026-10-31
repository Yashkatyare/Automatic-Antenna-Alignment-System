/* =========================================================================
   main.js — shared behaviour across every page of the site
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loading screen ---------- */
  const loader = document.getElementById('loader');
  if (loader){
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 500);
    });
    // fallback in case 'load' already fired
    setTimeout(() => loader.classList.add('hidden'), 2500);
  }

  /* ---------- AOS (scroll animations) ---------- */
  if (window.AOS){
    AOS.init({ duration: 700, once: true, offset: 60, easing: 'ease-out-cubic' });
  }

  /* ---------- Theme toggle (dark / light, persisted) ---------- */
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('aas-theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  const updateThemeIcon = () => {
    if (!themeBtn) return;
    const isLight = root.getAttribute('data-theme') === 'light';
    themeBtn.innerHTML = isLight ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
  };
  updateThemeIcon();

  if (themeBtn){
    themeBtn.addEventListener('click', () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      root.setAttribute('data-theme', isLight ? 'dark' : 'light');
      localStorage.setItem('aas-theme', isLight ? 'dark' : 'light');
      updateThemeIcon();
    });
  }

  /* ---------- Mobile nav burger ---------- */
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');
  if (burger && navLinks){
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      burger.innerHTML = navLinks.classList.contains('open')
        ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }));
  }

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop){
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 500);
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Stat counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length){
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const decimals = (el.dataset.count.split('.')[1] || '').length;
        const duration = 1400;
        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const val = target * eased;
          el.textContent = decimals ? val.toFixed(decimals) : Math.round(val);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = decimals ? target.toFixed(decimals) : target;
        };
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(c => obs.observe(c));
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ---------- Navbar shrink / hide-on-scroll shadow ---------- */
  const nav = document.querySelector('.navbar-custom');
  if (nav){
    window.addEventListener('scroll', () => {
      nav.style.boxShadow = window.scrollY > 30 ? '0 8px 30px rgba(0,0,0,0.35)' : 'none';
    });
  }

  /* ---------- Highlight active nav link based on current page ---------- */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });

  /* ---------- Contact form (demo submit) ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm){
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent';
      btn.style.opacity = '0.8';
      contactForm.reset();
      setTimeout(() => { btn.innerHTML = original; btn.style.opacity = '1'; }, 2800);
    });
  }

});
