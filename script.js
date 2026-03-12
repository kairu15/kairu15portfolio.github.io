/**
 * Modern Portfolio JavaScript
 * Clean, performant, and accessible
 */

// Use strict mode for better error handling
'use strict';

// DOM Elements - Cache references for performance
const elements = {
    navbar: document.querySelector('.navbar'),
    navMenu: document.querySelector('.nav-menu'),
    hamburger: document.querySelector('.hamburger'),
    navLinks: document.querySelectorAll('.nav-link'),
    contactForm: document.getElementById('contactForm'),
    skillBars: document.querySelectorAll('.skill-progress'),
    themeToggle: document.getElementById('theme-toggle'),
    projectSearch: document.getElementById('project-search'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    projectCards: document.querySelectorAll('.project-card'),
    typingText: document.getElementById('typing-text')
};

// Configuration
const config = {
    roles: ['Programmer', 'Software Developer', 'Web Designer', 'Full Stack Developer'],
    typingSpeed: 100,
    deletingSpeed: 50,
    pauseDuration: 2000,
    animationThreshold: 0.1,
    scrollOffset: 70,
    debounceDelay: 100
};

// State management
const state = {
    currentTheme: localStorage.getItem('theme') || 'dark',
    typingIndex: 0,
    charIndex: 0,
    isDeleting: false,
    isMenuOpen: false
};

// Utility functions
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func.apply(null, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

const showNotification = (message, type = 'info') => {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Apply styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: 'var(--border-radius)',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        boxShadow: 'var(--shadow-lg)'
    });
    
    // Set background color
    const colors = {
        success: '#46d369',
        error: '#e50914',
        info: '#0071eb'
    };
    notification.style.background = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
};

// Theme Management
const themeManager = {
    init() {
        this.applyTheme(state.currentTheme);
        elements.themeToggle.addEventListener('click', () => this.toggle());
    },
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const icon = elements.themeToggle.querySelector('i');
        icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        state.currentTheme = theme;
    },
    
    toggle() {
        const newTheme = state.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }
};

// Typing Animation
const typingAnimation = {
    init() {
        if (!elements.typingText) return;
        this.type();
    },
    
    type() {
        const currentRole = config.roles[state.typingIndex];
        
        if (state.isDeleting) {
            elements.typingText.textContent = currentRole.substring(0, state.charIndex - 1);
            state.charIndex--;
        } else {
            elements.typingText.textContent = currentRole.substring(0, state.charIndex + 1);
            state.charIndex++;
        }
        
        if (!state.isDeleting && state.charIndex === currentRole.length) {
            state.isDeleting = true;
            setTimeout(() => this.type(), config.pauseDuration);
        } else if (state.isDeleting && state.charIndex === 0) {
            state.isDeleting = false;
            state.typingIndex = (state.typingIndex + 1) % config.roles.length;
            setTimeout(() => this.type(), 500);
        } else {
            setTimeout(() => this.type(), state.isDeleting ? config.deletingSpeed : config.typingSpeed);
        }
    }
};

// Project Management
const projectManager = {
    init() {
        this.setupSearch();
        this.setupFilters();
    },
    
    setupSearch() {
        if (!elements.projectSearch) return;
        
        const handleSearch = debounce(() => this.filterProjects(), config.debounceDelay);
        elements.projectSearch.addEventListener('input', handleSearch);
    },
    
    setupFilters() {
        if (!elements.filterButtons.length) return;
        
        elements.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active state
                elements.filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
                
                this.filterProjects();
            });
        });
    },
    
    filterProjects() {
        if (!elements.projectCards.length) return;
        
        const searchTerm = elements.projectSearch?.value.toLowerCase() || '';
        const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
        
        elements.projectCards.forEach(card => {
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = card.querySelector('p')?.textContent.toLowerCase() || '';
            const category = card.getAttribute('data-category');
            
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesFilter = activeFilter === 'all' || category === activeFilter;
            
            if (matchesSearch && matchesFilter) {
                card.classList.remove('hidden');
                card.classList.add('fade-in');
            } else {
                card.classList.add('hidden');
                card.classList.remove('fade-in');
            }
        });
    }
};

// Navigation Management
const navigationManager = {
    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupScrollEffects();
    },
    
    setupMobileMenu() {
        if (!elements.hamburger) return;
        
        elements.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close menu when clicking links
        elements.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (state.isMenuOpen && !elements.navMenu.contains(e.target) && !elements.hamburger.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    },
    
    toggleMobileMenu() {
        state.isMenuOpen = !state.isMenuOpen;
        elements.navMenu.classList.toggle('active');
        elements.hamburger.classList.toggle('active');
        elements.hamburger.setAttribute('aria-expanded', state.isMenuOpen);
    },
    
    closeMobileMenu() {
        if (!state.isMenuOpen) return;
        state.isMenuOpen = false;
        elements.navMenu.classList.remove('active');
        elements.hamburger.classList.remove('active');
        elements.hamburger.setAttribute('aria-expanded', 'false');
    },
    
    setupSmoothScrolling() {
        elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - config.scrollOffset;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    },
    
    setupScrollEffects() {
        const handleScroll = throttle(() => {
            // Navbar scroll effect
            if (window.scrollY > 100) {
                elements.navbar?.classList.add('scrolled');
            } else {
                elements.navbar?.classList.remove('scrolled');
            }
            
            // Active navigation link
            this.updateActiveNavLink();
        }, 16); // ~60fps
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    },
    
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        elements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href')?.slice(1) === current) {
                link.classList.add('active');
            }
        });
    }
};

