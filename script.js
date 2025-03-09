document.addEventListener("DOMContentLoaded", () => {
    // Initialize Locomotive Scroll with proper error handling
    initializeLocomotiveScroll();

    // About Section
    initializeAboutSection();

    // Services Section
    initializeServicesSection();

    // Skills Section
    initializeSkillsSection();

    // Projects Section
    initializeProjectsSection();

    // Contact Section
    initializeContactSection();

    // Footer Section
    initializeFooterSection();

    // Testimonial Section
    initializeTestimonialSection();

    // Dynamic Styles
    addDynamicStyles();

    // Initial Setup
    initialSetup();
});

function initializeLocomotiveScroll() {
    let stickyScroll;
    try {
        const scrollContainer = document.querySelector('.scroll-wrapper');
        if (scrollContainer && window.LocomotiveScroll) {
            stickyScroll = new LocomotiveScroll({
                el: scrollContainer,
                smooth: true,
                multiplier: 1,
                lerp: 0.05,
                getDirection: true,
                reloadOnContextChange: true,
                resetNativeScroll: true, // Important for "back to top" functionality
                smartphone: { smooth: true, multiplier: 0.8 },
                tablet: { smooth: true, multiplier: 0.9 }
            });

            // Store instance globally for navigation access from home.js
            window.locomotiveScroll = stickyScroll;

            // Add event for handling scroll completion
            stickyScroll.on('scroll', (instance) => {
                // Update active section in navbar
                updateActiveSection(instance.scroll.y);
            });

            window.addEventListener('load', () => {
                setTimeout(() => {
                    stickyScroll.update();
                    
                    // Handle hash links on page load
                    const hash = window.location.hash;
                    if (hash && hash.length > 1) {
                        const targetElement = document.querySelector(hash);
                        if (targetElement) {
                            stickyScroll.scrollTo(targetElement, {
                                offset: -80,
                                duration: 1000,
                                easing: [0.25, 0.0, 0.35, 1.0]
                            });
                        }
                    }
                }, 500);
            });

            // Handle browser history navigation properly
            window.addEventListener('popstate', () => {
                const hash = window.location.hash;
                if (hash && hash.length > 1) {
                    const targetElement = document.querySelector(hash);
                    if (targetElement) {
                        stickyScroll.scrollTo(targetElement, {
                            offset: -80,
                            duration: 1000,
                            easing: [0.25, 0.0, 0.35, 1.0]
                        });
                    }
                }
            });

            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    stickyScroll.update();
                    
                    // Reinitialize testimonial layout on resize
                    initTestimonialCards();
                }, 300);
            });

            if (window.ScrollTrigger) {
                ScrollTrigger.scrollerProxy(scrollContainer, {
                    scrollTop(value) {
                        return arguments.length ? stickyScroll.scrollTo(value, 0, 0) : stickyScroll.scroll.instance.scroll.y;
                    },
                    getBoundingClientRect() {
                        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
                    },
                    pinType: scrollContainer.style.transform ? "transform" : "fixed"
                });

                stickyScroll.on("scroll", ScrollTrigger.update);
                ScrollTrigger.addEventListener("refresh", () => stickyScroll.update());
                ScrollTrigger.refresh();
            }

            // Ensure scroll functionality across all touch devices
            if ('ontouchstart' in window) {
                document.documentElement.classList.add('touch-device');
                scrollContainer.addEventListener('touchstart', () => {}, { passive: true });
                scrollContainer.addEventListener('touchmove', () => {}, { passive: true });
            }
        } else {
            console.warn("Locomotive Scroll initialization skipped - container or library not found");
        }
    } catch (error) {
        console.error("Error initializing Locomotive Scroll:", error);
        document.body.style.overflow = 'auto';
    }
}

function initializeAboutSection() {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
        const aboutObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                gsap.from('.about-bio', {
                    opacity: 0,
                    y: 20,
                    duration: 1,
                    ease: 'power3.out'
                });
                aboutObserver.unobserve(aboutSection);
            }
        }, { threshold: 0.5 });
        aboutObserver.observe(aboutSection);
    }
}

function initializeServicesSection() {
    const servicesSection = document.querySelector('#services');
    const servicePods = document.querySelectorAll('.service-pod');

    if (servicesSection) {
        servicePods.forEach((pod, index) => {
            pod.addEventListener('click', () => {
                const desc = pod.querySelector('.pod-desc').textContent;
                const detail = document.createElement('div');
                detail.classList.add('pod-detail');
                detail.textContent = `${desc} - Click to close`;
                pod.appendChild(detail);
                gsap.from(detail, { opacity: 0, scale: 0.5, duration: 0.5 });
                detail.addEventListener('click', () => {
                    gsap.to(detail, {
                        opacity: 0,
                        scale: 0.5,
                        duration: 0.3,
                        onComplete: () => detail.remove()
                    });
                });
            });

            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    gsap.from(pod, {
                        opacity: 0,
                        scale: 0.8,
                        duration: 1,
                        ease: 'power3.out',
                        delay: index * 0.3
                    });
                    observer.unobserve(pod);
                }
            }, { threshold: 0.2 });
            observer.observe(pod);
        });

        createServiceParticles();
    }
}

