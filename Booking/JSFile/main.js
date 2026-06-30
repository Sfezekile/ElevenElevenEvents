// Eleven Eleven Events - Main JavaScript (ENHANCED WITH VALIDATION)

document.addEventListener('DOMContentLoaded', function() {
    // ===== SECURITY: EmailJS Configuration =====
    // DO NOT hardcode public key directly. Instead, use environment variable approach:
    // const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    // For now, initialize from a separate config file you can .gitignore
    initEmailJS();
    
    // Initialize all components
    initNavigation();
    initHeroSlideshow();
    initReviewsSlider();
    initBookingModal();
    initContactForm();
    initScrollAnimations();
    initMiscellaneous();
});

// ===== EMAILJS CONFIGURATION =====
function initEmailJS() {
    // Option 1: Load from a config file (recommended for production)
    // const config = await fetch('/config/emailjs-config.json').then(r => r.json());
    // emailjs.init(config.publicKey);
    
    // Option 2: Initialize with public key
    // SECURITY NOTE: This is still exposed in browser. For production, use serverless function approach.
    emailjs.init("xhF-F6jL3C56vfff-");
}

// Template IDs for different email types
const EMAIL_TEMPLATES = {
    booking: 'template_booking',     // Create this in EmailJS dashboard
    contact: 'template_contact'      // Create this in EmailJS dashboard
};

const EMAIL_SERVICE = 'service_q5op5eg';

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        
        if (navMenu.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
            navToggle.querySelector('i').className = 'fas fa-bars';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.querySelector('i').className = 'fas fa-bars';
        }
    });
}

