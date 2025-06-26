/**
 * Main JavaScript file for Naya Sawera Foundation website
 * Handles general functionality, navigation, forms, and UI interactions
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    initializeNavigation();
    initializeForms();
    initializeModals();
    initializeAccessibility();
    initializeAnimations();
    initializeUtilities();
}

/**
 * Navigation functionality
 */
function initializeNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            const isHidden = mobileMenu.classList.contains('hidden');
            
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileMenu && !mobileMenu.contains(event.target) && 
            !mobileMenuBtn.contains(event.target) && 
            !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Form handling and validation
 */
function initializeForms() {
    // Newsletter subscription form
    const newsletterForms = document.querySelectorAll('form[action*="newsletter"]');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const email = form.querySelector('input[type="email"]');
            if (email && !validateEmail(email.value)) {
                e.preventDefault();
                showError(email, 'Please enter a valid email address');
                return false;
            }
        });
    });
    
    // Contact forms
    const contactForms = document.querySelectorAll('form[action*="contact"], form[action*="report"]');
    contactForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(form)) {
                e.preventDefault();
                return false;
            }
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                showLoading(submitBtn);
            }
        });
    });
    
    // Real-time validation
    document.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Clear validation on input
        field.addEventListener('input', function() {
            clearValidation(this);
        });
    });
}

/**
 * Modal functionality
 */
function initializeModals() {
    // Generic modal close functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-backdrop')) {
            closeModal(e.target.querySelector('.modal-content'));
        }
    });
    
    // Escape key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal-backdrop:not(.hidden)');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
}

/**
 * Accessibility enhancements
 */
function initializeAccessibility() {
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView();
            }
        });
    }
    
    // Focus management for modals
    document.addEventListener('focusin', function(e) {
        const modal = e.target.closest('.modal-backdrop');
        if (modal && !modal.classList.contains('hidden')) {
            // Keep focus within modal
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.target === modal) {
                firstElement.focus();
            }
        }
    });
    
    // Announce dynamic content changes
    createAriaLiveRegion();
}

/**
 * Animation and scroll effects
 */
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    document.querySelectorAll('.hover-lift, .stats-card, .event-card').forEach(el => {
        observer.observe(el);
    });
    
    // Parallax effect for hero sections
    const heroSections = document.querySelectorAll('[class*="hero"]');
    if (heroSections.length > 0) {
        window.addEventListener('scroll', throttle(handleParallax, 16));
    }
}

/**
 * Utility functions initialization
 */
function initializeUtilities() {
    // Lazy loading for images
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    } else {
        // Fallback for older browsers
        loadLazyImages();
    }
    
    // Initialize tooltips
    initializeTooltips();
    
    // Progress bars animation
    animateProgressBars();
    
    // Copy to clipboard functionality
    initializeCopyButtons();
}

/**
 * Form validation functions
 */
function validateForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('input, textarea, select');
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.required;
    
    // Clear previous validation
    clearValidation(field);
    
    // Required field validation
    if (required && !value) {
        showError(field, 'This field is required');
        return false;
    }
    
    // Type-specific validation
    if (value) {
        switch (type) {
            case 'email':
                if (!validateEmail(value)) {
                    showError(field, 'Please enter a valid email address');
                    return false;
                }
                break;
            case 'tel':
                if (!validatePhone(value)) {
                    showError(field, 'Please enter a valid phone number');
                    return false;
                }
                break;
            case 'url':
                if (!validateUrl(value)) {
                    showError(field, 'Please enter a valid URL');
                    return false;
                }
                break;
            case 'number':
                const min = field.min;
                const max = field.max;
                const numValue = parseFloat(value);
                
                if (isNaN(numValue)) {
                    showError(field, 'Please enter a valid number');
                    return false;
                }
                
                if (min && numValue < parseFloat(min)) {
                    showError(field, `Value must be at least ${min}`);
                    return false;
                }
                
                if (max && numValue > parseFloat(max)) {
                    showError(field, `Value must be no more than ${max}`);
                    return false;
                }
                break;
        }
    }
    
    // Show success for valid fields
    if (value && required) {
        showSuccess(field);
    }
    
    return true;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
}

function validateUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function showError(field, message) {
    field.classList.add('invalid');
    field.classList.remove('valid');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    errorDiv.setAttribute('role', 'alert');
    field.parentNode.appendChild(errorDiv);
    
    // Announce to screen readers
    announceToScreenReader(message);
}

function showSuccess(field) {
    field.classList.add('valid');
    field.classList.remove('invalid');
    
    // Remove existing messages
    const existingMessage = field.parentNode.querySelector('.form-error, .form-success');
    if (existingMessage) {
        existingMessage.remove();
    }
}

function clearValidation(field) {
    field.classList.remove('invalid', 'valid');
    const existingMessage = field.parentNode.querySelector('.form-error, .form-success');
    if (existingMessage) {
        existingMessage.remove();
    }
}

/**
 * UI feedback functions
 */
function showLoading(button) {
    const originalText = button.textContent;
    button.disabled = true;
    button.innerHTML = '<span class="loading-spinner mr-2"></span>Submitting...';
    
    // Store original text for restoration
    button.dataset.originalText = originalText;
}

function hideLoading(button) {
    button.disabled = false;
    button.innerHTML = button.dataset.originalText || 'Submit';
    delete button.dataset.originalText;
}

function closeModal(modal) {
    if (modal) {
        const backdrop = modal.closest('.modal-backdrop');
        if (backdrop) {
            backdrop.classList.add('hidden');
        }
    }
}

/**
 * Animation and scroll functions
 */
function handleParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.parallax || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.dataset.width || '0%';
                
                setTimeout(() => {
                    bar.style.width = width;
                }, 200);
                
                observer.unobserve(bar);
            }
        });
    });
    
    progressBars.forEach(bar => observer.observe(bar));
}

/**
 * Utility functions
 */
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
    }
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function loadLazyImages() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('focus', showTooltip);
        element.addEventListener('blur', hideTooltip);
    });
}

function showTooltip(e) {
    const element = e.target;
    const text = element.dataset.tooltip;
    
    if (!text) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip absolute bg-gray-800 text-white text-sm px-2 py-1 rounded z-50';
    tooltip.textContent = text;
    tooltip.id = 'tooltip-' + Date.now();
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
    
    element.setAttribute('aria-describedby', tooltip.id);
}

function hideTooltip(e) {
    const element = e.target;
    const tooltipId = element.getAttribute('aria-describedby');
    
    if (tooltipId) {
        const tooltip = document.getElementById(tooltipId);
        if (tooltip) {
            tooltip.remove();
        }
        element.removeAttribute('aria-describedby');
    }
}

function initializeCopyButtons() {
    const copyButtons = document.querySelectorAll('[data-copy]');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const text = this.dataset.copy;
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    showCopySuccess(this);
                });
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showCopySuccess(this);
            }
        });
    });
}

function showCopySuccess(button) {
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.classList.add('bg-green-600');
    
    setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('bg-green-600');
    }, 2000);
}

/**
 * Accessibility functions
 */
function createAriaLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
}

function announceToScreenReader(message) {
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
        liveRegion.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

/**
 * Error handling and logging
 */
function handleError(error, context = '') {
    console.error(`Error in ${context}:`, error);
    
    // Show user-friendly error message
    showNotification('An error occurred. Please try again.', 'error');
}

function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${getNotificationClass(type)}`;
    notification.innerHTML = `
        <div class="flex items-start">
            <div class="flex-shrink-0">
                <i class="fas ${getNotificationIcon(type)} text-lg" aria-hidden="true"></i>
            </div>
            <div class="ml-3">
                <p class="text-sm font-medium">${message}</p>
            </div>
            <div class="ml-4">
                <button class="text-current hover:opacity-75" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-times" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after duration
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, duration);
}

function getNotificationClass(type) {
    const classes = {
        success: 'bg-green-50 border border-green-200 text-green-800',
        error: 'bg-red-50 border border-red-200 text-red-800',
        warning: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border border-blue-200 text-blue-800'
    };
    return classes[type] || classes.info;
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Global error handler
window.addEventListener('error', function(e) {
    handleError(e.error, 'Global');
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    handleError(e.reason, 'Promise');
});

// Export functions for use in other scripts
window.NayaSawera = {
    validateEmail,
    validatePhone,
    validateUrl,
    showNotification,
    announceToScreenReader,
    throttle,
    debounce
};