function createServiceParticles() {
    const circuitPattern = document.querySelector('.services-circuit-pattern');
    if (!circuitPattern) return;
    const particleCount = 10;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('span');
        particle.classList.add('circuit-particle');
        Object.assign(particle.style, {
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 2}px`,
            height: particle.style.width,
            background: `rgba(89, 38, 239, 0.3)`,
            animationDuration: `${Math.random() * 5 + 3}s`,
            animationDelay: `${Math.random() * 2}s`
        });
        circuitPattern.appendChild(particle);
    }
}

function initializeSkillsSection() {
    const skillCards = document.querySelectorAll('.skill-card');
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.category;

            skillCards.forEach(card => {
                const cardCategory = card.dataset.category;
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            setTimeout(animateProgressRings, 300);
        });
    });

    skillCards.forEach(card => {
        let isFlipped = false;
        card.addEventListener('click', () => {
            isFlipped = !isFlipped;
            const rotation = isFlipped ? 180 : 0;
            card.querySelector('.skill-inner').style.transform = `rotateY(${rotation}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            if (isFlipped) {
                isFlipped = false;
                card.querySelector('.skill-inner').style.transform = 'rotateY(0deg)';
            }
        });
    });
}

function animateProgressRings() {
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        const progressFill = card.querySelector('.progress-fill');
        if (progressFill) {
            const progress = parseInt(progressFill.dataset.progress || 0);
            const offset = 220 - (220 * progress) / 100;
            progressFill.style.strokeDashoffset = offset;
        }
    });
}

function initializeProjectsSection() {
    const projectsSection = document.querySelector('#projects');
    if (projectsSection) {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            const scrollerEl = stickyScroll ? '.scroll-wrapper' : null;
            if (window.gsap) {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        scroller: scrollerEl,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse'
                    },
                    opacity: 0,
                    y: 50,
                    duration: 1,
                    ease: 'power3.out',
                    delay: index * 0.2
                });
            }

            const cardInner = card.querySelector('.project-inner');
            let isFlipped = false;
            const handleFlip = (e) => {
                e.preventDefault();
                isFlipped = !isFlipped;
                const rotation = isFlipped ? 180 : 0;
                if (cardInner) {
                    cardInner.style.transform = `rotateY(${rotation}deg)`;
                    card.classList.toggle('flipped', isFlipped);
                }
            };

            card.addEventListener('click', handleFlip);
            card.addEventListener('touchend', handleFlip);

            if (window.matchMedia('(min-width: 769px)').matches) {
                card.addEventListener('mouseleave', () => {
                    if (isFlipped) {
                        isFlipped = false;
                        if (cardInner) {
                            cardInner.style.transform = 'rotateY(0deg)';
                            card.classList.remove('flipped');
                        }
                    }
                });
            }

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleFlip(e);
                }
            });
        });
    }
}

function initializeContactSection() {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
        const contactForm = document.querySelector('.contact-form');
        const contactButton = document.querySelector('.contact-button');

        gsap.from('#contact h2, #contact p', {
            scrollTrigger: {
                trigger: contactSection,
                scroller: '[data-scroll-container]',
                start: 'top 90%'
            },
            opacity: 0,
            y: 30,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.2
        });

        gsap.from('.contact-form input, .contact-form textarea, .contact-button', {
            scrollTrigger: {
                trigger: contactSection,
                scroller: '[data-scroll-container]',
                start: 'top 80%'
            },
            opacity: 0,
            y: 20,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.1
        });

        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                contactButton.textContent = 'Sending...';
                contactButton.disabled = true;

                setTimeout(() => {
                    contactForm.reset();
                    contactButton.textContent = 'Message Sent!';
                    gsap.to(contactButton, {
                        scale: 1.1,
                        duration: 0.3,
                        yoyo: true,
                        repeat: 1
                    });
                    setTimeout(() => {
                        contactButton.textContent = 'Send Message';
                        contactButton.disabled = false;
                    }, 2000);
                }, 1000);
            });
        }
    }
}

function initializeFooterSection() {
    const footer = document.querySelector('footer');
    if (footer) {
        const socialLinks = document.querySelectorAll('.social-links a');

        gsap.from('.footer-content p, .social-links', {
            scrollTrigger: {
                trigger: footer,
                scroller: '[data-scroll-container]',
                start: 'top 90%'
            },
            opacity: 0,
            y: 20,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.2
        });

        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(link, { scale: 1.2, duration: 0.3, ease: 'power2.out' });
            });
            link.addEventListener('mouseleave', () => {
                gsap.to(link, { scale: 1, duration: 0.3, ease: 'power2.out' });
            });
        });
    }
}

