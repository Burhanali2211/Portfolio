document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle');
    const navbar = document.querySelector('.navbar');
    const stickyNavbar = navbar;
    const stickyNavbarHeight = stickyNavbar ? stickyNavbar.offsetHeight : 0;
    const navLinks = document.querySelectorAll('.nav-link');
    const navIndicator = document.querySelector('.nav-indicator');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Utility: Throttle function
    const throttle = (func, limit) => {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    };

    // Scroll to section function
    function scrollToStickySection(targetId) {
        const stickyTarget = document.querySelector(targetId);
        if (stickyTarget) {
            stickyTarget.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.error(`Target element ${targetId} not found`);
        }
    }

    // Handle initial page load with hash
    const stickyHash = window.location.hash;
    if (stickyHash) {
        setTimeout(() => scrollToStickySection(stickyHash), 100);
    }

    // Theme Toggle
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        const icon = themeToggle?.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-sun', 'fa-moon');
            icon.classList.add(theme === 'dark' ? 'fa-moon' : 'fa-sun');
        }
    }

    // Navbar functionality
    if (navbar) {
        const updateNavbar = throttle(() => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }, 100);
        window.addEventListener('scroll', updateNavbar);

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                scrollToStickySection(targetId);
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
    }

    // Hero Section
    const heroSection = document.querySelector('#home');
    const heroTitle = document.querySelector('.hero-title');
    const primaryButton = document.querySelector('.primary-button');
    const secondaryButton = document.querySelector('.secondary-button');

    function createRipple(e, button) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        Object.assign(ripple.style, {
            width: `${diameter}px`,
            height: `${diameter}px`,
            left: `${e.clientX - button.getBoundingClientRect().left - radius}px`,
            top: `${e.clientY - button.getBoundingClientRect().top - radius}px`
        });
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    [primaryButton, secondaryButton].forEach(btn => {
        if (btn) btn.addEventListener('click', (e) => createRipple(e, btn));
    });

    if (heroTitle) {
        const titleLines = heroTitle.querySelectorAll('.title-line');
        titleLines.forEach((line, index) => {
            const text = line.textContent;
            line.textContent = '';
            let charIndex = 0;
            const type = () => {
                if (charIndex < text.length) {
                    line.textContent += text[charIndex];
                    charIndex++;
                    setTimeout(type, 50);
                }
            };
            setTimeout(type, index * 1000);
        });
    }

    // About Section
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
        const aboutObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                aboutObserver.unobserve(aboutSection);
            }
        }, { threshold: 0.5 });
        aboutObserver.observe(aboutSection);
    }
});
