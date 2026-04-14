// ===== WAIT FOR DOM TO LOAD =====
document.addEventListener('DOMContentLoaded', function() {

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const theme = html.getAttribute('data-theme');
        const newTheme = theme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update particle colors after theme change
        if (window.particleSystem) {
            window.particleSystem.updateColors();
        }
    });
}

// ===== 3D PARTICLE BACKGROUND =====
function initParticleBackground() {
    console.log('=== PARTICLE SYSTEM INITIALIZATION ===');
    console.log('Browser:', navigator.userAgent);
    console.log('Chrome detected:', navigator.userAgent.includes('Chrome'));
    
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    
    console.log('Canvas found, setting up context...');

    // Browser detection
    const isChrome = navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Edge');
    
    // Create canvas context
    let ctx;
    try {
        ctx = canvas.getContext('2d');
        console.log('Canvas context created successfully');
    } catch (error) {
        console.error('Canvas context error:', error);
        return;
    }
    
    if (!ctx) {
        console.error('Could not create canvas context');
        return;
    }

    // Canvas setup
    function resizeCanvas() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        
        console.log('Canvas resized to:', width, 'x', height);
    }
    resizeCanvas();

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > window.innerWidth || this.x < 0) this.speedX *= -1;
            if (this.y > window.innerHeight || this.y < 0) this.speedY *= -1;
        }

        draw() {
            const theme = document.documentElement.getAttribute('data-theme');
            ctx.fillStyle = theme === 'dark' 
                ? 'rgba(100, 255, 218, 0.6)'
                : 'rgba(59, 130, 246, 0.4)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create particles
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation loop
    let animationId;
    let frameCount = 0;
    
    function animate() {
        try {
            frameCount++;
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // Draw connections
            const theme = document.documentElement.getAttribute('data-theme');
            let connectionCount = 0;
            
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        connectionCount++;
                        ctx.strokeStyle = theme === 'dark' 
                            ? 'rgba(100, 255, 218, 0.2)'
                            : 'rgba(59, 130, 246, 0.15)';
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            
            animationId = requestAnimationFrame(animate);
        } catch (error) {
            console.error('Animation error:', error);
            // Restart animation if error occurs
            setTimeout(() => {
                if (animationId) cancelAnimationFrame(animationId);
                animate();
            }, 100);
        }
    }

    // Start animation
    setTimeout(() => {
        console.log('Starting animation with', particles.length, 'particles');
        animate();
    }, 100);

    // Handle resize
    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    // Make particles accessible globally for theme updates
    window.particleSystem = {
        updateColors: () => {
            // Colors are handled in the draw method
        },
        destroy: () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        }
    };
}

// Initialize particle background with debugging
setTimeout(() => {
    console.log('=== STARTING PARTICLE BACKGROUND INITIALIZATION ===');
    console.log('DOM loaded:', document.readyState);
    console.log('Canvas element:', document.getElementById('particleCanvas'));
    console.log('Theme toggle element:', document.getElementById('themeToggle'));
    
    initParticleBackground();
    
    // Test canvas visibility
    setTimeout(() => {
        const canvas = document.getElementById('particleCanvas');
        if (canvas) {
            console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
            console.log('Canvas style:', window.getComputedStyle(canvas));
            console.log('Canvas visible:', canvas.offsetParent !== null);
            
            // Test drawing
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = 'red';
                ctx.fillRect(10, 10, 100, 100);
                console.log('Test rectangle drawn - canvas should show red square');
            }
        }
    }, 1000);
}, 100);

// ===== NAVIGATION =====
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinksContainer = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

if (mobileMenuToggle && navLinksContainer) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// ===== TYPING EFFECT =====
const typingText = document.querySelector('.typing-text');
if (typingText) {
    const texts = [
        'QA Engineer',
        'Test Automation Expert',
        'Quality Assurance Specialist',
        'Bug Hunter'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }

    type();
}

// ===== SCROLL REVEAL ANIMATIONS =====
const revealElements = document.querySelectorAll('.section-reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                if (!stat.classList.contains('animated')) {
                    stat.classList.add('animated');
                    const target = parseInt(stat.getAttribute('data-target'));
                    animateNumber(stat, target);
                }
            });
            
            const progressBars = entry.target.querySelectorAll('.progress-fill');
            progressBars.forEach(bar => {
                const progress = bar.getAttribute('data-progress');
                setTimeout(() => {
                    bar.style.width = progress + '%';
                }, 200);
            });
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});

function animateNumber(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 30);
}

// ===== SKILL TABS =====
const skillTabs = document.querySelectorAll('.skill-tab');
const skillContents = document.querySelectorAll('.skill-category-content');

skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const category = tab.getAttribute('data-category');
        
        skillTabs.forEach(t => t.classList.remove('active'));
        skillContents.forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        const targetContent = document.querySelector(`.skill-category-content[data-category="${category}"]`);
        if (targetContent) {
            targetContent.classList.add('active');
            
            const progressBars = targetContent.querySelectorAll('.progress-fill');
            progressBars.forEach(bar => {
                bar.style.width = '0';
                const progress = bar.getAttribute('data-progress');
                setTimeout(() => {
                    bar.style.width = progress + '%';
                }, 100);
            });
        }
    });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        let isValid = true;

        if (name === '') {
            document.getElementById('nameError').textContent = 'Name is required';
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            document.getElementById('emailError').textContent = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(email)) {
            document.getElementById('emailError').textContent = 'Please enter a valid email';
            isValid = false;
        }

        if (subject === '') {
            document.getElementById('subjectError').textContent = 'Subject is required';
            isValid = false;
        }

        if (message === '') {
            document.getElementById('messageError').textContent = 'Message is required';
            isValid = false;
        }

        if (isValid) {
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                successMessage.classList.add('show');
                contactForm.reset();
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 5000);
            }, 1000);
        }
    });
}

// ===== BACK TO TOP BUTTON =====
const backToTopButton = document.getElementById('backToTop');

if (backToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

console.log('%c👋 Welcome to my portfolio!', 'color: #06b6d4; font-size: 20px; font-weight: bold;');
console.log('%cLooking for a QA Engineer? Let\'s connect!', 'color: #64748b; font-size: 14px;');

});
