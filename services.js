// testimonials.js
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.testimonials-container');
    const track = document.querySelector('.testimonials-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dots = document.querySelectorAll('.dot');
    const emailButtons = document.querySelectorAll('.email-btn');
    const callButtons = document.querySelectorAll('.call-btn');

    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth + 30; // Card width + gap
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    // Update active dot
    function updateDots() {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[Math.min(currentIndex, dots.length - 1)].classList.add('active');
    }

    // Scroll to position
    function scrollToPosition() {
        currentTranslate = currentIndex * -cardWidth;
        prevTranslate = currentTranslate;
        track.style.transform = `translateX(${currentTranslate}px)`;
        updateDots();
    }

    // Navigation buttons
    nextBtn.addEventListener('click', () => {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
            scrollToPosition();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            scrollToPosition();
        }
    });

    // Dots navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            scrollToPosition();
        });
    });

    // Mouse drag functionality
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        startPos = e.pageX - currentTranslate;
        container.style.cursor = 'grabbing';
        // Disable text selection during drag
        container.style.userSelect = 'none';
        document.body.style.userSelect = 'none';
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const currentPosition = e.pageX;
        currentTranslate = currentPosition - startPos;

        // Limit scrolling
        const maxTranslate = 0;
        const minTranslate = -(cards.length * cardWidth - container.offsetWidth);
        currentTranslate = Math.max(minTranslate, Math.min(maxTranslate, currentTranslate));

        track.style.transform = `translateX(${currentTranslate}px)`;
    });

    container.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.cursor = 'grab';
        // Re-enable text selection after drag
        container.style.userSelect = '';
        document.body.style.userSelect = '';

        // Snap to nearest card
        currentIndex = Math.round(-currentTranslate / cardWidth);
        currentIndex = Math.max(0, Math.min(currentIndex, cards.length - 1));
        scrollToPosition();
    });

    container.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            container.style.cursor = 'grab';
            container.style.userSelect = '';
            document.body.style.userSelect = '';
            currentIndex = Math.round(-currentTranslate / cardWidth);
            currentIndex = Math.max(0, Math.min(currentIndex, cards.length - 1));
            scrollToPosition();
        }
    });

    // Touch support for mobile
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        startPos = e.touches[0].pageX - currentTranslate;
        container.style.userSelect = 'none';
        document.body.style.userSelect = 'none';
    });

    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const currentPosition = e.touches[0].pageX;
        currentTranslate = currentPosition - startPos;

        const maxTranslate = 0;
        const minTranslate = -(cards.length * cardWidth - container.offsetWidth);
        currentTranslate = Math.max(minTranslate, Math.min(maxTranslate, currentTranslate));

        track.style.transform = `translateX(${currentTranslate}px)`;
    });

    container.addEventListener('touchend', () => {
        isDragging = false;
        container.style.userSelect = '';
        document.body.style.userSelect = '';

        currentIndex = Math.round(-currentTranslate / cardWidth);
        currentIndex = Math.max(0, Math.min(currentIndex, cards.length - 1));
        scrollToPosition();
    });

    // Set initial cursor style
    container.style.cursor = 'grab';

    // Add click handlers for contact buttons
    emailButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = 'mailto:example@email.com';
        });
    });

    callButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = 'tel:+1234567890';
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const counters = document.querySelectorAll(".stat-number");

    counters.forEach((counter) => {
        const updateCount = () => {
            const target = +counter.getAttribute("data-count"); // Get target value
            const speed = target / 50; // Adjust speed as needed
            let count = 0;

            const increment = () => {
                if (count < target) {
                    count += Math.ceil(speed);
                    counter.innerText = count;
                    requestAnimationFrame(increment);
                } else {
                    counter.innerText = target; // Ensure it reaches exact value
                }
            };

            increment();
        };

        updateCount();
    });
});
const progressBars = document.querySelectorAll(".stat-bar");

progressBars.forEach((bar) => {
    const percentage = bar.getAttribute("data-percentage");
    bar.style.width = percentage + "%"; // Expands the bar based on percentage
});
