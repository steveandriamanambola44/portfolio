(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Intro : suite de tests simulée ---------- */
  const intro = document.getElementById('intro');
  const log = document.getElementById('intro-log');
  const lines = [
    { t: '$ npx qa-runner --profile steve', c: 'c-cmd', d: 350 },
    { t: '  Chargement du profil…', c: 'c-dim', d: 300 },
    { t: '  ✓ expérience.qa          5 ans', c: 'c-ok', d: 180 },
    { t: '  ✓ automatisation         Selenium · Playwright', c: 'c-ok', d: 180 },
    { t: '  ✓ tests.api              REST · Postman', c: 'c-ok', d: 180 },
    { t: '  ✓ analyse.métier         spécifications · ateliers', c: 'c-ok', d: 180 },
    { t: '', d: 120 },
    { t: '  4 passed · 0 failed', c: 'c-big', d: 450 },
    { t: '  Ouverture du portfolio…', c: 'c-dim', d: 500 }
  ];

  let finished = false;
  function endIntro() {
    if (finished) return;
    finished = true;
    intro.classList.add('done');
    document.body.classList.remove('is-loading');
    document.body.classList.add('ready');
    startTyping();
  }

  function playIntro() {
    let i = 0;
    function next() {
      if (finished) return;
      if (i >= lines.length) return setTimeout(endIntro, 200);
      const line = lines[i++];
      const span = document.createElement('span');
      if (line.c) span.className = line.c;
      span.textContent = line.t + '\n';
      const cursor = log.querySelector('.cursor');
      if (cursor) cursor.remove();
      log.appendChild(span);
      const c = document.createElement('span');
      c.className = 'cursor';
      log.appendChild(c);
      setTimeout(next, line.d);
    }
    next();
  }

  document.getElementById('intro-skip').addEventListener('click', endIntro);

  if (reduceMotion || sessionStorage.getItem('introSeen')) {
    endIntro();
  } else {
    sessionStorage.setItem('introSeen', '1');
    playIntro();
  }

  /* ---------- Texte tapé dans le hero ---------- */
  function startTyping() {
    const el = document.getElementById('typed');
    const words = ['Automatisation des tests', 'Tests API REST', 'Tests UX / UI', 'Business Analyst'];
    if (reduceMotion) { el.textContent = words[0]; return; }
    let w = 0, ch = 0, deleting = false;
    (function tick() {
      const word = words[w];
      el.textContent = word.slice(0, ch);
      if (!deleting && ch < word.length) { ch++; setTimeout(tick, 70); }
      else if (!deleting) { deleting = true; setTimeout(tick, 1800); }
      else if (ch > 0) { ch--; setTimeout(tick, 35); }
      else { deleting = false; w = (w + 1) % words.length; setTimeout(tick, 300); }
    })();
  }

  /* ---------- Navigation ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const links = document.querySelector('.nav-links');
  document.querySelector('.nav-toggle').addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  /* ---------- Onglets des exemples ---------- */
  document.querySelectorAll('.demo-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.demo-tab').forEach(t => t.classList.toggle('active', t === tab));
      document.querySelectorAll('.demo-panel').forEach(p => p.classList.toggle('active', p.id === tab.dataset.tab));
    });
  });

  /* ---------- Apparition au défilement + compteurs ---------- */
  function animateCount(el) {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const start = performance.now();
    const duration = 1400;
    (function step(now) {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('[data-count]').forEach(animateCount);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => {
    const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    if (siblings.length > 1) el.style.setProperty('--delay', (siblings.indexOf(el) % 3) * 0.12 + 's');
    observer.observe(el);
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  if (reduceMotion) return;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  /* ---------- Défilement fluide avec inertie ---------- */
  const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
  const setScroll = y => window.scrollTo({ top: y, behavior: 'instant' });
  let target = window.scrollY, current = target, wheelRaf = null, tweenRaf = null;

  function canScrollInside(el, dy) {
    for (; el && el !== document.body; el = el.parentElement) {
      const oy = getComputedStyle(el).overflowY;
      if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight) {
        if (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true;
      }
    }
    return false;
  }

  function wheelLoop() {
    current += (target - current) * 0.09;
    if (Math.abs(target - current) < 0.5) current = target;
    setScroll(current);
    wheelRaf = current !== target ? requestAnimationFrame(wheelLoop) : null;
  }

  if (finePointer) {
    window.addEventListener('wheel', e => {
      if (e.ctrlKey || document.body.classList.contains('is-loading')) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || canScrollInside(e.target, e.deltaY)) return;
      e.preventDefault();
      cancelAnimationFrame(tweenRaf);
      const delta = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      if (!wheelRaf) current = target = window.scrollY;
      target = clamp(target + delta, 0, maxScroll());
      if (!wheelRaf) wheelRaf = requestAnimationFrame(wheelLoop);
    }, { passive: false });
  }

  const easeInOutQuart = t => t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2;
  function scrollToY(y) {
    cancelAnimationFrame(wheelRaf); wheelRaf = null;
    cancelAnimationFrame(tweenRaf);
    const from = window.scrollY, dist = clamp(y, 0, maxScroll()) - from;
    const duration = clamp(Math.abs(dist) * 0.6, 600, 1400);
    const start = performance.now();
    (function step(now) {
      const p = Math.min((now - start) / duration, 1);
      setScroll(from + dist * easeInOutQuart(p));
      if (p < 1) tweenRaf = requestAnimationFrame(step);
      else current = target = window.scrollY;
    })(start);
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const dest = a.getAttribute('href') === '#' ? document.body : document.querySelector(a.getAttribute('href'));
    if (!dest) return;
    e.preventDefault();
    scrollToY(dest === document.body ? 0 : dest.getBoundingClientRect().top + window.scrollY - 80);
    history.pushState(null, '', a.getAttribute('href'));
  }));

  /* ---------- Barre de progression + parallaxe du hero ---------- */
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);
  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');
  const heroBg = document.querySelector('.hero-bg');

  function onScrollFx() {
    const y = window.scrollY;
    progress.style.transform = `scaleX(${maxScroll() > 0 ? y / maxScroll() : 0})`;
    if (y < hero.offsetHeight) {
      const r = y / hero.offsetHeight;
      heroContent.style.transform = `translateY(${y * 0.35}px)`;
      heroContent.style.opacity = 1 - r * 1.3;
      heroBg.style.transform = `translateY(${y * 0.2}px) scale(${1 + r * 0.15})`;
    }
  }
  window.addEventListener('scroll', () => requestAnimationFrame(onScrollFx), { passive: true });
  onScrollFx();

  if (!finePointer) return;

  /* ---------- Curseur personnalisé ---------- */
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);
  document.documentElement.classList.add('has-cursor');

  let mx = -100, my = -100, rx = mx, ry = my;
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
    document.documentElement.classList.remove('cursor-hidden');
  }, { passive: true });
  document.addEventListener('mouseleave', () => document.documentElement.classList.add('cursor-hidden'));
  window.addEventListener('mousedown', () => ring.classList.add('press'));
  window.addEventListener('mouseup', () => ring.classList.remove('press'));

  const interactive = 'a, button, .demo-tab, .tl-card, .skill-card';
  document.addEventListener('mouseover', e => ring.classList.toggle('hover', !!e.target.closest(interactive)));

  (function ringLoop() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(ringLoop);
  })();

  /* ---------- Halo lumineux + inclinaison de la carte ---------- */
  const card = document.querySelector('.hero-card');
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', e.clientX - r.left + 'px');
    hero.style.setProperty('--my', e.clientY - r.top + 'px');
    const c = card.getBoundingClientRect();
    const dx = (e.clientX - (c.left + c.width / 2)) / r.width;
    const dy = (e.clientY - (c.top + c.height / 2)) / r.height;
    card.style.transform = `perspective(900px) rotateY(${dx * 18}deg) rotateX(${-dy * 18}deg)`;
  });
  hero.addEventListener('mouseleave', () => { card.style.transform = ''; });

  document.querySelectorAll('.section-dark, .contact-section').forEach(sec => {
    sec.classList.add('spotlight');
    sec.addEventListener('mousemove', e => {
      const r = sec.getBoundingClientRect();
      sec.style.setProperty('--mx', e.clientX - r.left + 'px');
      sec.style.setProperty('--my', e.clientY - r.top + 'px');
    });
  });

  /* ---------- Boutons magnétiques ---------- */
  document.querySelectorAll('.btn, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.3}px ${(e.clientY - r.top - r.height / 2) * 0.4}px`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.translate = ''; });
  });
})();
