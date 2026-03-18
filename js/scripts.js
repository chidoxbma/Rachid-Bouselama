/*!
 * Rachid Bouselama - Portfolio Scripts
 * Smooth animations and interactions
 */

(function() {
    'use strict';

    // ================================
    // DOM Ready
    // ================================
    document.addEventListener('DOMContentLoaded', function() {
        initNavbar();
        initScrollReveal();
        initSmoothScroll();
        initProjectFilters();
        initCounters();
        initBackToTop();
    });

    // ================================
    // Navbar Scroll Effect
    // ================================
    function initNavbar() {
        const navbar = document.getElementById('mainNav');
        if (!navbar) return;

        let lastScroll = 0;
        const scrollThreshold = 50;

        function handleScroll() {
            const currentScroll = window.pageYOffset;
            
            // Add/remove scrolled class
            if (currentScroll > scrollThreshold) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide/show navbar on scroll direction (optional)
            if (currentScroll > lastScroll && currentScroll > 500) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        }

        // Throttled scroll handler
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Smooth transition for navbar
        navbar.style.transition = 'transform 0.3s ease, background 0.3s ease, padding 0.3s ease';
    }

    // ================================
    // Scroll Reveal Animation
    // ================================
    function initScrollReveal() {
        const revealElements = document.querySelectorAll(
            '.timeline-item, .education-card, .language-card, .skill-category, ' +
            '.cert-card, .ability-item, .interest-item, .project-card'
        );

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add stagger delay for grouped elements
                    const delay = entry.target.dataset.delay || index * 50;
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, delay);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            revealObserver.observe(el);
        });

        // Section headers animation
        const sectionHeaders = document.querySelectorAll('.section-header');
        const headerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    headerObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        sectionHeaders.forEach(header => {
            header.style.opacity = '0';
            header.style.transform = 'translateY(20px)';
            header.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            headerObserver.observe(header);
        });
    }

    // ================================
    // Smooth Scroll for Anchor Links
    // ================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || !href) return;
                
                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                const navbarHeight = document.getElementById('mainNav')?.offsetHeight || 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse?.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            });
        });
    }

    // ================================
    // Project Filters (Projects Page)
    // ================================
    function initProjectFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectItems = document.querySelectorAll('.project-item');

        if (!filterBtns.length || !projectItems.length) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;

                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Filter projects with animation
                projectItems.forEach(item => {
                    const categories = item.dataset.category || '';
                    const shouldShow = filter === 'all' || categories.includes(filter);

                    if (shouldShow) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });

        // Initialize project items for animation
        projectItems.forEach(item => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        });
    }

    // ================================
    // Animated Counters
    // ================================
    function initCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        if (!counters.length) return;

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.counter);
                    const duration = parseInt(counter.dataset.duration) || 2000;
                    const suffix = counter.dataset.suffix || '';
                    
                    animateCounter(counter, target, duration, suffix);
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    function animateCounter(element, target, duration, suffix) {
        const startTime = performance.now();
        const startValue = 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startValue + (target - startValue) * easeOut);
            
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target + suffix;
            }
        }

        requestAnimationFrame(update);
    }

    // ================================
    // Back to Top Button
    // ================================
    function initBackToTop() {
        // Create back to top button
        const backToTop = document.createElement('button');
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTop.className = 'back-to-top';
        backToTop.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTop);

        // Style the button
        Object.assign(backToTop.style, {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            opacity: '0',
            visibility: 'hidden',
            transform: 'translateY(20px)',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)',
            zIndex: '999',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });

        // Show/hide on scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
                backToTop.style.transform = 'translateY(0)';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
                backToTop.style.transform = 'translateY(20px)';
            }
        }, { passive: true });

        // Scroll to top on click
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Hover effect
        backToTop.addEventListener('mouseenter', () => {
            backToTop.style.transform = 'translateY(-5px) scale(1.1)';
        });

        backToTop.addEventListener('mouseleave', () => {
            backToTop.style.transform = 'translateY(0) scale(1)';
        });
    }

    // ================================
    // Skill Bar Animation
    // ================================
    function initSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress-bar');
        if (!skillBars.length) return;

        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.dataset.width;
                    
                    setTimeout(() => {
                        bar.style.width = width + '%';
                    }, 200);
                    
                    skillObserver.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => {
            bar.style.width = '0%';
            bar.style.transition = 'width 1s ease-out';
            skillObserver.observe(bar);
        });
    }

    // ================================
    // Parallax Effect for Hero
    // ================================
    function initParallax() {
        const heroSection = document.querySelector('.hero-section');
        const heroPattern = document.querySelector('.hero-bg-pattern');
        
        if (!heroSection || !heroPattern) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            
            heroPattern.style.transform = `translateY(${rate}px)`;
        }, { passive: true });
    }

    // ================================
    // Typing Effect (Optional for hero)
    // ================================
    function initTypingEffect() {
        const typingElement = document.querySelector('.typing-effect');
        if (!typingElement) return;

        const text = typingElement.dataset.text || typingElement.textContent;
        const speed = parseInt(typingElement.dataset.speed) || 50;
        
        typingElement.textContent = '';
        let i = 0;

        function type() {
            if (i < text.length) {
                typingElement.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }

        // Start typing when element is visible
        const typingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    type();
                    typingObserver.unobserve(typingElement);
                }
            });
        });

        typingObserver.observe(typingElement);
    }

    // ================================
    // Tooltip Initialization
    // ================================
    function initTooltips() {
        const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
        
        tooltipTriggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', (e) => {
                const text = e.target.dataset.tooltip;
                const tooltip = document.createElement('div');
                tooltip.className = 'custom-tooltip';
                tooltip.textContent = text;
                
                Object.assign(tooltip.style, {
                    position: 'absolute',
                    background: 'rgba(15, 23, 42, 0.9)',
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    zIndex: '1000',
                    pointerEvents: 'none',
                    transform: 'translate(-50%, -100%)',
                    marginTop: '-10px',
                    whiteSpace: 'nowrap'
                });
                
                document.body.appendChild(tooltip);
                
                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = rect.left + rect.width / 2 + 'px';
                tooltip.style.top = rect.top + 'px';
                
                e.target._tooltip = tooltip;
            });
            
            trigger.addEventListener('mouseleave', (e) => {
                if (e.target._tooltip) {
                    e.target._tooltip.remove();
                    delete e.target._tooltip;
                }
            });
        });
    }

    // ================================
    // Image Lazy Loading
    // ================================
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    // ================================
    // Mobile Menu Close on Click
    // ================================
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });

    // ================================
    // Preloader (Optional)
    // ================================
    function initPreloader() {
        const preloader = document.querySelector('.preloader');
        if (!preloader) return;

        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
    }

    // ================================
    // Active Nav Link on Scroll
    // ================================
    function initActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

        if (!sections.length || !navLinks.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
    }

    // Initialize active nav link
    initActiveNavLink();

})();

// ================================
// Bootstrap Components Initialization
// ================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    if (tooltipTriggerList.length && typeof bootstrap !== 'undefined') {
        [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    }

    // Initialize Bootstrap popovers
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    if (popoverTriggerList.length && typeof bootstrap !== 'undefined') {
        [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
    }
});