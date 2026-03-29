// ══════════════════════════════════════════════════════════════
//  GALLERY MODULES — edit this array to manage all work samples
//
//  Each object = one card. `images` = all screenshots for that
//  module. First image is the card cover. Next/Prev in the
//  lightbox cycles only within that module's images array.
//
//  ★ REPLACE: fill in your actual file paths, e.g.:
//    images: ['images/scrm-1.png', 'images/scrm-2.png']
// ══════════════════════════════════════════════════════════════
const galleryModules = [
  {
    module: 'Supply Chain Risk Management',
    tag: 'SCRM Module',
    desc: 'Dashboard for tracking and assessing third-party vendor risks across the enterprise supply chain.',
    images: ['./SCRM/Dashboard.png', './SCRM/Onboarding.png']
  },
  {
    module: 'Charters, Policies & Procedures',
    tag: 'CPP Module',
    desc: 'Policy management system for creating, versioning, and distributing organizational security policies.',
    images: ['./CPP/Dashboard.png', './CPP/Templates.png', './CPP/Repositories.png']
  },
  {
    module: 'Cyber Training Culture & Awareness',
    tag: 'CTCA Module',
    desc: 'Training management interface for scheduling, tracking, and reporting on employee security awareness programs.',
    images: ['./CTCA/Dashboard.png', './CTCA/Simulations.png', './CTCA/Course.png', './CTCA/Assessment.png', './CTCA/Reports.png']
  },
  {
    module: 'Information Security Steering Committee',
    tag: 'ISSC Module',
    desc: 'Governance dashboard for managing committee meetings, action items, and security decision tracking.',
    images: ['./ISSC/Dashboard.png', './ISSC/Meetings.png', './ISSC/Committee-Members.png', './ISSC/Repositories.png']
  },
  {
    module: 'Information Security Pressure Analysis',
    tag: 'ISPA Module',
    desc: "Provides insights into the organization's security posture by analyzing key metrics, identifying vulnerabilities, and monitoring threat pressure.",
    images: ['./ISPA/Dashboard.png', './ISPA/Assessment.png', './ISPA/Assessment-Questionnaire.png']
  },
  {
    module: 'Cyber Incident Management',
    tag: 'CIM Module',
    desc: 'End-to-end incident lifecycle management — from detection and triage to resolution and post-incident review.',
    images: ['./CIM/Dashboard.png', './CIM/Alerts.png', './CIM/Cases.png']
  }
];

// Placeholder SVG shown when an image src is empty or missing
const PLACEHOLDER_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500'%3E%3Crect width='800' height='500' fill='%230d1117'/%3E%3Crect x='330' y='195' width='140' height='110' rx='10' fill='none' stroke='%235a6478' stroke-width='1.5' stroke-dasharray='6 4'/%3E%3Ccircle cx='365' cy='222' r='10' fill='none' stroke='%235a6478' stroke-width='1.5'/%3E%3Cpath d='M330 280 l35-35 24 24 20-20 41 31' fill='none' stroke='%235a6478' stroke-width='1.5'/%3E%3Ctext x='400' y='345' text-anchor='middle' font-family='monospace' font-size='13' fill='%235a6478'%3EAdd screenshot path in galleryModules%3C/text%3E%3C/svg%3E";

function resolvedSrc(src) {
  return (src && src.trim()) ? src : PLACEHOLDER_SVG;
}

// Build gallery cards dynamically from galleryModules
function buildGalleryCards() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  galleryModules.forEach((mod, modIndex) => {
    const coverSrc = resolvedSrc(mod.images[0]);
    const count = mod.images.filter(s => s && s.trim()).length || mod.images.length;
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.onclick = () => openLightbox(modIndex, 0);
    card.innerHTML = `
    <div class="gallery-img-wrap">
      <img src="${coverSrc}" alt="${mod.module}" onerror="this.src='${PLACEHOLDER_SVG}'" />
      <div class="gallery-overlay">
        <div style="margin-right:auto;">
          ${mod.images.length > 1 ? `<span style="font-family:var(--mono);font-size:0.68rem;color:rgba(255,255,255,0.75);background:rgba(0,0,0,0.55);padding:0.2rem 0.6rem;border-radius:4px;">${mod.images.length} screenshots</span>` : ''}
        </div>
        <div class="gallery-zoom-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
        </div>
      </div>
    </div>
    <div class="gallery-info">
      <div class="gallery-module">${mod.module}</div>
      <div class="gallery-desc">${mod.desc}</div>
      <span class="gallery-tag">${mod.tag}</span>
    </div>`;
    grid.appendChild(card);
  });
}

buildGalleryCards();

// Lightbox state — module index + image index within that module
let lbModuleIndex = 0;
let lbImageIndex = 0;

function openLightbox(modIndex, imgIndex) {
  lbModuleIndex = modIndex;
  lbImageIndex = imgIndex || 0;
  renderLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function closeLightboxOnBg(e) {
  if (e.target.id === 'lightbox') closeLightbox();
}

// Navigate within the CURRENT module's images only
function shiftLightbox(dir) {
  const total = galleryModules[lbModuleIndex].images.length;
  lbImageIndex = (lbImageIndex + dir + total) % total;
  renderLightbox();
}

function renderLightbox() {
  const mod = galleryModules[lbModuleIndex];
  const total = mod.images.length;

  document.getElementById('lightbox-img').src = resolvedSrc(mod.images[lbImageIndex]);
  document.getElementById('lightbox-img').alt = mod.module;
  document.getElementById('lb-module').textContent = mod.module;
  document.getElementById('lb-desc').textContent = mod.desc;
  document.getElementById('lb-counter').textContent = total > 1 ? `${lbImageIndex + 1} / ${total}` : '';

  // Nav arrows: only visible when module has more than 1 image
  document.getElementById('lb-prev').style.display = total > 1 ? 'flex' : 'none';
  document.getElementById('lb-next').style.display = total > 1 ? 'flex' : 'none';

  // Dot indicators
  const dotsEl = document.getElementById('lb-dots');
  dotsEl.innerHTML = '';
  if (total > 1) {
    mod.images.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.style.cssText = `width:7px;height:7px;border-radius:50%;cursor:pointer;display:inline-block;transition:all 0.2s;background:${i === lbImageIndex ? 'var(--accent)' : 'rgba(255,255,255,0.2)'};transform:${i === lbImageIndex ? 'scale(1.35)' : 'scale(1)'};`;
      dot.onclick = (e) => { e.stopPropagation(); lbImageIndex = i; renderLightbox(); };
      dotsEl.appendChild(dot);
    });
  }
}

// Keyboard: Escape to close, arrows to navigate within module
document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') shiftLightbox(-1);
  if (e.key === 'ArrowRight') shiftLightbox(1);
});

// Accordion for experience
function toggleExp(el) {
  const items = document.querySelectorAll('.exp-item');
  items.forEach(item => {
    if (item !== el) item.classList.remove('active');
  });
  el.classList.toggle('active');
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('in-view');
      }, 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

// Animate bar fills on scroll
const bars = document.querySelectorAll('.bar-fill');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target.dataset.width;
      entry.target.style.width = target;
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
bars.forEach(b => barObserver.observe(b));

// Active nav link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--accent)'
      : '';
  });
});
