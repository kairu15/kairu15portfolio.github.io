// Netflix-Inspired Portfolio JavaScript

// DOM Elements
const navbar = document.querySelector('.navbar');
const navMenu = document.querySelector('.nav-menu');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const skillBars = document.querySelectorAll('.skill-progress');
const themeToggle = document.getElementById('theme-toggle');
const projectSearch = document.getElementById('project-search');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const typingText = document.getElementById('typing-text');

// Theme Toggle
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const icon = themeToggle.querySelector('i');
    icon.className = newTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
const icon = themeToggle.querySelector('i');
icon.className = savedTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';

// Typing Animation
const roles = ['Programmer', 'Software Developer', 'Web Designer', 'Full Stack Developer'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(typeWriter, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeWriter, 500);
    } else {
        setTimeout(typeWriter, isDeleting ? 50 : 100);
    }
}

// Start typing animation
typeWriter();

// Project Filtering and Search
function filterProjects() {
    const searchTerm = projectSearch.value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    
    projectCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
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

// Search functionality
projectSearch.addEventListener('input', filterProjects);

// Filter buttons
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        filterProjects();
    });
});

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Animations with Intersection Observer
const observerOptions = {
    threshold: 0.1,
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
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.section-title, .about-text, .stat-item, .project-card, .skill-category, .contact-info, .contact-form');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Enhanced Contact Form Validation
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const formData = new FormData(contactForm);
        
        // Clear previous errors
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });
        
        // Validate name
        const name = formData.get('name').trim();
        if (name.length < 2) {
            showError('name', 'Name must be at least 2 characters');
            isValid = false;
        }
        
        // Validate email
        const email = formData.get('email').trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate subject
        const subject = formData.get('subject').trim();
        if (subject.length < 3) {
            showError('subject', 'Subject must be at least 3 characters');
            isValid = false;
        }
        
        // Validate message
        const message = formData.get('message').trim();
        if (message.length < 10) {
            showError('message', 'Message must be at least 10 characters');
            isValid = false;
        }
        
        if (isValid) {
            // Show success message
            showSuccessMessage();
            contactForm.reset();
        }
    });
}

function showError(fieldName, message) {
    const formGroup = document.getElementById(fieldName).closest('.form-group');
    formGroup.classList.add('error');
    
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function showSuccessMessage() {
    let successElement = document.querySelector('.success-message');
    if (!successElement) {
        successElement = document.createElement('div');
        successElement.className = 'success-message';
        contactForm.insertBefore(successElement, contactForm.firstChild);
    }
    successElement.textContent = 'Message sent successfully! I\'ll get back to you soon.';
    successElement.classList.add('show');
    
    setTimeout(() => {
        successElement.classList.remove('show');
    }, 5000);
}

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 100)) {
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

// Contact Form Handling
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Basic validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate form submission
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
});

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.background = '#46d369';
            break;
        case 'error':
            notification.style.background = '#e50914';
            break;
        default:
            notification.style.background = '#0071eb';
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Skill Bar Animation on Scroll
const animateSkillBars = () => {
    const skillsSection = document.querySelector('#skills');
    
    if (skillsSection) {
        const sectionTop = skillsSection.offsetTop;
        const sectionHeight = skillsSection.clientHeight;
        
        if (scrollY >= (sectionTop - 200) && scrollY < (sectionTop + sectionHeight)) {
            skillBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
        }
    }
};

// Reveal animations on scroll
const revealOnScroll = () => {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
};

// Parallax effect for hero section
const parallaxEffect = () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        hero.style.transform = `translateY(${parallax}px)`;
    }
};

// Typing effect for hero title
const typeWriter = () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = "Hi, I'm ";
        const name = "Kylle Ian D. Acibron";
        heroTitle.innerHTML = '';
        let index = 0;
        
        const type = () => {
            if (index < text.length) {
                heroTitle.innerHTML += text.charAt(index);
                index++;
                setTimeout(type, 50);
            } else {
                // Add the name with accent styling
                heroTitle.innerHTML += `<span class="accent">${name}</span>`;
            }
        };
        
        setTimeout(type, 500);
    }
};

// Project card hover effects
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Add reveal class to elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Add reveal classes to elements
    const elementsToReveal = [
        '.section-title',
        '.about-text p',
        '.stat-item',
        '.project-card',
        '.skill-category',
        '.contact-info',
        '.contact-form'
    ];
    
    elementsToReveal.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.classList.add('reveal');
            element.style.transitionDelay = `${index * 0.1}s`;
        });
    });
    
    // Initialize animations
    typeWriter();
    animateSkillBars();
    revealOnScroll();
});

// Scroll event listeners
window.addEventListener('scroll', () => {
    animateSkillBars();
    revealOnScroll();
    parallaxEffect();
});

// Form input animations
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });
});

// Add CSS for reveal animations
const revealStyles = document.createElement('style');
revealStyles.textContent = `
    .reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .reveal.active {
        opacity: 1;
        transform: translateY(0);
    }
    
    .form-group.focused input,
    .form-group.focused textarea {
        border-color: #e50914;
        box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.2);
    }
    
    .nav-link.active {
        color: #e50914;
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
`;
document.head.appendChild(revealStyles);

// Loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Cursor trail effect (optional enhancement)
const createCursorTrail = () => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-trail';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(229, 9, 20, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: transform 0.1s ease;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Hide cursor trail on mobile
    if (window.innerWidth <= 768) {
        cursor.style.display = 'none';
    }
};

// Initialize cursor trail
createCursorTrail();

// Easter egg: Konami code
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    showNotification('🎮 Konami Code Activated! You found the Easter Egg!', 'success');
    document.body.style.animation = 'rainbow 2s ease';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 2000);
}

// Add rainbow animation for Easter egg
const rainbowStyles = document.createElement('style');
rainbowStyles.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        25% { filter: hue-rotate(90deg); }
        50% { filter: hue-rotate(180deg); }
        75% { filter: hue-rotate(270deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyles);

console.log('🎬 Netflix-Inspired Portfolio loaded successfully!');
console.log('🚀 Features: Smooth scrolling, animations, contact form, and more!');
console.log('🎮 Try the Konami code for an Easter egg!');
