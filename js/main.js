/* ================================================================
   KHOI BEAUTY STUDIO — Main JavaScript (Revamped)
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ======================== NAVBAR ========================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const logoWhite = document.querySelector('.logo-white');
    const logoDark = document.querySelector('.logo-dark');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            if (logoWhite && logoDark) {
                logoWhite.style.display = 'none';
                logoDark.style.display = 'block';
            }
        } else {
            navbar.classList.remove('scrolled');
            if (logoWhite && logoDark) {
                logoWhite.style.display = 'block';
                logoDark.style.display = 'none';
            }
        }
    }, { passive: true });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ======================== HERO SLIDER ========================
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    if (slides.length > 1) {
        setInterval(nextSlide, 6000);
    }

    // ======================== SMOOTH SCROLL ========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = navbar.offsetHeight + 20;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ======================== SCROLL REVEAL ========================
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ======================== STATS COUNTER ========================
    const statNumbers = document.querySelectorAll('.stat');
    let statsAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                animateStats();
                statsObserver.disconnect();
            }
        });
    }, { threshold: 0.4 });

    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) statsObserver.observe(statsBar);

    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            const suffix = stat.dataset.suffix || '';
            const numberEl = stat.querySelector('.stat-number');
            const duration = 2200;
            const start = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out quart
                const eased = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(eased * target);

                numberEl.textContent = current.toLocaleString() + suffix;

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        });
    }

    // ======================== SERVICE FILTER ========================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            serviceCards.forEach((card, i) => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = `fadeUp 0.5s ${i * 0.05}s var(--ease-out-expo) forwards`;
                } else {
                    card.classList.add('hidden');
                    card.style.animation = '';
                }
            });
        });
    });

    // ======================== TESTIMONIALS SLIDER ========================
    const track = document.getElementById('testimonialsTrack');
    const cards = track ? track.querySelectorAll('.testimonial-card') : [];
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    const dotsContainer = document.getElementById('testimonialDots');
    let currentTestimonial = 0;
    let autoSlideInterval;

    if (cards.length > 0 && dotsContainer) {
        // Create dots
        cards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('testimonial-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToTestimonial(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.testimonial-dot');

        function goToTestimonial(index) {
            currentTestimonial = index;
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === index));
            resetAutoSlide();
        }

        prevBtn.addEventListener('click', () => {
            const prev = (currentTestimonial - 1 + cards.length) % cards.length;
            goToTestimonial(prev);
        });

        nextBtn.addEventListener('click', () => {
            const next = (currentTestimonial + 1) % cards.length;
            goToTestimonial(next);
        });

        // Auto-slide
        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                const next = (currentTestimonial + 1) % cards.length;
                goToTestimonial(next);
            }, 5000);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        startAutoSlide();

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    goToTestimonial((currentTestimonial + 1) % cards.length);
                } else {
                    goToTestimonial((currentTestimonial - 1 + cards.length) % cards.length);
                }
            }
        }, { passive: true });
    }

    // ======================== BOOKING FORM ========================
    const bookingForm = document.getElementById('bookingForm');
    const successModal = document.getElementById('successModal');

    if (bookingForm) {
        // Set min date to today
        const dateInput = document.getElementById('bookDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(bookingForm);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const service = formData.get('service');
            const date = formData.get('date');
            const time = formData.get('time');
            const notes = formData.get('notes');

            let message = `Hi Khoi Beauty! I'd like to book an appointment.\n\n`;
            message += `*Name:* ${name}\n`;
            message += `*Phone:* ${phone}\n`;
            message += `*Service:* ${service}\n`;
            message += `*Date:* ${date}\n`;
            message += `*Time:* ${time}\n`;
            if (notes) message += `*Notes:* ${notes}\n`;

            const whatsappURL = `https://wa.me/254742931583?text=${encodeURIComponent(message)}`;
            window.open(whatsappURL, '_blank');

            successModal.classList.add('active');
            bookingForm.reset();
        });
    }

    // Close modal on backdrop click
    if (successModal) {
        successModal.querySelector('.modal-backdrop').addEventListener('click', () => {
            successModal.classList.remove('active');
        });
    }

    // ======================== NEWSLETTER FORM ========================
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const btn = newsletterForm.querySelector('button');
            const originalHTML = btn.innerHTML;

            btn.innerHTML = '<span>Subscribed!</span>';
            btn.style.background = '#25D366';
            emailInput.value = '';

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
            }, 3000);
        });
    }

    // ======================== ACTIVE NAV HIGHLIGHT ========================
    const sections = document.querySelectorAll('section[id]');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active',
                        link.getAttribute('href') === `#${id}`
                    );
                });
            }
        });
    }, { threshold: 0.25, rootMargin: '-80px 0px 0px 0px' });

    sections.forEach(section => sectionObserver.observe(section));

    // ======================== PARALLAX EFFECT ========================
    const parallaxElements = document.querySelectorAll('.parallax-bg');

    if (window.matchMedia('(min-width: 768px)').matches) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            parallaxElements.forEach(el => {
                const rect = el.parentElement.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const speed = 0.25;
                    const yPos = (rect.top * speed);
                    el.style.transform = `translateY(${yPos}px)`;
                }
            });
        }, { passive: true });
    }

    // ======================== KEYBOARD ACCESSIBILITY ========================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (successModal && successModal.classList.contains('active')) {
                successModal.classList.remove('active');
            }
            if (navMenu.classList.contains('open')) {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            }
        }
    });
});
