/* ================================================================
   KHOI BEAUTY STUDIO — Premium Cinematic Upgrades (from Opus reference)
   GSAP + Lenis + Custom Cursor + Film Grain
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ======================== LENIS SMOOTH SCROLL ========================
    let lenis;
    function initLenis() {
        if (typeof Lenis === 'undefined') return;
        lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Integrate with GSAP
        if (typeof gsap !== 'undefined' && gsap.ticker) {
            lenis.on('scroll', () => {
                if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
            });
            gsap.ticker.add((time) => { lenis.raf(time * 1000); });
            gsap.ticker.lagSmoothing(0);
        }
    }

    // ======================== CUSTOM CURSOR ========================
    const cursor = document.getElementById('cursor');
    const cursorDot = cursor?.querySelector('.cursor-dot');
    const cursorRing = cursor?.querySelector('.cursor-ring');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    if (cursor && window.matchMedia('(min-width: 769px)').matches) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (cursorDot) {
                cursorDot.style.left = mouseX + 'px';
                cursorDot.style.top = mouseY + 'px';
            }
        });

        function animateCursorRing() {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            if (cursorRing) {
                cursorRing.style.left = ringX + 'px';
                cursorRing.style.top = ringY + 'px';
            }
            requestAnimationFrame(animateCursorRing);
        }
        animateCursorRing();

        // Hover states — expand ring on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .btn, .magnetic, .service-card, .team-card, .gallery-scroll-item, input, select, textarea');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });
    }

    // ======================== MAGNETIC BUTTONS ========================
    if (window.matchMedia('(min-width: 769px)').matches) {
        const magneticElements = document.querySelectorAll('.magnetic');
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
                el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                setTimeout(() => { el.style.transition = ''; }, 600);
            });
        });
    }

    // ======================== SCROLL REVEAL (GSAP-enhanced) ========================
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale, .reveal, .reveal-left, .reveal-right');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ======================== GSAP HERO ANIMATIONS ========================
    function initHeroAnimations() {
        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
            tl.to('.title-line-inner', {
                y: 0,
                duration: 1.4,
                stagger: 0.15,
            })
            .to('.hero-badge', { opacity: 1, y: 0, duration: 1 }, '-=0.9')
            .to('.hero-subtitle', { opacity: 1, y: 0, duration: 1 }, '-=0.7')
            .to('.hero-ctas', { opacity: 1, y: 0, duration: 1 }, '-=0.6')
            .to('.hero-bottom', { opacity: 1, y: 0, duration: 0.8 }, '-=0.4');
        }
    }

    // ======================== GSAP PARALLAX + GALLERY ========================
    function initGSAPEnhancements() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);

        // Parallax for cinematic divider
        const parallaxBg = document.querySelector('.parallax-bg');
        if (parallaxBg) {
            gsap.to(parallaxBg, {
                scrollTrigger: {
                    trigger: '.cinematic-divider',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                },
                y: '-20%',
                ease: 'none',
            });
        }

        // Horizontal gallery scroll
        const galleryTrack = document.getElementById('galleryTrack');
        if (galleryTrack) {
            const galleryItems = galleryTrack.querySelectorAll('.gallery-scroll-item');
            if (galleryItems.length > 0) {
                const totalWidth = galleryTrack.scrollWidth - window.innerWidth + 100;
                gsap.to(galleryTrack, {
                    x: -totalWidth,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.gallery',
                        start: 'top top',
                        end: () => '+=' + totalWidth,
                        pin: true,
                        scrub: 1,
                        invalidateOnRefresh: true,
                    },
                });
            }
        }
    }

    // ======================== ANIMATED COUNTERS ========================
    const statNumbers = document.querySelectorAll('.stat, .stats-number');
    let statsAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                animateStats();
                statsObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) statsObserver.observe(statsBar);

    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset?.target || stat.innerText?.replace(/\D/g, ''));
            const suffix = stat.dataset?.suffix || '';
            const numberEl = stat.querySelector('.stat-number') || stat;
            if (isNaN(target)) return;

            const duration = 2500;
            const start = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(eased * target);
                numberEl.textContent = current.toLocaleString() + suffix;
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        });
    }

    // ======================== FLOATING PARTICLES ========================
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // ======================== BACK TO TOP ========================
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        }, { passive: true });
        backToTop.addEventListener('click', () => {
            if (lenis) lenis.scrollTo(0, { duration: 1.6 });
            else window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ======================== SMOOTH SCROLL FOR ANCHOR LINKS ========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navbar = document.getElementById('navbar');
                const offset = navbar ? navbar.offsetHeight + 20 : 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                if (lenis) lenis.scrollTo(targetPosition, { duration: 1.6 });
                else window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // ======================== INIT ========================
    // Wait for page load then init everything
    window.addEventListener('load', () => {
        setTimeout(() => {
            initHeroAnimations();
            initLenis();
            initGSAPEnhancements();
        }, 300);
    });

    // Fallback init
    setTimeout(() => {
        initHeroAnimations();
        initLenis();
        initGSAPEnhancements();
    }, 3000);

    initScrollReveal();
});
