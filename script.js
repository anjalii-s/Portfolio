/* ============================================================
   script.js — Anjali Shibu Portfolio
   Handles: cursor, navbar, theme, mobile menu, scroll anims,
            skill bars, tabs, form, parallax
   ============================================================ */

'use strict';

/* ── Helpers ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ────────────────────────────────────────────────────────────
   1. CUSTOM CURSOR
──────────────────────────────────────────────────────────── */
const cursor   = $('#cursor');
const follower = $('#cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

if (window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower via rAF
  function animFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animFollower);
  }
  animFollower();

  // Scale on interactive elements
  const hoverTargets = 'a, button, input, textarea, .project-card, .icon-card, .skill-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      follower.style.transform = 'translate(-50%,-50%) scale(1.8)';
      follower.style.opacity   = '0.25';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      follower.style.transform = 'translate(-50%,-50%) scale(1)';
      follower.style.opacity   = '0.45';
    }
  });
}

/* ────────────────────────────────────────────────────────────
   2. STICKY NAVBAR
──────────────────────────────────────────────────────────── */
const navbar = $('#navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ────────────────────────────────────────────────────────────
   3. THEME TOGGLE (dark / light)
──────────────────────────────────────────────────────────── */
const themeToggle = $('#themeToggle');
const root        = document.documentElement;

// Restore saved preference
const savedTheme = localStorage.getItem('anjali-theme') || 'dark';
root.dataset.theme = savedTheme;

themeToggle.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('anjali-theme', next);
});

/* ────────────────────────────────────────────────────────────
   4. MOBILE MENU
──────────────────────────────────────────────────────────── */
const hamburger  = $('#hamburger');
const mobileMenu = $('#mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close on link click
$$('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// Close on outside click
document.addEventListener('click', e => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  }
});

/* ────────────────────────────────────────────────────────────
   5. SCROLL-TRIGGERED REVEAL ANIMATIONS
──────────────────────────────────────────────────────────── */
const revealEls = $$('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ────────────────────────────────────────────────────────────
   6. SKILL BARS — animate when visible
──────────────────────────────────────────────────────────── */
const skillBars = $$('.sb-fill');

const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const pct  = fill.dataset.pct;
      fill.style.setProperty('--w', pct + '%');
      fill.classList.add('animated');
      barObserver.unobserve(fill); // run once
    }
  });
}, { threshold: 0.4 });

skillBars.forEach(bar => barObserver.observe(bar));

/* ────────────────────────────────────────────────────────────
   7. SKILL TABS
──────────────────────────────────────────────────────────── */
const tabs   = $$('.stab');
const panels = $$('.skill-panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    // Update tab active state
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Show correct panel
    panels.forEach(p => {
      p.classList.remove('active');
      if (p.id === `tab-${target}`) p.classList.add('active');
    });

    // Re-trigger reveal on newly visible items
    const newReveals = $$('.reveal-up:not(.visible)', $(`#tab-${target}`));
    newReveals.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 60);
    });

    // Re-animate bars in tech tab
    if (target === 'tech') {
      skillBars.forEach(bar => {
        bar.classList.remove('animated');
        bar.style.setProperty('--w', '0%');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const pct = bar.dataset.pct;
            bar.style.setProperty('--w', pct + '%');
            bar.classList.add('animated');
          });
        });
      });
    }
  });
});

/* ────────────────────────────────────────────────────────────
   8. PARALLAX — subtle on hero orbs
──────────────────────────────────────────────────────────── */
const orbs = $$('.orb');

document.addEventListener('mousemove', e => {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx; // -1 to 1
  const dy = (e.clientY - cy) / cy;

  orbs.forEach((orb, i) => {
    const depth = (i + 1) * 10;
    orb.style.transform = `translate(${dx * depth}px, ${dy * depth}px)`;
  });
}, { passive: true });

