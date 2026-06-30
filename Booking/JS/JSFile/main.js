// Eleven Eleven Events - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your public key
    emailjs.init("xhF-F6jL3C56vfff-"); // Replace with your actual public key
    
    // Initialize all components
    initNavigation();
    initHeroSlideshow();
    initReviewsSlider();
    initBookingModal();
    initContactForm();
    initScrollAnimations();
    initMiscellaneous();
});

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
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
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

    // The current hero design uses a single static image, not a slideshow.
    // Bail out instead of running broken interval logic against an empty NodeList.
    if (!slides.length) {
        return;
    }
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
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

    // Add click handlers to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            showSlide(index);
            stopSlideshow();
            startSlideshow(); // Restart the interval
        });
    });

    // Start the slideshow
    startSlideshow();

    // Pause slideshow on hover
    const heroSection = document.querySelector('.hero');
    heroSection.addEventListener('mouseenter', stopSlideshow);
    heroSection.addEventListener('mouseleave', startSlideshow);

    // Handle explore button
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

    // Create dots
    function createDots() {
        reviewDots.innerHTML = '';
        reviews.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `review-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => showReview(index));
            reviewDots.appendChild(dot);
        });
    }

    // Show specific review
    function showReview(index) {
        currentReview = index;
        const review = reviews[index];
        
        // Create stars HTML
        const starsHTML = Array(review.rating).fill('<i class="fas fa-star"></i>').join('');
        
        // Update card content
        reviewCard.innerHTML = `
            <div class="stars">${starsHTML}</div>
            <blockquote>"${review.text}"</blockquote>
            <div class="review-author">
                <h3>${review.name}</h3>
                <p>${review.event}</p>
                <span>${review.date}</span>
            </div>
        `;
        
        // Update dots
        document.querySelectorAll('.review-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Navigation functions
    function nextReview() {
        const next = (currentReview + 1) % reviews.length;
        showReview(next);
    }

    function prevReview() {
        const prev = (currentReview - 1 + reviews.length) % reviews.length;
        showReview(prev);
    }

    // Initialize
    createDots();
    showReview(0);

    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevReview);
    if (nextBtn) nextBtn.addEventListener('click', nextReview);

    // Auto-advance reviews
    setInterval(nextReview, 6000);
}

// Booking modal functionality
function initBookingModal() {
    const modal = document.getElementById('booking-modal');
    const bookingBtns = document.querySelectorAll('#nav-book-btn, #hero-book-btn');
    const closeBtn = document.getElementById('modal-close');
    const bookingForm = document.getElementById('booking-form');
    const contactForm = document.getElementById('contact-form');

    // Open modal
    bookingBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Handle form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Manifesting Your Event...';
            submitBtn.disabled = true;
            
            // Send email using EmailJS
            emailjs.send('service_q5op5eg', 'template_m0yin89', data)
                .then(() => {
                    showMessage('✅ Booking request sent! We\'ll contact you within 24 hours to discuss your dream event.', 'success');
                    this.reset();
                    closeModal();
                })
                .catch((error) => {
                    console.error('EmailJS error:', error);
                    showMessage('❌ There was an error sending your booking request. Please try again or contact us directly.', 'error');
                })
                .finally(() => {
                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Send email using EmailJS
            emailjs.send('service_q5op5eg', 'template_m0yin89', data)
                .then(() => {
                    showMessage('✅ Contact request sent! We\'ll contact you within 24 hours to discuss your dream event.', 'success');
                    this.reset();
                    closeModal();
                })
                .catch((error) => {
                    console.error('EmailJS error:', error);
                    showMessage('❌ There was an error sending your contact request. Please try again or contact us directly.', 'error');
                })
                .finally(() => {
                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');

    // NOTE: uses the same EmailJS service as the booking form. If you have (or
    // create) a dedicated EmailJS template for general contact messages whose
    // variables match this form's fields (f_name, l_name, email, message),
    // put its ID here. Otherwise this falls back to the booking template.
    const CONTACT_TEMPLATE_ID = 'template_m0yin89';

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            emailjs.send('service_q5op5eg', CONTACT_TEMPLATE_ID, data)
                .then(() => {
                    showMessage('Message sent! Thank you for reaching out. We\'ll get back to you soon.', 'success');
                    this.reset();
                })
                .catch((error) => {
                    console.error('EmailJS error:', error);
                    showMessage('There was an error sending your message. Please try again or contact us directly.', 'error');
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

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.section-title, .about-content, .gallery-item, .review-card, .contact-form, .contact-info');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Miscellaneous functionality
function initMiscellaneous() {
    // Set current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Smooth scroll for footer links
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

    // Preload images for better performance
    const imageUrls = [
        'Img/Graduation Dinner 1.jpg',
        'Img/The Sunset Palms 2.jpg',
        'Img/Baby Shower.jpg',
        'Img/matric event.jpg'
    ];

    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });

    // Add loading states to buttons
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn:not([type="submit"])')) {
            e.target.classList.add('loading');
            setTimeout(() => {
                e.target.classList.remove('loading');
            }, 300);
        }
    });
}

// Utility function to show messages
function showMessage(text, type = 'success') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    // Insert at top of page
    document.body.insertBefore(message, document.body.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 5000);
    
    // Add click to dismiss
    message.addEventListener('click', () => {
        message.remove();
    });
}

// Performance optimizations
window.addEventListener('load', function() {
    // Add loaded class for animations
    document.body.classList.add('loaded');
    
    // Initialize any remaining functionality that depends on full page load
    initAdvancedFeatures();
});

function initAdvancedFeatures() {
    // Add parallax effect to hero section (optional)
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero && scrolled < hero.offsetHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    }, 16));
}

// Utility function for throttling
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

// Handle browser back/forward navigation
window.addEventListener('popstate', function(e) {
    // Handle any state changes if needed
    console.log('Navigation state changed');
});

// Service worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment if you want to add PWA functionality
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Note: gallery videos now lazy-load and play on hover/focus instead of as
// soon as they scroll into view — see the hover-to-play logic in test.js,
// which is lighter weight than preloading and autoplaying every video.
