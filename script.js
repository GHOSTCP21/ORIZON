(function() {
    // === LOADER ===
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
        }, 1800);
    });
    // Fallback if load event already fired
    if (document.readyState === 'complete') {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
        }, 1800);
    }
    document.body.style.overflow = 'hidden';

    // === CUSTOM CURSOR ===
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    let mouseX = 0,
        mouseY = 0;
    let ringX = 0,
        ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverElements = document.querySelectorAll(
        'a, button, .btn, .feature-card, .member-card, .faq-question, .about-icon-card, .stat-card, .hamburger');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
    });

    // === PARTICLES ===
    const canvas = document.getElementById('particlesCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let canvasW, canvasH;

    function resizeCanvas() {
        canvasW = canvas.width = window.innerWidth;
        canvasH = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    function initParticles() {
        const count = Math.min(Math.floor((canvasW * canvasH) / 18000), 120);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvasW,
                y: Math.random() * canvasH,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                r: Math.random() * 1.6 + 0.5,
                alpha: Math.random() * 0.5 + 0.2,
            });
        }
    }
    initParticles();

    function drawParticles() {
        ctx.clearRect(0, 0, canvasW, canvasH);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < -20) p.x = canvasW + 20;
            if (p.x > canvasW + 20) p.x = -20;
            if (p.y < -20) p.y = canvasH + 20;
            if (p.y > canvasH + 20) p.y = -20;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,229,255,${p.alpha})`;
            ctx.fill();
        });
        // Draw subtle connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0,229,255,${0.04 * (1 - dist / 130)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(drawParticles);
    }
    drawParticles();

    // === NAVBAR SCROLL ===
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // === MOBILE MENU ===
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    document.querySelectorAll('#navLinks a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // === SMOOTH SCROLL FOR ANCHOR LINKS ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // === REVEAL ON SCROLL ===
    const revealEls = document.querySelectorAll('.reveal');
    const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    revealEls.forEach(el => revealObserver.observe(el));

    // === STATS COUNTER ===
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                const duration = 2000;
                const startTime = performance.now();
                const startVal = 0;

                function updateCounter(timestamp) {
                    const elapsed = timestamp - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(startVal + (target - startVal) * eased);
                    el.textContent = current.toLocaleString();
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = target.toLocaleString();
                    }
                }
                requestAnimationFrame(updateCounter);
                statsObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => statsObserver.observe(el));

    // === FAQ ACCORDION ===
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            // Close all
            faqItems.forEach(fi => fi.classList.remove('open'));
            // Open clicked if it wasn't open
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });

    // === PARALLAX ON GLOW DECORATIONS ===
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const glow1 = document.querySelector('.glow-1');
        const glow2 = document.querySelector('.glow-2');
        if (glow1) glow1.style.transform = `translateY(${scrollY * 0.05}px)`;
        if (glow2) glow2.style.transform = `translateY(${-scrollY * 0.04}px)`;
    });

    console.log('%c🌐 ORIZON %c— Kominote Ayisyen Modèn %c| %cPare! 🚀',
        'color:#00e5ff;font-size:1.5rem;font-weight:bold;',
        'color:#fff;font-size:1rem;',
        '',
        'color:#d41b3f;font-weight:bold;');
    console.log('%cAntre sou Discord la ➜ %chttps://discord.gg/orizon',
        'color:#fff;', 'color:#00e5ff;');
})();