// Hero slideshow functionality
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');

    if (!slides.length) {
        return;
    }
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            showSlide(index);
            stopSlideshow();
            startSlideshow();
        });
    });

    startSlideshow();

    const heroSection = document.querySelector('.hero');
    heroSection.addEventListener('mouseenter', stopSlideshow);
    heroSection.addEventListener('mouseleave', startSlideshow);

    const exploreBtn = document.getElementById('explore-btn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            const gallerySection = document.getElementById('gallery');
            if (gallerySection) {
                const offsetTop = gallerySection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Reviews slider functionality
function initReviewsSlider() {
    const reviews = [
        {
            name: "Tlamelo M.",
            event: "Birthday Party",
            date: "10 December 2024",
            rating: 5,
            text: "Eleven Eleven Events exceeded my expectations for my 21st birthday, delivering a setup even better than my inspiration photo. Their creativity and attention to detail made my day unforgettable. Highly recommended!"
        },
        {
            name: "Momo D.",
            event: "Birthday Party", 
            date: "10 December 2024",
            rating: 5,
            text: "I would just like to say thank you so much to the Eleven Eleven Events team for making my birthday special. I hardly had a set concept for the decor but my expectations were highly exceeded. I would recommend Eleven Eleven Events to anyone, in a heartbeat 😊"
        },
        {
            name: "Zinhle",
            event: "Kid's Birthday Party",
            date: "16 April 2025",
            rating: 5,
            text: "Eleven Eleven Events delivered exactly what I wanted, arriving and setting up on time. The decor matched my requests perfectly, and their professionalism and kindness made the experience worthwhile. Thank you for making my son's birthday special."
        },
        {
            name: "Pabi",
            event: "Kid's Birthday Party",
            date: "16 April 2025", 
            rating: 5,
            text: "Thank you for your beautiful work and going above and beyond for our son's special day. We truly appreciate your dedication and will definitely recommend you. Looking forward to working with you again!"
        },
        {
            name: "Ora",
            event: "Graduation Lunch",
            date: "16 May 2025",
            rating: 5,
            text: "Thank you so much being part of the preparations and Decor for my graduation lunch it's what I wanted and everything more, definitely my go-to planner from now on!"
        }
    ];

    let currentReview = 0;
    const reviewCard = document.querySelector('.review-card');
    const reviewDots = document.getElementById('review-dots');
    const prevBtn = document.getElementById('prev-review');
    const nextBtn = document.getElementById('next-review');

    function createDots() {
        reviewDots.innerHTML = '';
        reviews.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `review-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => showReview(index));
            reviewDots.appendChild(dot);
        });
    }

    function showReview(index) {
        currentReview = index;
        const review = reviews[index];
        
        const starsHTML = Array(review.rating).fill('<i class="fas fa-star"></i>').join('');
        
        reviewCard.innerHTML = `
            <div class="stars">${starsHTML}</div>
            <blockquote>"${review.text}"</blockquote>
            <div class="review-author">
                <h3>${review.name}</h3>
                <p>${review.event}</p>
                <span>${review.date}</span>
            </div>
        `;
        
        document.querySelectorAll('.review-dot').forEach(dot => dot.classList.remove('active'));
        document.querySelectorAll('.review-dot')[index].classList.add('active');
    }

    createDots();
    showReview(0);

    prevBtn.addEventListener('click', () => {
        const prev = (currentReview - 1 + reviews.length) % reviews.length;
        showReview(prev);
    });

    nextBtn.addEventListener('click', () => {
        const next = (currentReview + 1) % reviews.length;
        showReview(next);
    });
}

// ===== VALIDATION FUNCTIONS =====
const Validators = {
    email: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },
    
    phone: (phone) => {
        // Accepts various phone formats: +27701234567, 0701234567, (27) 701-234-567, etc.
        const regex = /^[\+\d\s\-\(\)]{7,20}$/;
        return phone.length >= 7 && regex.test(phone);
    },
    
    date: (dateString) => {
        const selected = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selected >= today;
    },
    
    guestCount: (count) => {
        const num = parseInt(count, 10);
        return num > 0 && num <= 500;
    },
    
    name: (name) => {
        return name.trim().length >= 2;
    },
    
    time: (timeString) => {
        // HH:MM format
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeString);
    }
};

// Create error message element
function createErrorElement(field) {
    const errorEl = document.createElement('span');
    errorEl.className = 'error-message';
    field.parentElement.appendChild(errorEl);
    return errorEl;
}

// Validate individual field
function validateField(field) {
    const errorElement = field.parentElement.querySelector('.error-message') || createErrorElement(field);
    let isValid = true;
    let message = '';
    
    const fieldId = field.id;
    const fieldValue = field.value.trim();
    
    // Skip empty non-required fields
    if (!fieldValue && !field.required) {
        field.classList.remove('invalid', 'valid');
        errorElement.style.display = 'none';
        return true;
    }
    
    // Check required fields
    if (!fieldValue && field.required) {
        isValid = false;
        message = 'This field is required.';
    } else {
        // Run type-specific validation
        switch(fieldId) {
            case 'client-email':
            case 'contact-email':
                if (!Validators.email(fieldValue)) {
                    isValid = false;
                    message = 'Please enter a valid email address.';
                }
                break;
                
            case 'client-phone':
                if (!Validators.phone(fieldValue)) {
                    isValid = false;
                    message = 'Please enter a valid phone number.';
                }
                break;
                
            case 'event-date':
                if (!Validators.date(fieldValue)) {
                    isValid = false;
                    message = 'Event date must be today or in the future.';
                }
                break;
                
            case 'guest-count':
                if (!Validators.guestCount(fieldValue)) {
                    isValid = false;
                    message = 'Please enter a number between 1 and 500.';
                }
                break;
                
            case 'client-name':
            case 'contact-fname':
            case 'contact-lname':
                if (!Validators.name(fieldValue)) {
                    isValid = false;
                    message = 'Please enter a valid name (at least 2 characters).';
                }
                break;
                
            case 'start-time':
            case 'end-time':
                if (!Validators.time(fieldValue)) {
                    isValid = false;
                    message = 'Please enter a valid time.';
                }
                break;
        }
    }
    
    // Update UI
    if (!isValid) {
        field.classList.add('invalid');
        field.classList.remove('valid');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    } else {
        field.classList.remove('invalid');
        field.classList.add('valid');
        errorElement.style.display = 'none';
    }
    
    return isValid;
}

// Validate entire form
function validateForm(form) {
    const fields = form.querySelectorAll('input, select, textarea');
    let allValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            allValid = false;
        }
    });
    
    return allValid;
}

// Booking modal functionality
function initBookingModal() {
    const bookingBtn = document.getElementById('nav-book-btn');
    const modal = document.getElementById('booking-modal');
    const modalClose = document.getElementById('modal-close');
    const bookingForm = document.getElementById('booking-form');

    // Open modal
    if (bookingBtn) {
        bookingBtn.addEventListener('click', function() {
            modal.classList.add('active');
        });
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
    }

    modalClose.addEventListener('click', closeModal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Real-time validation on blur
    const bookingFields = bookingForm.querySelectorAll('input, select, textarea');
    bookingFields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.classList.contains('invalid')) {
                validateField(field);
            }
        });
    });

    // Form submission with validation
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate all fields
            if (!validateForm(this)) {
                showMessage('❌ Please fix the errors above.', 'error');
                const firstInvalid = this.querySelector('.invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Send email using EmailJS with booking template
            emailjs.send(EMAIL_SERVICE, EMAIL_TEMPLATES.booking, data)
                .then(() => {
                    showMessage('✅ Booking request sent! We\'ll contact you within 24 hours.', 'success');
                    this.reset();
                    bookingFields.forEach(f => f.classList.remove('valid', 'invalid'));
                    closeModal();
                })
                .catch((error) => {
                    console.error('EmailJS error:', error);
                    showMessage('❌ Error sending booking request. Please try again.', 'error');
                })
                .finally(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
    
    // Expose closeModal for external use
    window.closeModal = closeModal;
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        // Real-time validation on blur
        const contactFields = contactForm.querySelectorAll('input, textarea');
        contactFields.forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('invalid')) {
                    validateField(field);
                }
            });
        });

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate all fields
            if (!validateForm(this)) {
                showMessage('❌ Please fix the errors above.', 'error');
                const firstInvalid = this.querySelector('.invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
                return;
            }

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Send email using EmailJS with contact template
            emailjs.send(EMAIL_SERVICE, EMAIL_TEMPLATES.contact, data)
                .then(() => {
                    showMessage('✅ Message sent! We\'ll get back to you soon.', 'success');
                    this.reset();
                    contactFields.forEach(f => f.classList.remove('valid', 'invalid'));
                })
                .catch((error) => {
                    console.error('EmailJS error:', error);
                    showMessage('❌ Error sending message. Please try again.', 'error');
                })
                .finally(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.section-title, .about-content, .gallery-item, .review-card, .contact-form, .contact-info');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Miscellaneous functionality
function initMiscellaneous() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    const footerLinks = document.querySelectorAll('.footer-links a[href^="#"]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Lazy load images (add data-src to img tags instead of src)
    const imageUrls = [
        'Img/Graduation Dinner 1.jpg',
        'Img/The Sunset Palms 2.jpg',
        'Img/Baby Shower.jpg',
        'Img/matric event.jpg'
    ];

    // Note: Don't preload all images - let lazy loading handle this
}

// Utility function to show messages
function showMessage(text, type = 'success') {
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    document.body.insertBefore(message, document.body.firstChild);
    
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 5000);
    
    message.addEventListener('click', () => {
        message.remove();
    });
}

// Performance optimizations
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    initAdvancedFeatures();
});

function initAdvancedFeatures() {
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero && scrolled < hero.offsetHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    }, 16));
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

window.addEventListener('popstate', function(e) {
    console.log('Navigation state changed');
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment for PWA functionality
        // navigator.serviceWorker.register('/sw.js');
    });
}