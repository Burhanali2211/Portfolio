// Dependencies: Assumes GSAP and Locomotive Scroll (or similar) are included
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>

(() => {
    // DOM Elements - Cache all DOM elements at once
    const DOM = {
        body: document.body,
        themeToggle: document.querySelector('.theme-toggle'),
        navbar: document.querySelector('.navbar'),
        navLinks: document.querySelectorAll('.nav-link'),
        navIndicator: document.querySelector('.nav-indicator'),
        hamburger: document.querySelector('.hamburger'),
        navMenu: document.querySelector('.nav-menu'),
        customCursor: document.querySelector('.custom-cursor'),
        heroSection: document.querySelector('#home'),
        heroParticles: document.querySelector('.hero-particles'),
        heroProfile: document.querySelector('.hero-profile'),
        heroTitle: document.querySelector('.hero-title'),
        primaryButton: document.querySelector('.primary-button'),
        secondaryButton: document.querySelector('.secondary-button'),
        floaters: document.querySelectorAll('.floater'),
        orbitParticles: document.querySelectorAll('.orbit-particle'),
    };

    // Utility Functions - Optimized for performance
    const throttle = (func, limit) => {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    };

    const debounce = (func, wait) => {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    };

    // Scroll Functionality - Updated to work with Locomotive Scroll
    const scrollToSection = (targetId) => {
        const target = document.querySelector(targetId);
        if (!target) return;
        
        // Check if Locomotive Scroll is available
        const scrollInstance = window.locomotiveScroll || null;
        
        if (scrollInstance) {
            // Use Locomotive Scroll's scrollTo method
            scrollInstance.scrollTo(target, {
                offset: -80,
                duration: 1000,
                easing: [0.25, 0.0, 0.35, 1.0]
            });
        } else {
            // Fallback to native scroll
            const offset = DOM.navbar ? -DOM.navbar.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY + offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth',
            });
        }
    };

    // Theme Management - Simplified and optimized
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        DOM.body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);

        if (DOM.themeToggle) {
            DOM.themeToggle.addEventListener('click', () => {
                const currentTheme = DOM.body.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                DOM.body.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateThemeIcon(newTheme);
            });
        }
    };

    const updateThemeIcon = (theme) => {
        const icon = DOM.themeToggle?.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    };

    // Navbar Functionality - Optimized for performance
    const initNavbar = () => {
        if (!DOM.navbar) return;

        // Throttled scroll handler
        const updateNavbar = throttle(() => {
            DOM.navbar.classList.toggle('scrolled', window.scrollY > 50);
        }, 100);

        // Update indicator position
        const updateIndicator = (link) => {
            if (!DOM.navIndicator) return;
            
            const rect = link.getBoundingClientRect();
            const navRect = DOM.navbar.getBoundingClientRect();
            
            DOM.navIndicator.style.width = `${rect.width}px`;
            DOM.navIndicator.style.left = `${rect.left - navRect.left + 12}px`;
        };

    // Toggle mobile menu - fixed to ensure proper display/hide functionality
    const toggleMenu = () => {
        if (!DOM.hamburger || !DOM.navMenu) return;
        
        DOM.hamburger.classList.toggle('active');
        DOM.navMenu.classList.toggle('active');
        
        // Properly set aria-expanded attribute
        const isExpanded = DOM.navMenu.classList.contains('active');
        DOM.hamburger.setAttribute('aria-expanded', isExpanded.toString());
        
        // Ensure proper display style is applied
        DOM.navMenu.style.display = isExpanded ? 'flex' : '';
    };

        // Event listeners
        window.addEventListener('scroll', updateNavbar, { passive: true });
        
        DOM.navLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                
                // Store current scroll position to enable back scrolling
                sessionStorage.setItem('lastScrollPos', window.scrollY);
                
                // Scroll to target section
                scrollToSection(targetId);
                
                // Update active states
                DOM.navLinks.forEach((l) => l.classList.remove('active'));
                link.classList.add('active');
                
                updateIndicator(link);
                
                // Close mobile menu if open
                if (DOM.navMenu?.classList.contains('active')) {
                    toggleMenu();
                }
                
                // Update URL hash without jumping
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    location.hash = targetId;
                }
            });
            
            // Add better touch handling for mobile
            link.addEventListener('touchstart', () => {
                updateIndicator(link);
            }, { passive: true });
            
            // Use mouseover instead of mouseenter for better performance
            link.addEventListener('mouseover', () => updateIndicator(link));
        });

        if (DOM.hamburger) {
            DOM.hamburger.addEventListener('click', toggleMenu);
        }

        // Set initial active link based on current section
        const setInitialActiveLink = () => {
            // Get current hash or default to #home
            const currentHash = window.location.hash || '#home';
            
            // Find link that matches current hash
            const activeLink = document.querySelector(`.nav-link[href="${currentHash}"]`) || DOM.navLinks[0];
            
            if (activeLink) {
                DOM.navLinks.forEach(link => link.classList.remove('active'));
                activeLink.classList.add('active');
                updateIndicator(activeLink);
            }
        };
        
        setInitialActiveLink();
        
        // Update active link on scroll
        window.addEventListener('scroll', throttle(() => {
            const scrollPosition = window.scrollY;
            
            // Find which section is currently visible
            const sections = document.querySelectorAll('section[id]');
            let currentSection = null;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = section;
                }
            });
            
            if (currentSection) {
                const sectionId = `#${currentSection.id}`;
                const correspondingLink = document.querySelector(`.nav-link[href="${sectionId}"]`);
                
                if (correspondingLink && !correspondingLink.classList.contains('active')) {
                    DOM.navLinks.forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                    updateIndicator(correspondingLink);
                }
            }
        }, 100), { passive: true });

        // Initial animations with improved performance
        if (window.gsap) {
            gsap.from('.nav-logo', { opacity: 0, y: -20, duration: 0.8, ease: 'power2.out' });
            gsap.from('.nav-item', { 
                opacity: 0, 
                y: 10, 
                stagger: 0.1, 
                duration: 0.5, 
                ease: 'power2.out',
                onComplete: () => {
                    // Ensure nav-items are visible even if animation fails
                    document.querySelectorAll('.nav-item').forEach(item => {
                        item.style.opacity = '1';
                    });
                }
            });
        }
    };

    // Custom Cursor - Optimized
    const initCustomCursor = () => {
        if (!DOM.customCursor) return;
        
        // Use requestAnimationFrame for smoother cursor movement
        let cursorX = 0;
        let cursorY = 0;
        let raf;

        const updateCursor = () => {
            DOM.customCursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            raf = requestAnimationFrame(updateCursor);
        };

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            if (!raf) {
                raf = requestAnimationFrame(updateCursor);
            }
        }, { passive: true });
        // Optimize hover effects
        DOM.navLinks.forEach((link) => {
            link.addEventListener('mouseenter', () => {
                DOM.customCursor.classList.add('hover');
            });
            link.addEventListener('mouseleave', () => {
                DOM.customCursor.classList.remove('hover');
            });
        });
    };

    // Hero Section - Optimized and fixed
    const initHero = () => {
        if (!DOM.heroSection) return;

        // Create particles only if viewport width > 768px
        if (window.innerWidth > 768 && DOM.heroParticles) {
            try {
                const fragment = document.createDocumentFragment();
                const particleCount = 8; // Reduced count for better performance
                for (let i = 0; i < particleCount; i++) {
                    const particle = document.createElement('span');
                    particle.classList.add('dynamic-particle');
                    const width = Math.random() * 4 + 2;
                    Object.assign(particle.style, {
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${width}px`,
                        height: `${width}px`, // Use same value for height
                        background: 'radial-gradient(circle, rgba(89, 38, 239, 0.3), transparent)',
                        animation: `floatRandom ${Math.random() * 4 + 4}s infinite ease-in-out ${Math.random() * 2}s`
                    });
                    fragment.appendChild(particle);
                }
                DOM.heroParticles.appendChild(fragment);
            } catch (error) {
                console.error('Error creating hero particles:', error);
            }
        }
        // Button ripple effect
        const createRipple = (e, button) => {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const diameter = Math.max(button.clientWidth, button.clientHeight);
            const radius = diameter / 2;
            
            ripple.style.width = ripple.style.height = `${diameter}px`;
            ripple.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
            ripple.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
            
            button.appendChild(ripple);
            
            // Use setTimeout instead of animation end event for better performance
            setTimeout(() => ripple.remove(), 600);
        };

        // Add event listeners to buttons
        [DOM.primaryButton, DOM.secondaryButton].forEach((btn) => {
            if (btn) {
                btn.addEventListener('click', (e) => createRipple(e, btn));
            }
        });

        // Initial animations - simplified
        gsap.from(DOM.heroProfile, {
            opacity: 0,
            scale: 0.9,
            duration: 1,
            ease: 'power2.out',
            delay: 0.2
        });
    };

    // Initialization with better Locomotive Scroll integration
    const init = () => {
        // Initialize in order of visual importance
        initTheme();
        initNavbar();
        
        // Enable back button support for section navigation
        window.addEventListener('popstate', () => {
            const hash = window.location.hash;
            if (hash && hash.length > 1) {
                scrollToSection(hash);
                
                // Update active nav link
                const activeLink = document.querySelector(`.nav-link[href="${hash}"]`);
                if (activeLink) {
                    DOM.navLinks.forEach((l) => l.classList.remove('active'));
                    activeLink.classList.add('active');
                    updateIndicator(activeLink);
                }
            }
        });
        
        // Make global locomotiveScroll instance accessible for section navigation
        setTimeout(() => {
            // Find the locomotive scroll instance if it exists
            if (window.LocomotiveScroll) {
                const scrollContainers = document.querySelectorAll('[data-scroll-container]');
                if (scrollContainers.length > 0) {
                    console.log("LocomotiveScroll container found, enabling smooth navigation");
                }
            }
            
            initHero();
            initCustomCursor();
            
            // Handle initial hash after everything is loaded
            const hash = window.location.hash;
            if (hash && hash.length > 1) {
                try {
                    // Make sure the element exists before scrolling to it
                    const targetElement = document.querySelector(hash);
                    if (targetElement) {
                        setTimeout(() => scrollToSection(hash), 500);
                    }
                } catch (error) {
                    console.error('Error handling initial hash:', error);
                }
            }
        }, 100);
        
        // Add resize handler with debounce
        window.addEventListener('resize', debounce(() => {
            // Update any responsive elements here
            if (DOM.navIndicator && DOM.navLinks) {
                const activeLink = document.querySelector('.nav-link.active');
                if (activeLink) {
                    const rect = activeLink.getBoundingClientRect();
                    const navRect = DOM.navbar.getBoundingClientRect();
                    DOM.navIndicator.style.width = `${rect.width}px`;
                    DOM.navIndicator.style.left = `${rect.left - navRect.left + 12}px`;
                }
            }
        }, 250), { passive: true });
    };

    // Run on DOM Content Loaded with error handling
    try {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    } catch (error) {
        console.error('Error initializing home.js:', error);
        // Attempt to initialize critical features even if there was an error
        if (document.querySelector('.hamburger')) {
            document.querySelector('.hamburger').addEventListener('click', function() {
                this.classList.toggle('active');
                const menu = document.querySelector('.nav-menu');
                if (menu) {
                    menu.classList.toggle('active');
                    menu.style.display = menu.classList.contains('active') ? 'flex' : '';
                }
            });
        }
    }
})();
