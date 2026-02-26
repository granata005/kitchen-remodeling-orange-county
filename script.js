/**
 * Kitchen Remodeling Orange County - Custom JavaScript
 * Mobile-first interactive functionality
 */

(function () {
    'use strict';

    // ===========================================
    // MAIN APPLICATION OBJECT
    // ===========================================

    const App = {
        init() {
            this.setupMobileMenu();
            this.setupThemeToggle();
            // this.setupSmoothScroll(); // Removed to use native CSS scrolling
            this.setupPortfolioFilters();
            this.setupTestimonialsCarousel();
            this.setupFormValidation();
            this.setupScrollAnimations();
            this.setupHeaderScroll();
        },

        // ===========================================
        // MOBILE MENU
        // ===========================================

        setupMobileMenu() {
            const menuToggle = document.querySelector('.mobile-menu-toggle');
            const mobileMenu = document.querySelector('.mobile-menu');
            const mobileLinks = document.querySelectorAll('.mobile-nav a');

            if (!menuToggle || !mobileMenu) return;

            menuToggle.addEventListener('click', () => {
                const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
                menuToggle.setAttribute('aria-expanded', !isExpanded);
                mobileMenu.setAttribute('aria-hidden', isExpanded);

                // Prevent body scroll when menu is open
                if (!isExpanded) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });

            // Close menu when clicking links
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    mobileMenu.setAttribute('aria-hidden', 'true');
                    document.body.style.overflow = '';
                });
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    mobileMenu.setAttribute('aria-hidden', 'true');
                    document.body.style.overflow = '';
                }
            });
        },

        // ===========================================
        // THEME TOGGLE
        // ===========================================

        setupThemeToggle() {
            const themeToggle = document.querySelector('.theme-toggle');
            if (!themeToggle) return;

            // Check for saved theme preference or default to dark
            const currentTheme = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', currentTheme);

            themeToggle.addEventListener('click', () => {
                const theme = document.documentElement.getAttribute('data-theme');
                const newTheme = theme === 'dark' ? 'light' : 'dark';

                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            });
        },

        // ===========================================
        // SMOOTH SCROLL (REMOVED - handled by CSS)
        // ===========================================

        // setupSmoothScroll() function removed


        // ===========================================
        // PORTFOLIO FILTERS
        // ===========================================

        setupPortfolioFilters() {
            const filterButtons = document.querySelectorAll('.filter-btn');
            const portfolioItems = document.querySelectorAll('.portfolio-item');

            if (filterButtons.length === 0 || portfolioItems.length === 0) return;

            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const filter = button.getAttribute('data-filter');

                    // Update active button
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');

                    // Filter items
                    portfolioItems.forEach(item => {
                        const categories = item.getAttribute('data-category');

                        if (filter === 'all' || categories.includes(filter)) {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            }, 10);
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'scale(0.9)';
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 300);
                        }
                    });
                });
            });
        },

        // ===========================================
        // TESTIMONIALS CAROUSEL
        // ===========================================

        setupTestimonialsCarousel() {
            const track = document.querySelector('.testimonials-track');
            const cards = document.querySelectorAll('.testimonial-card');
            const prevBtn = document.querySelector('.carousel-nav.prev');
            const nextBtn = document.querySelector('.carousel-nav.next');
            const indicatorsContainer = document.querySelector('.carousel-indicators');

            if (!track || cards.length === 0) return;

            let currentIndex = 0;
            const totalCards = cards.length;

            // Create indicators
            if (indicatorsContainer) {
                for (let i = 0; i < totalCards; i++) {
                    const dot = document.createElement('div');
                    dot.classList.add('dot');
                    if (i === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => goToSlide(i));
                    indicatorsContainer.appendChild(dot);
                }
            }

            function updateCarousel() {
                track.style.transform = `translateX(-${currentIndex * 100}%)`;

                // Update indicators
                if (indicatorsContainer) {
                    const dots = indicatorsContainer.querySelectorAll('.dot');
                    dots.forEach((dot, index) => {
                        dot.classList.toggle('active', index === currentIndex);
                    });
                }
            }

            function goToSlide(index) {
                currentIndex = index;
                updateCarousel();
            }

            function nextSlide() {
                currentIndex = (currentIndex + 1) % totalCards;
                updateCarousel();
            }

            function prevSlide() {
                currentIndex = (currentIndex - 1 + totalCards) % totalCards;
                updateCarousel();
            }

            if (prevBtn) prevBtn.addEventListener('click', prevSlide);
            if (nextBtn) nextBtn.addEventListener('click', nextSlide);

            // Auto-advance carousel every 8 seconds
            setInterval(nextSlide, 8000);

            // Touch/swipe support for mobile
            let touchStartX = 0;
            let touchEndX = 0;

            track.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });

            track.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });

            function handleSwipe() {
                if (touchEndX < touchStartX - 50) {
                    nextSlide();
                }
                if (touchEndX > touchStartX + 50) {
                    prevSlide();
                }
            }
        },

        // ===========================================
        // FORM VALIDATION
        // ===========================================

        setupFormValidation() {
            const form = document.querySelector('.contact-form');
            if (!form) return;

            form.addEventListener('submit', (e) => {
                e.preventDefault();

                // Get form values
                const formData = new FormData(form);
                const data = {};
                formData.forEach((value, key) => {
                    data[key] = value;
                });

                // Basic validation
                let isValid = true;
                const requiredFields = form.querySelectorAll('[required]');

                requiredFields.forEach(field => {
                    const value = field.value.trim();

                    if (!value) {
                        isValid = false;
                        this.showFieldError(field, 'This field is required');
                    } else {
                        this.clearFieldError(field);
                    }

                    // Email validation
                    if (field.type === 'email' && value) {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(value)) {
                            isValid = false;
                            this.showFieldError(field, 'Please enter a valid email address');
                        }
                    }

                    // Phone validation (basic)
                    if (field.type === 'tel' && value) {
                        const phoneRegex = /^[\d\s\-\(\)]+$/;
                        if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
                            isValid = false;
                            this.showFieldError(field, 'Please enter a valid phone number');
                        }
                    }
                });

                if (isValid) {
                    // Submit form
                    const submitBtn = form.querySelector('.btn-submit');
                    const originalText = submitBtn.innerHTML;
                    submitBtn.innerHTML = 'Sending...';
                    submitBtn.disabled = true;

                    // Submit to Web3Forms
                    fetch(form.action, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                        .then(response => response.json())
                        .then(result => {
                            if (result.success) {
                                this.showSuccessMessage(form);
                                form.reset();
                            } else {
                                throw new Error(result.message || 'Submission failed');
                            }
                        })
                        .catch(error => {
                            this.showErrorMessage(form);
                        })
                        .finally(() => {
                            submitBtn.innerHTML = originalText;
                            submitBtn.disabled = false;
                        });
                }
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    if (input.hasAttribute('required') && !input.value.trim()) {
                        this.showFieldError(input, 'This field is required');
                    } else {
                        this.clearFieldError(input);
                    }
                });

                input.addEventListener('input', () => {
                    if (input.classList.contains('error')) {
                        this.clearFieldError(input);
                    }
                });
            });
        },

        showFieldError(field, message) {
            field.classList.add('error');
            field.style.borderColor = '#ef4444';

            // Remove existing error message
            const existingError = field.parentElement.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }

            // Add error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = '#ef4444';
            errorDiv.style.fontSize = '0.875rem';
            errorDiv.style.marginTop = '0.25rem';
            errorDiv.textContent = message;
            field.parentElement.appendChild(errorDiv);
        },

        clearFieldError(field) {
            field.classList.remove('error');
            field.style.borderColor = '';

            const errorMessage = field.parentElement.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        },

        showSuccessMessage(form) {
            const message = document.createElement('div');
            message.className = 'form-success-message';
            message.style.cssText = 'padding: 1rem; background: #10b981; color: white; border-radius: 8px; margin-top: 1rem; text-align: center; font-weight: 600;';
            message.textContent = 'Thank you! We\'ll contact you within 24 hours.';
            form.appendChild(message);

            setTimeout(() => {
                message.remove();
            }, 5000);
        },

        showErrorMessage(form) {
            const message = document.createElement('div');
            message.className = 'form-error-message';
            message.style.cssText = 'padding: 1rem; background: #ef4444; color: white; border-radius: 8px; margin-top: 1rem; text-align: center; font-weight: 600;';
            message.textContent = 'Something went wrong. Please try calling us at (949) 992-4636.';
            form.appendChild(message);

            setTimeout(() => {
                message.remove();
            }, 5000);
        },

        // ===========================================
        // SCROLL ANIMATIONS
        // ===========================================

        setupScrollAnimations() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            // Animate elements on scroll
            const animateElements = document.querySelectorAll(
                '.service-card, .trust-badge-card, .process-step, .portfolio-item, .city-card'
            );

            animateElements.forEach(element => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(element);
            });
        },

        // ===========================================
        // HEADER SCROLL EFFECT
        // ===========================================

        setupHeaderScroll() {
            const header = document.querySelector('header');
            if (!header) return;

            let lastScroll = 0;

            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;

                if (currentScroll > 100) {
                    header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
                } else {
                    header.style.boxShadow = '';
                }

                lastScroll = currentScroll;
            });
        }
    };

    // ===========================================
    // INITIALIZE APP ON DOM READY
    // ===========================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => App.init());
    } else {
        App.init();
    }

})();