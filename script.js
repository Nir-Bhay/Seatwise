// Header Scroll Effect
window.addEventListener('scroll', function () {
    const header = document.getElementById('header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile Menu Toggle
document.getElementById('hamburger').addEventListener('click', function () {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('active');
});

document.getElementById('close-menu').addEventListener('click', function () {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.remove('active');
});

// Close mobile menu when clicking outside
window.addEventListener('click', function (event) {
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburger = document.getElementById('hamburger');
    if (!mobileMenu.contains(event.target) && !hamburger.contains(event.target)) {
        mobileMenu.classList.remove('active');
    }
});

// Counter Animation
const counters = document.querySelectorAll('.counter');
const speed = 200;

const countUp = () => {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const inc = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(countUp, 1);
        } else {
            counter.innerText = target;
        }
    });
};

// Trigger counter animation when in viewport
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            countUp();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    observer.observe(statsSection);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading state to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        if (this.href && this.href.includes('#')) return;

        const originalText = this.innerHTML;
        this.innerHTML = '<span class="loading"></span> Loading...';
        this.disabled = true;

        // Reset after 2 seconds (for demo purposes)
        setTimeout(() => {
            this.innerHTML = originalText;
            this.disabled = false;
        }, 2000);
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-bg-animation');
    if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Animate elements on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .step, .testimonial-card, .pricing-card');

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const isVisible = (elementTop < window.innerHeight) && (elementBottom >= 0);

        if (isVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initial setup for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.feature-card, .step, .testimonial-card, .pricing-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
    });

    animateOnScroll();
});

window.addEventListener('scroll', animateOnScroll);

// Newsletter form handling
const newsletterForm = document.querySelector('.newsletter');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input');
        const button = newsletterForm.querySelector('.btn');

        if (input.value) {
            const originalButtonText = button.innerHTML;
            button.innerHTML = '<span class="loading"></span> Subscribing...';
            button.disabled = true;

            // Simulate API call
            setTimeout(() => {
                button.innerHTML = '✓ Subscribed!';
                button.style.background = '#10b981';
                input.value = '';

                setTimeout(() => {
                    button.innerHTML = originalButtonText;
                    button.style.background = '';
                    button.disabled = false;
                }, 3000);
            }, 1500);
        }
    });
}

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple effect styles
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Typing effect for hero title
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const originalText = heroTitle.innerHTML;
    heroTitle.innerHTML = '';
    heroTitle.style.minHeight = '4rem'; // Prevent layout shift

    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            heroTitle.innerHTML = originalText.substring(0, i + 1);
            i++;
            setTimeout(typeWriter, 50);
        }
    };

    // Start typing effect after page loads
    setTimeout(typeWriter, 500);
}

// Progress bar on scroll
const createProgressBar = () => {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%);
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
};

createProgressBar();

// Enhanced mobile menu with backdrop
const mobileMenuBackdrop = document.createElement('div');
mobileMenuBackdrop.className = 'mobile-menu-backdrop';
mobileMenuBackdrop.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
    display: none;
    opacity: 0;
    transition: opacity 0.3s ease;
`;
document.body.appendChild(mobileMenuBackdrop);

// Update mobile menu toggle to include backdrop
const originalHamburgerClick = document.getElementById('hamburger').onclick;
document.getElementById('hamburger').onclick = function () {
    const mobileMenu = document.getElementById('mobile-menu');
    const isActive = mobileMenu.classList.contains('active');

    if (!isActive) {
        mobileMenuBackdrop.style.display = 'block';
        setTimeout(() => {
            mobileMenuBackdrop.style.opacity = '1';
        }, 10);
    } else {
        mobileMenuBackdrop.style.opacity = '0';
        setTimeout(() => {
            mobileMenuBackdrop.style.display = 'none';
        }, 300);
    }

    if (originalHamburgerClick) originalHamburgerClick.call(this);
};

mobileMenuBackdrop.addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.remove('active');
    mobileMenuBackdrop.style.opacity = '0';
    setTimeout(() => {
        mobileMenuBackdrop.style.display = 'none';
    }, 300);
});

// Add smooth fade-in for images
document.querySelectorAll('img').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';

    if (img.complete) {
        img.style.opacity = '1';
    } else {
        img.addEventListener('load', function () {
            this.style.opacity = '1';
        });
    }
});

// Add hover effect to feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Initialize tooltips (if needed)
const initTooltips = () => {
    const elements = document.querySelectorAll('[data-tooltip]');
    elements.forEach(element => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = element.getAttribute('data-tooltip');
        tooltip.style.cssText = `
            position: absolute;
            background: #333;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-size: 0.875rem;
            white-space: nowrap;
            z-index: 1000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        `;

        element.addEventListener('mouseenter', (e) => {
            document.body.appendChild(tooltip);
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            tooltip.style.opacity = '1';
        });

        element.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, 300);
        });
    });
};

// Performance optimization: Debounce scroll events
const debounce = (func, wait = 20, immediate = true) => {
    let timeout;
    return function () {
        const context = this, args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// Apply debounce to scroll events
window.addEventListener('scroll', debounce(() => {
    animateOnScroll();
}, 20));

// Preload critical resources
const preloadResources = () => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = './Image/Website/Landing.svg';
    document.head.appendChild(link);
};

preloadResources();

// Log performance metrics (for development)
window.addEventListener('load', () => {
    if ('performance' in window) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    }
});