// ===== SIMPLE LOCALHOST-FRIENDLY PARTICLE SYSTEM =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio loaded - initializing particle system...');

    // ===== THEME TOGGLE =====
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Set initial theme
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const theme = html.getAttribute('data-theme');
            const newTheme = theme === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // ===== PARTICLE BACKGROUND =====
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

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
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
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1
        });
    }

    // Animation function
    function animate() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Get current theme colors
        const isDark = html.getAttribute('data-theme') === 'dark';
        const particleColor = isDark ? 'rgba(100, 255, 218, 0.8)' : 'rgba(59, 130, 246, 0.6)';
        const lineColor = isDark ? 'rgba(100, 255, 218, 0.2)' : 'rgba(59, 130, 246, 0.15)';

        // Update and draw particles
        particles.forEach((particle, i) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off walls
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

            // Keep particles in bounds
            particle.x = Math.max(0, Math.min(canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(canvas.height, particle.y));

            // Draw connections
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[j].x - particle.x;
                const dy = particles[j].y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }

            // Draw particle
            ctx.fillStyle = particleColor;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    // Start animation
    console.log('Starting particle animation with', particles.length, 'particles');
    animate();

    // Make particle system globally accessible
    window.particleSystem = {
        updateColors: () => {
            // Colors are updated in real-time in animate function
        },
        destroy: () => {
            // Animation can be stopped by canceling requestAnimationFrame
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

    console.log('Portfolio initialization complete!');
});
