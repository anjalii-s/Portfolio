// 1. Initialize Lucide Icons
lucide.createIcons();

// 2. Mouse tracking for the background glow
const glow = document.getElementById('glow');
window.addEventListener('mousemove', (e) => {
    requestAnimationFrame(() => {
        glow.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
    });
});

// 3. Fade in header on load
window.addEventListener('load', () => {
    const header = document.getElementById('header');
    header.style.opacity = '1';
    header.style.transform = 'translateY(0)';
});

// 4. Scroll Reveal Animations for Bento Boxes
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.bento-box').forEach(box => {
    observer.observe(box);
});
