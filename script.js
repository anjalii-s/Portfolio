/**
 * Anjali Shibu Portfolio — Core Logic
 * Version: 2.1 (2026)
 */

(() => {
    'use strict';

    /* ── Utility ── */
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    /* ────────────────────────────────────────────────────────────
       1. CUSTOM CURSOR (Optimized with Throttling)
    ──────────────────────────────────────────────────────────── */
    const cursor = $('#cursor');
    const follower = $('#cursorFollower');

    if (cursor && follower && window.matchMedia('(hover: hover)').matches) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            // Move small cursor instantly
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        }, { passive: true });

        const animFollower = () => {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
            requestAnimationFrame(animFollower);
        };
        animFollower();

        // Use Event Delegation for Hover states (better performance than multiple listeners)
        const hoverTargets = 'a, button, input, textarea, .project-card, .icon-card';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverTargets)) {
                follower.classList.add('is-hovering');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverTargets)) {
                follower.classList.remove('is-hovering');
            }
        });
    }

    /* ────────────────────────────────────────────────────────────
       2. INTERSECTION OBSERVERS (Reveal Logic)
    ──────────────────────────────────────────────────────────── */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Handle skill bars specifically if they are part of the reveal
                if (entry.target.classList.contains('sb-fill')) {
                    entry.target.style.width = entry.target.dataset.pct + '%';
                }
                // Optional: stop observing once visible
                // revealObserver.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    $$('.reveal-up, .reveal-left, .reveal-right, .sb-fill').forEach(el => revealObserver.observe(el));

    /* ────────────────────────────────────────────────────────────
       3. NAVIGATION & THEME
    ──────────────────────────────────────────────────────────── */
    const navbar = $('#navbar');
    const themeToggle = $('#themeToggle');
    const hamburger = $('#hamburger');
    const mobileMenu = $('#mobileMenu');

    // Sticky Nav
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // Theme Logic
    const setTheme = (theme) => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('anjali-theme', theme);
    };

    themeToggle?.addEventListener('click', () => {
        const isDark = document.documentElement.dataset.theme === 'dark';
        setTheme(isDark ? 'light' : 'dark');
    });

    // Mobile Menu Toggle
    const toggleMenu = (state) => {
        const isOpen = state ?? !mobileMenu.classList.contains('open');
        hamburger.classList.toggle('open', isOpen);
        mobileMenu.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : ''; // Prevent scroll when menu open
    };

    hamburger?.addEventListener('click', () => toggleMenu());

    // Close menu on link click or click outside
    document.addEventListener('click', (e) => {
        if (e.target.closest('.mob-link') || 
           (mobileMenu.classList.contains('open') && !e.target.closest('#mobileMenu') && !e.target.closest('#hamburger'))) {
            toggleMenu(false);
        }
    });

    /* ────────────────────────────────────────────────────────────
       4. SKILL TABS (With Re-animation)
    ──────────────────────────────────────────────────────────── */
    const tabs = $$('.stab');
    const panels = $$('.skill-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;

            tabs.forEach(t => {
                t.classList.toggle('active', t === tab);
                t.setAttribute('aria-selected', t === tab);
            });

            panels.forEach(p => {
                const isActive = p.id === `tab-${targetId}`;
                p.classList.toggle('active', isActive);
                
                // Re-trigger bar animations for Tech tab
                if (isActive && targetId === 'tech') {
                    $$('.sb-fill', p).forEach(bar => {
                        bar.style.width = '0%';
                        setTimeout(() => bar.style.width = bar.dataset.pct + '%', 50);
                    });
                }
            });
        });
    });

    /* ────────────────────────────────────────────────────────────
       5. CONTACT FORM (With Modern Validation)
    ──────────────────────────────────────────────────────────── */
    const contactForm = $('#contactForm');
    const formSuccess = $('#formSuccess');

    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = btn.innerHTML;

        // Visual Feedback
        btn.disabled = true;
        btn.textContent = 'Sending...';

        try {
            // Simulate API Call (Replace with real Fetch call later)
            await new Promise(resolve => setTimeout(resolve, 1500));

            formSuccess.classList.add('visible');
            contactForm.reset();
            setTimeout(() => formSuccess.classList.remove('visible'), 5000);
        } catch (err) {
            console.error("Form error:", err);
            alert("Something went wrong. Please try again.");
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalBtnText;
        }
    });

    /* ────────────────────────────────────────────────────────────
       6. INITIALIZATION
    ──────────────────────────────────────────────────────────── */
    const init = () => {
        // 1. Set initial theme
        const savedTheme = localStorage.getItem('anjali-theme') || 'dark';
        document.documentElement.dataset.theme = savedTheme;

        // 2. Initial reveals (Hero)
        setTimeout(() => {
            $$('.hero .reveal-up').forEach(el => el.classList.add('visible'));
        }, 200);
    };

    window.addEventListener('DOMContentLoaded', init);

})();