// Animation Management
const animationManager = {
    init() {
        this.setupIntersectionObserver();
        this.setupSkillAnimations();
    },
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: config.animationThreshold,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.section-title, .about-text, .stat-item, .project-card, .skill-category, .contact-info, .contact-form');
        animatedElements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    },
    
    setupSkillAnimations() {
        if (!elements.skillBars.length) return;
        
        const animateSkills = throttle(() => {
            const skillsSection = document.querySelector('#skills');
            if (!skillsSection) return;
            
            const sectionTop = skillsSection.offsetTop;
            const sectionHeight = skillsSection.clientHeight;
            const scrollY = window.scrollY;
            
            if (scrollY >= (sectionTop - 200) && scrollY < (sectionTop + sectionHeight)) {
                elements.skillBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    requestAnimationFrame(() => {
                        bar.style.width = width;
                    });
                });
            }
        }, 100);
        
        window.addEventListener('scroll', animateSkills, { passive: true });
    }
};

// Form Management
const formManager = {
    init() {
        if (!elements.contactForm) return;
        this.setupValidation();
        this.setupSubmission();
    },
    
    setupValidation() {
        const inputs = elements.contactForm.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    },
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                    isValid = false;
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;
            case 'subject':
                if (value.length < 3) {
                    errorMessage = 'Subject must be at least 3 characters';
                    isValid = false;
                }
                break;
            case 'message':
                if (value.length < 10) {
                    errorMessage = 'Message must be at least 10 characters';
                    isValid = false;
                }
                break;
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    },
    
    showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        formGroup.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
        }
        
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', errorElement?.id || `${field.name}-error`);
    },
    
    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
    },
    
    setupSubmission() {
        elements.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
    },
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(elements.contactForm);
        const inputs = elements.contactForm.querySelectorAll('input, textarea');
        
        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            showNotification('Please correct the errors and try again', 'error');
            return;
        }
        
        // Simulate form submission
        this.submitForm(formData);
    },
    
    async submitForm(formData) {
        const submitButton = elements.contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Update button state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            elements.contactForm.reset();
        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
};

// Enhanced Features
const enhancedFeatures = {
    init() {
        this.setupKeyboardNavigation();
        this.setupLoadingAnimation();
        this.setupEasterEgg();
        this.addDynamicStyles();
    },
    
    setupKeyboardNavigation() {
        // Escape key closes mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.isMenuOpen) {
                navigationManager.closeMobileMenu();
            }
        });
        
        // Tab navigation for filter buttons
        elements.filterButtons.forEach((button, index) => {
            button.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    const nextIndex = (index + 1) % elements.filterButtons.length;
                    elements.filterButtons[nextIndex].focus();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prevIndex = (index - 1 + elements.filterButtons.length) % elements.filterButtons.length;
                    elements.filterButtons[prevIndex].focus();
                }
            });
        });
    },
    
    setupLoadingAnimation() {
        // Smooth page load animation
        window.addEventListener('load', () => {
            document.body.style.opacity = '0';
            requestAnimationFrame(() => {
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '1';
            });
        });
    },
    
    setupEasterEgg() {
        // Konami code: ↑↑↓↓←→←→BA
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let konamiIndex = 0;
        
        document.addEventListener('keydown', (e) => {
            if (e.key === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    this.activateEasterEgg();
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        });
    },
    
    activateEasterEgg() {
        showNotification('🎮 Konami Code Activated! You found the Easter Egg!', 'success');
        document.body.style.animation = 'rainbow 2s ease';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    },
    
    addDynamicStyles() {
        const styles = `
            .nav-link.active {
                color: var(--accent-color);
            }
            
            .nav-link.active::after {
                width: 100%;
            }
            
            .hamburger.active span:nth-child(1) {
                transform: rotate(-45deg) translate(-5px, 6px);
            }
            
            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }
            
            .hamburger.active span:nth-child(3) {
                transform: rotate(45deg) translate(-5px, -6px);
            }
            
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                25% { filter: hue-rotate(90deg); }
                50% { filter: hue-rotate(180deg); }
                75% { filter: hue-rotate(270deg); }
                100% { filter: hue-rotate(360deg); }
            }
            
            .form-group.focused input,
            .form-group.focused textarea {
                border-color: var(--accent-color);
                box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.2);
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
};

// Application Initialization
const app = {
    init() {
        // Initialize all modules
        themeManager.init();
        typingAnimation.init();
        projectManager.init();
        navigationManager.init();
        animationManager.init();
        formManager.init();
        enhancedFeatures.init();
        
        console.log('🎬 Modern Portfolio loaded successfully!');
        console.log('🚀 Features: Clean code, accessibility, performance optimizations');
        console.log('🎮 Try the Konami code for an Easter egg!');
    }
};

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}