function initializeTestimonialSection() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let angleOffset = 0;
    let orbitAnimationId = null;

    function rotateOrbit() {
        angleOffset += 0.3;
        testimonialCards.forEach(card => {
            if (card.offsetParent !== null) {
                try {
                    const baseAngle = parseFloat(card.getAttribute('data-angle') || card.style.getPropertyValue('--angle') || 0);
                    card.style.transform = `translate(-50%, -50%) rotateY(${baseAngle + angleOffset}deg) translateZ(300px)`;
                } catch (error) {
                    console.error("Error in testimonial animation:", error);
                }
            }
        });
        orbitAnimationId = requestAnimationFrame(rotateOrbit);
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden && orbitAnimationId) {
            cancelAnimationFrame(orbitAnimationId);
            orbitAnimationId = null;
        } else if (!document.hidden && !orbitAnimationId && window.innerWidth > 480) {
            orbitAnimationId = requestAnimationFrame(rotateOrbit);
        }
    });

    testimonialCards.forEach(card => {
        let isFlipped = false;
        card.addEventListener('click', () => {
            isFlipped = !isFlipped;
            const rotation = isFlipped ? 180 : 0;
            card.querySelector('.card-inner').style.transform = `rotateY(${rotation}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            if (isFlipped) {
                isFlipped = false;
                card.querySelector('.card-inner').style.transform = 'rotateY(0deg)';
            }
        });
    });

    function initTestimonialCards() {
        const isMobile = window.innerWidth <= 480;
        const isTablet = window.innerWidth <= 768 && window.innerWidth > 480;

        if (testimonialCards.length > 0) {
            if (isMobile) {
                if (orbitAnimationId) {
                    cancelAnimationFrame(orbitAnimationId);
                    orbitAnimationId = null;
                }
                testimonialCards.forEach(card => {
                    card.style.position = 'relative';
                    card.style.left = '0';
                    card.style.top = '0';
                    card.style.transform = 'none';
                    card.style.margin = '20px auto';
                    card.classList.add('mobile-card');
                });
                const orbitCenter = document.querySelector('.orbit-center');
                if (orbitCenter) orbitCenter.style.display = 'none';
            } else if (isTablet) {
                testimonialCards.forEach((card, index) => {
                    if (!card.getAttribute('data-angle')) {
                        const originalAngle = parseFloat(card.style.getPropertyValue('--angle') || (index * 120));
                        card.setAttribute('data-angle', originalAngle);
                    }
                    card.style.position = 'relative';
                    card.style.left = `${index * 33}%`;
                    card.style.transform = 'none';
                    card.classList.add('tablet-card');
                });
            } else {
                testimonialCards.forEach((card, index) => {
                    card.classList.remove('mobile-card', 'tablet-card');
                    if (!card.getAttribute('data-angle')) {
                        const originalAngle = parseFloat(card.style.getPropertyValue('--angle') || (index * 120));
                        card.setAttribute('data-angle', originalAngle);
                    }
                    const baseAngle = parseFloat(card.getAttribute('data-angle'));
                    card.style.transform = `translate(-50%, -50%) rotateY(${baseAngle}deg) translateZ(300px)`;
                });
                if (!orbitAnimationId) {
                    orbitAnimationId = requestAnimationFrame(rotateOrbit);
                }
            }
        }
    }

    initTestimonialCards();
    window.addEventListener('resize', debounce(initTestimonialCards, 250));
}

function addDynamicStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
        .dynamic-particle { position: absolute; border-radius: 50%; animation: particleRise linear infinite; pointer-events: none; }
        @keyframes particleRise { 0% { opacity: 0; transform: translateY(0); } 20% { opacity: 1; } 100% { opacity: 0; transform: translateY(-100vh); } }
        .ripple { position: absolute; background: rgba(255, 255, 255, 0.3); border-radius: 50%; transform: scale(0); animation: rippleEffect 0.6s linear; pointer-events: none; }
        @keyframes rippleEffect { to { transform: scale(4); opacity: 0; } }
        .pod-detail { position: absolute; top: 100%; left: 0; width: 100%; background: var(--glass-bg); padding: 10px; border-radius: 10px; z-index: 10; }
        .circuit-particle { position: absolute; border-radius: 50%; animation: particleDrift linear infinite; pointer-events: none; }
        @keyframes particleDrift { 0% { opacity: 0; transform: translateY(0); } 20% { opacity: 1; } 100% { opacity: 0; transform: translateY(-50vh); } }
    `;
    document.head.appendChild(styles);
}

function initialSetup() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    filterButtons.forEach(btn => {
        btn.style.opacity = '1';
        btn.style.display = 'inline-block';
    });
    skillCards.forEach(card => {
        card.style.opacity = '1';
        card.style.display = 'block';
    });
    testimonialCards.forEach(card => {
        card.style.opacity = '1';
        card.style.display = 'block';
    });
    animateProgressRings();
}

function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}
