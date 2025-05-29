document.addEventListener('DOMContentLoaded', function() {
    // Custom cursor logic
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const interactiveElements = document.querySelectorAll('a, button, .btn, .card, .feature-card, .perk-item');
    
    if (cursor && cursorDot) {
        document.addEventListener('mousemove', function(e) {
            // Main cursor follows with a delay
            cursor.style.top = `${e.clientY}px`;
            cursor.style.left = `${e.clientX}px`;
            
            // Cursor dot follows immediately
            cursorDot.style.top = `${e.clientY}px`;
            cursorDot.style.left = `${e.clientX}px`;
        });
        
        document.addEventListener('mousedown', function() {
            cursor.classList.add('cursor-grow');
        });
        
        document.addEventListener('mouseup', function() {
            cursor.classList.remove('cursor-grow');
        });
        
        // Grow cursor when hovering over interactive elements
        interactiveElements.forEach(item => {
            item.addEventListener('mouseenter', function() {
                cursor.classList.add('cursor-grow');
            });
            
            item.addEventListener('mouseleave', function() {
                cursor.classList.remove('cursor-grow');
            });
        });
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', function() {
            cursor.style.display = 'none';
            cursorDot.style.display = 'none';
        });
        
        document.addEventListener('mouseenter', function() {
            cursor.style.display = 'block';
            cursorDot.style.display = 'block';
        });
        
        // Mobile check - disable custom cursor on touch devices
        function isTouchDevice() {
            return (('ontouchstart' in window) ||
                    (navigator.maxTouchPoints > 0) ||
                    (navigator.msMaxTouchPoints > 0));
        }
        
        if (isTouchDevice()) {
            cursor.style.display = 'none';
            cursorDot.style.display = 'none';
        }
    }

    const stripeLinks = {
        weekly: 'https://buy.stripe.com/test_fZedRu4zkbvm8usfYY',
        monthly: 'https://buy.stripe.com/test_3cs8xagi21UM5igbIJ',
        lifetime: 'https://buy.stripe.com/test_fZe7t67Lw1UM5ig28a'
    };

    const buyButtons = document.querySelectorAll('.buy-btn');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const plan = this.getAttribute('data-plan');
            this.innerHTML = `<span>Processing</span> <div class="spinner"></div>`;
            this.disabled = true;
            
            if (stripeLinks[plan]) {
                setTimeout(() => {
                    window.location.href = stripeLinks[plan];
                }, 500);
            } else {
                this.innerHTML = 'Try Again';
                this.disabled = false;
                alert('An error occurred. Please try again.');
            }
        });
    });

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const header = document.querySelector('header');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
            
            const bars = this.querySelectorAll('.bar');
            if(this.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }

    const animateItems = document.querySelectorAll('.animate-item');
    
    if (animateItems.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        animateItems.forEach(item => {
            observer.observe(item);
            const delay = item.getAttribute('data-delay') || item.style.animationDelay || '0s';
            item.style.animationPlayState = 'paused';
            item.style.animationDelay = delay;
        });
    }
    
    if (document.querySelector('.particles')) {
        createParticles();
    }
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && nav) {
            nav.classList.remove('active');
        }
    });

    // Activate nav links based on scroll position
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');
    
    function setActiveNavLink() {
        if (!sections.length || !navLinks.length) return;
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Enhanced pricing card interaction
    const pricingCards = document.querySelectorAll('.card');
    if (pricingCards.length > 0) {
        pricingCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                pricingCards.forEach(c => {
                    if (c !== card) {
                        c.style.opacity = '0.7';
                        c.style.transform = 'scale(0.98)';
                    }
                });
            });
            
            card.addEventListener('mouseleave', function() {
                pricingCards.forEach(c => {
                    c.style.opacity = '1';
                    if (c.classList.contains('premium')) {
                        c.style.transform = 'scale(1.05)';
                    } else {
                        c.style.transform = 'scale(1)';
                    }
                });
            });
        });
    }

    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (header) {
            setActiveNavLink();
            
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
});

function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
    
    const count = window.innerWidth < 768 ? 15 : 30;
    
    for (let i = 0; i < count; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    
    const size = Math.random() * 3 + 1;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    const opacity = Math.random() * 0.5 + 0.1;
    
    particle.style.cssText = `
        position: absolute;
        top: ${posY}%;
        left: ${posX}%;
        width: ${size}px;
        height: ${size}px;
        background-color: rgba(255, 0, 51, ${opacity});
        border-radius: 50%;
        box-shadow: 0 0 ${size * 3}px rgba(255, 0, 51, ${opacity});
        animation: float ${duration}s ease-in-out infinite;
        animation-delay: -${delay}s;
        pointer-events: none;
    `;
    
    container.appendChild(particle);
}

document.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    
    const heroVisual = document.querySelector('.executor-mockup');
    if (heroVisual) {
        heroVisual.style.transform = `rotateY(-5deg) rotateX(5deg) translateY(${scrollY * 0.1}px)`;
    }
    
    // Parallax effect for features section
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        const speed = 0.05 + (index * 0.01);
        const yPos = -scrollY * speed;
        card.style.transform = `translateY(${yPos}px)`;
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        e.preventDefault();
        window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
        });
        
        const nav = document.querySelector('nav');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (window.innerWidth <= 768 && nav && nav.classList.contains('active') && mobileMenuBtn) {
            mobileMenuBtn.click();
        }
    });
});

const glowElements = [
    ...document.querySelectorAll('.btn-primary'), 
    ...document.querySelectorAll('.card.premium'),
    ...document.querySelectorAll('.btn-discord')
];

if (glowElements.length > 0) {
    document.addEventListener('mousemove', function(e) {
        glowElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const distanceX = (x - centerX) / centerX;
                const distanceY = (y - centerY) / centerY;
                
                element.style.boxShadow = `
                    ${distanceX * 10}px ${distanceY * 10}px 20px rgba(255, 0, 51, 0.3),
                    0 0 15px rgba(255, 0, 51, 0.5)
                `;
            } else {
                if (element.classList.contains('btn-primary')) {
                    element.style.boxShadow = '0 7px 20px rgba(255, 0, 51, 0.3)';
                } else if (element.classList.contains('premium')) {
                    element.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)';
                } else if (element.classList.contains('btn-discord')) {
                    element.style.boxShadow = '0 0 15px var(--glow)';
                }
            }
        });
    });
} 