const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const end = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 850;
    const started = performance.now();
    const tick = now => {
      const progress = Math.min((now - started) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${Math.round(end * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.8 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

const projectButtons = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project-card');
projectButtons.forEach(button => {
  button.addEventListener('click', () => {
    projectButtons.forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    const target = button.dataset.filter;
    projects.forEach(card => {
      const types = (card.dataset.project || '').split(/\s+/);
      const show = target === 'all' || types.includes(target);
      card.style.display = show ? '' : 'none';
    });
  });
});

const sections = [...document.querySelectorAll('main section[id]')];
const navMap = new Map([...document.querySelectorAll('.nav-link')].map(link => [link.getAttribute('href').slice(1), link]));
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navMap.forEach(link => link.classList.remove('active'));
    navMap.get(entry.target.id)?.classList.add('active');
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
sections.forEach(section => sectionObserver.observe(section));

const portraitStage = document.getElementById('portraitStage');
const heroVisual = document.getElementById('heroVisual');
if (heroVisual && portraitStage && window.matchMedia('(pointer:fine)').matches) {
  heroVisual.addEventListener('mousemove', event => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    portraitStage.style.transform = `translate(${x * 6}px, ${y * 6}px)`;
  });
  heroVisual.addEventListener('mouseleave', () => { portraitStage.style.transform = ''; });
}

document.querySelectorAll('.magnetic').forEach(button => {
  if (!window.matchMedia('(pointer:fine)').matches) return;
  button.addEventListener('mousemove', event => {
    const rect = button.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.08;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.12;
    button.style.transform = `translate(${x}px, ${y - 2}px)`;
  });
  button.addEventListener('mouseleave', () => { button.style.transform = ''; });
});

document.querySelectorAll('.disabled-link').forEach(el => el.addEventListener('click', e => e.preventDefault()));


// Core Stack pointer spotlight
const coreBar = document.querySelector('.hero-corebar');
if (coreBar && window.matchMedia('(pointer:fine)').matches) {
  coreBar.addEventListener('mousemove', event => {
    const rect = coreBar.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    coreBar.style.setProperty('--mx', `${x}%`);
    coreBar.style.setProperty('--my', `${y}%`);
  });
  coreBar.addEventListener('mouseleave', () => {
    coreBar.style.setProperty('--mx', '50%');
    coreBar.style.setProperty('--my', '50%');
  });
}

// Gentle hover lift for core stack items with keyboard accessibility
document.querySelectorAll('.stack-item').forEach(item => {
  item.setAttribute('tabindex', '0');
  item.addEventListener('focus', () => item.classList.add('is-focused'));
  item.addEventListener('blur', () => item.classList.remove('is-focused'));
});

// Interactive certification previews
const certModal = document.getElementById('certModal');
const certModalTitle = document.getElementById('certModalTitle');
const certModalIssuer = document.getElementById('certModalIssuer');
const certModalDate = document.getElementById('certModalDate');
const certModalDescription = document.getElementById('certModalDescription');
const certModalLink = document.getElementById('certModalLink');
const certModalImage = document.getElementById('certModalImage');
let lastCertTrigger = null;

function openCertModal(card){
  if (!certModal || !card) return;
  lastCertTrigger = card;
  certModalTitle.textContent = card.dataset.certTitle || 'Certification title';
  certModalIssuer.textContent = card.dataset.certIssuer || 'Issuer / Organization';
  certModalDate.textContent = card.dataset.certDate || 'Month 2026';
  certModalDescription.textContent = card.dataset.certDescription || 'Replace this placeholder with your certificate details.';
  const link = card.dataset.certLink || '#';
  const image = card.dataset.certImage || 'assets/cert-iti.jpg';
  if (certModalImage) {
    certModalImage.src = image;
    certModalImage.alt = `${card.dataset.certTitle || 'Certificate'} preview`;
  }
  certModalLink.href = link;
  certModalLink.style.display = link === '#' ? 'none' : 'inline-flex';
  certModal.classList.add('open');
  certModal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
  certModal.querySelector('.cert-modal-close')?.focus();
}
function closeCertModal(){
  if (!certModal) return;
  certModal.classList.remove('open');
  certModal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
  lastCertTrigger?.focus();
}

document.querySelectorAll('.cert-action').forEach(button => {
  button.addEventListener('click', () => openCertModal(button.closest('.cert-card')));
});
document.querySelectorAll('.cert-pro').forEach(card => {
  card.addEventListener('dblclick', () => openCertModal(card));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCertModal(card); }
  });
});
document.querySelectorAll('[data-cert-close]').forEach(el => el.addEventListener('click', closeCertModal));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCertModal(); });

// Small pointer tilt on certification cards
if (window.matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.cert-pro').forEach(card => {
    card.addEventListener('mousemove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-y*3).toFixed(2)}deg) rotateY(${(x*4).toFixed(2)}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// Premium pointer interactions for skills and project cards
if (window.matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.skill-group, .project-card').forEach(card => {
    card.addEventListener('mousemove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--mx', `${((x + .5) * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${((y + .5) * 100).toFixed(1)}%`);
    });
  });
}

// Project filter: animate cards instead of an abrupt display toggle
projectButtons?.forEach(button => {
  button.addEventListener('click', () => {
    const target = button.dataset.filter;
    projects.forEach(card => {
      const types = (card.dataset.project || '').split(/\s+/);
      const show = target === 'all' || types.includes(target);
      card.classList.toggle('project-hidden', !show);
      if (show) card.style.animation = 'none';
    });
    requestAnimationFrame(() => projects.forEach(card => {
      if (!card.classList.contains('project-hidden')) {
        card.style.animation = 'projectIn .45s ease both';
      }
    }));
  });
});


// About card spotlight + restrained tilt interaction
const aboutCard = document.getElementById('aboutCard');
if (aboutCard && window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  aboutCard.addEventListener('mousemove', event => {
    const rect = aboutCard.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * 100;
    const py = ((event.clientY - rect.top) / rect.height) * 100;
    aboutCard.style.setProperty('--about-x', `${px}%`);
    aboutCard.style.setProperty('--about-y', `${py}%`);
    const rx = (((event.clientY - rect.top) / rect.height) - .5) * -1.3;
    const ry = (((event.clientX - rect.left) / rect.width) - .5) * 1.6;
    aboutCard.style.transform = `perspective(1200px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-5px)`;
  });
  aboutCard.addEventListener('mouseleave', () => {
    aboutCard.style.transform = '';
    aboutCard.style.setProperty('--about-x', '50%');
    aboutCard.style.setProperty('--about-y', '50%');
  });
}
