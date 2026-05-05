// ===== COMPLETE FIX FOR DARK THEME & BACKGROUND ANIMATION =====
console.log('Starting complete portfolio fix...');

// Wait for page to fully load
window.addEventListener('load', function() {
    console.log('Page fully loaded - initializing all systems');
    
    // ===== THEME SYSTEM =====
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    console.log('Initial theme set to:', savedTheme);
    
    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = html.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            console.log('Theme changed to:', newTheme);
            
            // Force particle colors update
            updateParticleColors();
        });
    }
    
    // ===== PARTICLE BACKGROUND SYSTEM =====
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) {
        console.error('Canvas not found!');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Canvas context not available!');
        return;
    }
    
    console.log('Canvas and context ready');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        console.log('Canvas resized to:', canvas.width, 'x', canvas.height);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create particles
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            radius: Math.random() * 2.5 + 1.5
        });
    }
    
    console.log('Created', particles.length, 'particles');
    
    // Color update function
    function updateParticleColors() {
        // Colors will be updated in the next animation frame
        console.log('Particle colors will update on next frame');
    }
    
    // Animation function
    function animate() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Get current theme for colors
        const isDark = html.getAttribute('data-theme') === 'dark';
        
        // Theme-specific colors with proper contrast
        let particleColor, lineColor, bgColor;
        
        if (isDark) {
            particleColor = 'rgba(100, 255, 218, 0.9)';  // Bright cyan for dark theme
            lineColor = 'rgba(100, 255, 218, 0.3)';  // Cyan lines for dark theme
            bgColor = 'rgba(15, 23, 42, 0.05)';  // Dark blue background
        } else {
            particleColor = 'rgba(59, 130, 246, 0.8)';   // Blue for light theme
            lineColor = 'rgba(59, 130, 246, 0.2)';   // Blue lines for light theme
            bgColor = 'rgba(248, 250, 252, 0.05)';  // Light background
        }
        
        // Draw background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach((particle, i) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off walls
            if (particle.x < particle.radius || particle.x > canvas.width - particle.radius) {
                particle.vx *= -1;
            }
            if (particle.y < particle.radius || particle.y > canvas.height - particle.radius) {
                particle.vy *= -1;
            }
            
            // Keep particles in bounds
            particle.x = Math.max(particle.radius, Math.min(canvas.width - particle.radius, particle.x));
            particle.y = Math.max(particle.radius, Math.min(canvas.height - particle.radius, particle.y));
            
            // Draw connections to nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[j].x - particle.x;
                const dy = particles[j].y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = 1 - (distance / 120);
                    ctx.strokeStyle = lineColor.replace('0.3', (opacity * 0.3).toFixed(2)).replace('0.2', (opacity * 0.2).toFixed(2));
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
            
            // Draw particle with glow effect
            const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius * 2);
            if (isDark) {
                gradient.addColorStop(0, 'rgba(100, 255, 218, 1)');
                gradient.addColorStop(0.5, 'rgba(100, 255, 218, 0.5)');
                gradient.addColorStop(1, 'rgba(100, 255, 218, 0)');
            } else {
                gradient.addColorStop(0, 'rgba(59, 130, 246, 1)');
                gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.5)');
                gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
            }
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Add particle border for better visibility
            ctx.strokeStyle = particleColor;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.stroke();
        });
        
        requestAnimationFrame(animate);
    }
    
    // Start animation
    console.log('Starting enhanced particle animation...');
    animate();
    
    // Make particle system globally accessible
    window.particleSystem = {
        updateColors: updateParticleColors,
        destroy: () => {
            console.log('Particle system destroyed');
        }
    };
    
    // ===== OTHER FUNCTIONALITY =====
    
    // Navigation
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

    // Typing effect
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const texts = ['QA Engineer', 'Test Automation Expert', 'Quality Assurance Specialist', 'Bug Hunter'];
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

    // Scroll reveal animations
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

    // Skill tabs
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

    // Contact form
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

    // Back to top button
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

    console.log('Complete portfolio initialization finished!');
});
