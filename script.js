// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
    initNavigation();
    initScrollAnimations();
    initParticles();
    initScrollToTop();
});

// ===== COUNTDOWN TIMER =====
function initCountdown() {
    const eventDate = new Date('March 10, 2026 09:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const timeRemaining = eventDate - now;
        
        if (timeRemaining < 0) {
            document.querySelector('.countdown').innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <h2 class="gradient-text" style="font-size: 2.5rem; margin-bottom: 1rem;">Event is Live! 🎉</h2>
                    <p style="color: var(--text-secondary);">Join us at the venue!</p>
                </div>
            `;
            return;
        }
        
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        updateElement('days', days);
        updateElement('hours', hours);
        updateElement('minutes', minutes);
        updateElement('seconds', seconds);
    }
    
    function updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            const newValue = value.toString().padStart(2, '0');
            if (element.textContent !== newValue) {
                element.style.transform = 'scale(1.2)';
                element.textContent = newValue;
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 200);
            }
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== NAVIGATION =====
function initNavigation() {
    const nav = document.getElementById('mainNav');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Smooth scroll with offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                
                // Stagger animation for children
                const children = entry.target.querySelectorAll('[data-aos]');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('aos-animate');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-aos
    document.querySelectorAll('[data-aos]').forEach(element => {
        observer.observe(element);
    });
    
    // Add entrance animations to sections
    document.querySelectorAll('.section-animated').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        sectionObserver.observe(section);
    });
}

// ===== PARTICLE CANVAS BACKGROUND =====
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
            
            // Random color from theme
            const colors = ['#FDBB3B', '#FF8A34', '#E10600', '#FFF4E0'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Wrap around edges
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create particles
    function createParticles() {
        const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 100);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Connect nearby particles
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.strokeStyle = '#FDBB3B';
                    ctx.globalAlpha = (1 - distance / 120) * 0.2;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Mouse interaction
    canvas.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        particles.forEach(particle => {
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                particle.x -= (dx / distance) * force * 2;
                particle.y -= (dy / distance) * force * 2;
            }
        });
    });
    
    createParticles();
    animate();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
}

// ===== SCROLL TO TOP BUTTON =====
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    if (!scrollTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== ENHANCED HOVER EFFECTS =====
document.addEventListener('DOMContentLoaded', () => {
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                animation: ripple 0.6s ease-out;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            from {
                transform: scale(0);
                opacity: 1;
            }
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// ===== PARALLAX EFFECT - FIXED VERSION =====
// Only apply parallax to background elements, NOT the hero content
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Parallax for hero content - REMOVED OPACITY FADE
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && scrolled < 600) {
        // Only apply subtle transform, NO opacity change
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        // REMOVED: heroContent.style.opacity = 1 - scrolled / 600;
    }
    
    // Keep countdown and buttons always visible
    const countdown = document.querySelector('.countdown');
    const heroCta = document.querySelector('.hero-cta');
    if (countdown) {
        countdown.style.opacity = '1';
        countdown.style.visibility = 'visible';
    }
    if (heroCta) {
        heroCta.style.opacity = '1';
        heroCta.style.visibility = 'visible';
    }
});

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to resize events
window.addEventListener('resize', debounce(() => {
    // Re-initialize particles on resize
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        initParticles();
    }
}, 250));

// ===== PREVENT LAYOUT SHIFT =====
// Add loading state
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Fade in sections smoothly
    document.querySelectorAll('section').forEach((section, index) => {
        setTimeout(() => {
            section.style.opacity = '1';
        }, index * 100);
    });
});

// ===== ACCESSIBILITY ENHANCEMENTS =====
// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const navLinks = document.getElementById('navLinks');
        const menuToggle = document.getElementById('menuToggle');
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Focus trap for mobile menu
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}

// Apply focus trap to mobile menu when active
const navLinks = document.getElementById('navLinks');
if (navLinks) {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active')) {
                trapFocus(navLinks);
            }
        });
    });
    
    observer.observe(navLinks, {
        attributes: true,
        attributeFilter: ['class']
    });
}

// ===== ENHANCED COUNTDOWN ANIMATION =====
function animateCountdownChange(element) {
    element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    element.style.transform = 'scale(1.15) rotateY(360deg)';
    
    setTimeout(() => {
        element.style.transform = 'scale(1) rotateY(0deg)';
    }, 300);
}

// ===== SMOOTH PAGE TRANSITIONS =====
document.querySelectorAll('a:not([target="_blank"])').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.getAttribute('href').startsWith('#')) return;
        
        e.preventDefault();
        const href = this.getAttribute('href');
        
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            window.location.href = href;
        }, 300);
    });
});

console.log('🎉 CodeWave 2026 - Website Loaded Successfully!');
console.log('Built with ❤️ for innovation and excellence');