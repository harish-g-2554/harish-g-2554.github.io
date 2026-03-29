/* ============================================
   MAIN JAVASCRIPT
   Author: Harish G
   Description: Main functionality and interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initTypewriter();
    initScrollAnimations();
    initSkillBars();
    initCounters();
    initTimeline();
    initContactForm();
    initParallax();
    initHeroDepth();
    init3DTilt();
    initMobileMenu();
});

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const nav = document.querySelector('.quantum-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect for navigation
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    });
    
    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = nav.offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPos = window.scrollY + 150;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.quantum-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
}

function closeMobileMenu() {
    const menuToggle = document.querySelector('.quantum-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle?.classList.remove('active');
    navLinks?.classList.remove('active');
}

// ============================================
// TYPEWRITER EFFECT (Disabled - Static Text)
// ============================================
function initTypewriter() {
    // Static text - no animation needed
    // Text is now directly in HTML: "MIS Analyst @ CRED"
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Trigger skill bars animation if skills section
                if (entry.target.closest('.skills-section')) {
                    animateSkillBars();
                }
                
                // Trigger counters if about section
                if (entry.target.closest('.about-section')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);
    
    // Add reveal class to animatable elements
    const animatableElements = document.querySelectorAll(
        '.quantum-card, .skill-category, .timeline-item, .project-card, .contact-item'
    );
    
    animatableElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// ============================================
// SKILL BARS ANIMATION
// ============================================
function initSkillBars() {
    // Skills will be animated when section comes into view
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        if (bar.style.width === '') {
            const progress = bar.getAttribute('data-progress');
            setTimeout(() => {
                bar.style.width = `${progress}%`;
            }, 200);
        }
    });
}

// ============================================
// COUNTER ANIMATION
// ============================================
function initCounters() {
    // Counters will be animated when section comes into view
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        if (counter.dataset.animated) return;
        counter.dataset.animated = 'true';
        
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// ============================================
// TIMELINE ANIMATION
// ============================================
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineProgress = document.querySelector('.timeline-progress');
    
    if (!timelineProgress) return;
    
    const updateTimeline = () => {
        const timeline = document.querySelector('.timeline-container');
        if (!timeline) return;
        
        const timelineTop = timeline.offsetTop;
        const timelineHeight = timeline.offsetHeight;
        const scrollPos = window.scrollY + window.innerHeight;
        
        if (scrollPos > timelineTop) {
            const progress = Math.min((scrollPos - timelineTop) / timelineHeight * 100, 100);
            timelineProgress.style.height = `${progress}%`;
        }
    };
    
    window.addEventListener('scroll', updateTimeline);
}

// ============================================
// CONTACT FORM
// ============================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('.quantum-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            
            // Create quantum effect on submit
            createQuantumSubmitEffect();
            
            // Disable button and show sending state
            if (submitBtn) {
                submitBtn.disabled = true;
                if (btnText) btnText.textContent = 'Sending...';
            }
            
            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success - show message and reset form
                    if (btnText) btnText.textContent = 'Message Sent!';
                    submitBtn.style.background = '#22c55e';
                    form.reset();
                    
                    setTimeout(() => {
                        if (btnText) btnText.textContent = 'Send Message';
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                    }, 3000);
                } else {
                    throw new Error('Failed to send');
                }
            } catch (error) {
                // Error - show error message
                if (btnText) btnText.textContent = 'Failed to Send';
                submitBtn.style.background = '#ef4444';
                
                setTimeout(() => {
                    if (btnText) btnText.textContent = 'Send Message';
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
            }
        });
    }
}

function createQuantumSubmitEffect() {
    const btn = document.querySelector('#contact-form .quantum-btn');
    if (!btn) return;
    
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        btn.style.transform = '';
    }, 200);
    
    // Create particles burst
    for (let i = 0; i < 20; i++) {
        createParticleBurst(btn);
    }
}

function createParticleBurst(element) {
    const particle = document.createElement('div');
    const rect = element.getBoundingClientRect();
    
    particle.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: #00f0ff;
        border-radius: 50%;
        pointer-events: none;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        z-index: 9999;
        box-shadow: 0 0 10px #00f0ff;
    `;
    
    document.body.appendChild(particle);
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 100 + 50;
    const endX = Math.cos(angle) * velocity;
    const endY = Math.sin(angle) * velocity;
    
    particle.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${endX}px, ${endY}px) scale(0)`, opacity: 0 }
    ], {
        duration: 800,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => particle.remove();
}

// ============================================
// PARALLAX EFFECT
// ============================================
function initParallax() {
    const grid = document.querySelector('.quantum-grid');
    if (!grid) return;

    window.addEventListener('scroll', () => {
        const offset = Math.min(window.scrollY * 0.06, 35);
        grid.style.backgroundPosition = `0 ${offset}px`;
    });
}

// ============================================
// HERO DEPTH EFFECT
// ============================================
function initHeroDepth() {
    const hero = document.querySelector('.hero-section');
    const profile = document.querySelector('.profile-container');
    const heroText = document.querySelector('.hero-text');

    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hero || !profile || !heroText || !isFinePointer) return;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const rotateY = (x - 0.5) * 16;
        const rotateX = (0.5 - y) * 12;

        profile.style.setProperty('--hero-rot-x', `${rotateX.toFixed(2)}deg`);
        profile.style.setProperty('--hero-rot-y', `${rotateY.toFixed(2)}deg`);
        profile.style.setProperty('--hero-shift-x', `${((x - 0.5) * 16).toFixed(2)}px`);
        profile.style.setProperty('--hero-shift-y', `${((y - 0.5) * 12).toFixed(2)}px`);

        heroText.style.setProperty('--hero-text-x', `${((0.5 - x) * 10).toFixed(2)}px`);
        heroText.style.setProperty('--hero-text-y', `${((0.5 - y) * 8).toFixed(2)}px`);
    });

    hero.addEventListener('mouseleave', () => {
        profile.style.setProperty('--hero-rot-x', '0deg');
        profile.style.setProperty('--hero-rot-y', '0deg');
        profile.style.setProperty('--hero-shift-x', '0px');
        profile.style.setProperty('--hero-shift-y', '0px');
        heroText.style.setProperty('--hero-text-x', '0px');
        heroText.style.setProperty('--hero-text-y', '0px');
    });
}

// ============================================
// 3D TILT EFFECTS
// ============================================
function init3DTilt() {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    const tiltTargets = document.querySelectorAll(
        '.project-card, .skill-item, .contact-item, .timeline-content, .stat-item, .research-paper'
    );

    tiltTargets.forEach((element) => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const rotateY = (x - 0.5) * 10;
            const rotateX = (0.5 - y) * 8;

            element.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`);
            element.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`);

            if (element.classList.contains('project-card')) {
                const imageShiftX = (x - 0.5) * 22;
                const imageShiftY = (y - 0.5) * 18;
                element.style.setProperty('--img-shift-x', `${imageShiftX.toFixed(2)}px`);
                element.style.setProperty('--img-shift-y', `${imageShiftY.toFixed(2)}px`);
            }
        });

        element.addEventListener('mouseleave', () => {
            element.style.setProperty('--tilt-x', '0deg');
            element.style.setProperty('--tilt-y', '0deg');

            if (element.classList.contains('project-card')) {
                element.style.setProperty('--img-shift-x', '0px');
                element.style.setProperty('--img-shift-y', '0px');
            }
        });
    });
}

// ============================================
// CURSOR EFFECT
// ============================================
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'quantum-cursor';
    cursor.innerHTML = `
        <div class="cursor-dot"></div>
        <div class="cursor-ring"></div>
    `;
    document.body.appendChild(cursor);
    
    const cursorDot = cursor.querySelector('.cursor-dot');
    const cursorRing = cursor.querySelector('.cursor-ring');
    
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });
    
    const animateCursor = () => {
        ringX += (mouseX - ringX) * 0.1;
        ringY += (mouseY - ringY) * 0.1;
        
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
        
        requestAnimationFrame(animateCursor);
    };
    
    animateCursor();
    
    // Add cursor styles
    const style = document.createElement('style');
    style.textContent = `
        .quantum-cursor {
            pointer-events: none;
            z-index: 10000;
        }
        .cursor-dot {
            position: fixed;
            width: 8px;
            height: 8px;
            background: #00f0ff;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 20px #00f0ff;
        }
        .cursor-ring {
            position: fixed;
            width: 40px;
            height: 40px;
            border: 2px solid rgba(0, 240, 255, 0.5);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: width 0.3s, height 0.3s, border-color 0.3s;
        }
        a:hover ~ .quantum-cursor .cursor-ring,
        button:hover ~ .quantum-cursor .cursor-ring {
            width: 60px;
            height: 60px;
            border-color: #7b2dff;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// LAZY LOADING IMAGES
// ============================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ============================================
// QUANTUM HOVER EFFECTS
// ============================================
document.addEventListener('mouseover', (e) => {
    const card = e.target.closest('.quantum-card');
    if (card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    }
});

// ============================================
// DARK MODE TOGGLE (Optional)
// ============================================
function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

// ============================================
// PRELOADER
// ============================================
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => preloader.remove(), 500);
    }
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Scroll-based updates here
            ticking = false;
        });
        ticking = true;
    }
});

// ============================================
// EASTER EGG - Konami Code
// ============================================
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.code === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateQuantumMode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateQuantumMode() {
    document.body.style.animation = 'superposition 2s ease-in-out';
    setTimeout(() => {
        document.body.style.animation = '';
        alert('🌟 Quantum Mode Activated! You found the easter egg!');
    }, 2000);
}