/* ────────────────────────────────────────────────────────────
   9. SMOOTH SCROLL (for older browsers; native also set in CSS)
──────────────────────────────────────────────────────────── */
$$('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = 68; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ────────────────────────────────────────────────────────────
   10. ACTIVE NAV LINK (highlight based on scroll position)
──────────────────────────────────────────────────────────── */
const sections = $$('section[id]');
const navLinks = $$('.nav-link');

function updateActiveLink() {
  const scrollY = window.scrollY + 100;
  let current = '';

  sections.forEach(sec => {
    if (sec.offsetTop <= scrollY) current = sec.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle(
      'active-nav',
      link.getAttribute('href') === `#${current}`
    );
  });
}

// Add active style in CSS dynamically
const activeStyle = document.createElement('style');
activeStyle.textContent = `.nav-link.active-nav { color: var(--accent); background: var(--accent-glow); }`;
document.head.appendChild(activeStyle);

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

/* ────────────────────────────────────────────────────────────
   11. CONTACT FORM (client-side only, shows success state)
──────────────────────────────────────────────────────────── */
const contactForm = $('#contactForm');
const formSuccess = $('#formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const name    = $('#cf-name').value.trim();
    const email   = $('#cf-email').value.trim();
    const message = $('#cf-msg').value.trim();

    // Simple validation
    if (!name || !email || !message) {
      shakeForm(contactForm);
      return;
    }
    if (!isValidEmail(email)) {
      $('#cf-email').style.borderColor = '#f87171';
      setTimeout(() => $('#cf-email').style.borderColor = '', 1800);
      return;
    }

    // Success state
    const btn = contactForm.querySelector('.btn-primary');
    btn.disabled = true;
    btn.innerHTML = '<span>Sending…</span>';

    // Simulate network delay
    setTimeout(() => {
      contactForm.reset();
      btn.disabled = false;
      btn.innerHTML = '<span>Send Message</span><svg viewBox="0 0 20 20" fill="none"><path d="M2 10l16-8-8 16-2-6-6-2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
      formSuccess.classList.add('visible');
      setTimeout(() => formSuccess.classList.remove('visible'), 5000);
    }, 1200);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeForm(el) {
  el.style.animation = 'none';
  requestAnimationFrame(() => {
    el.style.animation = 'shake 0.4s ease';
  });
}

// Shake keyframe injected dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-6px); }
    40%      { transform: translateX(6px); }
    60%      { transform: translateX(-4px); }
    80%      { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);

/* ────────────────────────────────────────────────────────────
   12. PROFILE PHOTO — embed base64 if photo.png not found
      (The bundled version already has the photo embedded via
       the <img src="photo.png"> tag in index.html.
       If no server, we detect the broken img and swap it.)
──────────────────────────────────────────────────────────── */
const profileImg = $('#profileImg');
if (profileImg) {
  profileImg.addEventListener('error', () => {
    // Photo file not found — apply a teal gradient placeholder
    profileImg.style.display = 'none';
    const frame = profileImg.parentElement;
    frame.style.background = 'linear-gradient(135deg, #0d1422 40%, #14c8a018)';
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
      position:absolute;inset:0;display:flex;align-items:center;
      justify-content:center;flex-direction:column;gap:0.75rem;
      color:#14c8a0;font-family:'Syne',sans-serif;
    `;
    placeholder.innerHTML = '<div style="font-size:4rem">AS</div><div style="font-size:0.8rem;letter-spacing:0.15em;opacity:0.6">ANJALI SHIBU</div>';
    frame.appendChild(placeholder);
  });
}

/* ────────────────────────────────────────────────────────────
   13. HERO BADGE COUNTER (small delight)
──────────────────────────────────────────────────────────── */
function animateCounters() {
  const stats = $$('.stat-n');
  stats.forEach(el => {
    const raw     = el.textContent.trim();
    const isFloat = raw.includes('.');
    const isPlus  = raw.includes('+');
    const isPct   = raw.includes('%');
    const target  = parseFloat(raw.replace(/[^0-9.]/g, ''));

    if (isNaN(target)) return;

    const duration = 1600;
    const start    = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value    = target * eased;
      el.textContent = (isFloat ? value.toFixed(3) : Math.round(value))
        + (isPlus ? '+' : isPct ? '%' : '');
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

// Fire once when stats come into view
const statsSection = $('.hero-stats');
if (statsSection) {
  const statsObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounters();
      statsObs.disconnect();
    }
  }, { threshold: 0.5 });
  statsObs.observe(statsSection);
}

/* ────────────────────────────────────────────────────────────
   14. PAGE LOAD — trigger hero reveals
──────────────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  // Small delay so fonts are loaded
  setTimeout(() => {
    $$('.hero .reveal-up').forEach(el => el.classList.add('visible'));
  }, 100);
});
