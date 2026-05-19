// =================================
// Global Variables
// =================================
let cart = [];
let currentTestimonial = 0;
let currentFilter = 'all';

// =================================
// Preloader
// =================================
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 1000);
});

// =================================
// Header Scroll Effect
// =================================
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// =================================
// Navigation Active State
// =================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Smooth Scroll for Navigation Links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            mobileMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
});

// =================================
// Mobile Menu Toggle
// =================================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.nav');

mobileMenuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        mobileMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// =================================
// Dark Mode Toggle
// =================================
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const body = document.body;

// Check for saved theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
}

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Save theme preference
    const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    
    // Add animation effect
    darkModeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        darkModeToggle.style.transform = '';
    }, 500);
});

// =================================
// AOS (Animate On Scroll) Implementation
// =================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// =================================
// Product Filter
// =================================
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Get filter value
        const filter = btn.getAttribute('data-filter');
        currentFilter = filter;
        
        // Filter products with animation
        productCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            
            // Add fade out animation
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            }, 300);
        });
    });
});

// =================================
// Shopping Cart Functionality
// =================================
const cartBtn = document.querySelector('.cart-btn');
const cartCount = document.querySelector('.cart-count');
const addToCartBtns = document.querySelectorAll('.btn-add-cart');

// Update cart count display
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Add bounce animation
    cartCount.style.transform = 'scale(1.5)';
    setTimeout(() => {
        cartCount.style.transform = 'scale(1)';
    }, 300);
}

// Add to cart functionality
addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const productCard = btn.closest('.product-card');
        const productTitle = productCard.querySelector('.product-title').textContent;
        const productPrice = productCard.querySelector('.price-current').textContent;
        
        // Check if product already in cart
        const existingItem = cart.find(item => item.title === productTitle);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                title: productTitle,
                price: productPrice,
                quantity: 1
            });
        }
        
        updateCartCount();
        showNotification(`${productTitle} ditambahkan ke keranjang!`);
        
        // Add animation to button
        btn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 200);
    });
});

// Cart button click
cartBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Keranjang belanja Anda kosong');
        return;
    }
    
    let cartItems = 'Keranjang Belanja:\n\n';
    let total = 0;
    
    cart.forEach(item => {
        const price = parseInt(item.price.replace(/\D/g, ''));
        const subtotal = price * item.quantity;
        total += subtotal;
        cartItems += `${item.title}\n${item.quantity} x ${item.price} = Rp ${subtotal.toLocaleString('id-ID')}\n\n`;
    });
    
    cartItems += `Total: Rp ${total.toLocaleString('id-ID')}`;
    alert(cartItems);
});

// =================================
// Testimonials Carousel
// =================================
const testimonialTrack = document.querySelector('.testimonial-track');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const carouselDots = document.querySelector('.carousel-dots');

// Create dots
testimonialCards.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToTestimonial(index));
    carouselDots.appendChild(dot);
});

const dots = document.querySelectorAll('.carousel-dot');

function updateCarousel() {
    const cardWidth = testimonialCards[0].offsetWidth;
    const gap = 30;
    const offset = currentTestimonial * (cardWidth + gap);
    
    testimonialTrack.style.transform = `translateX(-${offset}px)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentTestimonial);
    });
}

function goToTestimonial(index) {
    currentTestimonial = index;
    updateCarousel();
}

function nextSlide() {
    currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    updateCarousel();
}

function prevSlide() {
    currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
    updateCarousel();
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Auto-play carousel
let autoplayInterval = setInterval(nextSlide, 5000);

// Pause autoplay on hover
document.querySelector('.testimonials-carousel').addEventListener('mouseenter', () => {
    clearInterval(autoplayInterval);
});

document.querySelector('.testimonials-carousel').addEventListener('mouseleave', () => {
    autoplayInterval = setInterval(nextSlide, 5000);
});

// Update carousel on window resize
window.addEventListener('resize', updateCarousel);

// =================================
// Contact Form
// =================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Mengirim...</span>';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        showNotification('Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.', 'success');
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
});

// =================================
// Newsletter Form
// =================================
const newsletterForm = document.querySelector('.newsletter-form');

newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input').value;
    
    showNotification(`Terima kasih! ${email} telah berlangganan newsletter kami.`, 'success');
    newsletterForm.reset();
});

// =================================
// Scroll to Top Button
// =================================
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// =================================
// Notification System
// =================================
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 350px;
        animation: slideInRight 0.5s ease;
        font-size: 15px;
        font-weight: 500;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// =================================
// Parallax Effect for Hero
// =================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroShapes = document.querySelectorAll('.hero-shape');
    
    heroShapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// =================================
// Product Quick View (Modal Simulation)
// =================================
const quickViewBtns = document.querySelectorAll('.quick-view');

quickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productCard = btn.closest('.product-card');
        const productTitle = productCard.querySelector('.product-title').textContent;
        const productDescription = productCard.querySelector('.product-description').textContent;
        const productPrice = productCard.querySelector('.price-current').textContent;
        
        showNotification(`Quick View: ${productTitle}\n${productDescription}\nHarga: ${productPrice}`);
    });
});

// =================================
// Smooth Animations for Product Cards
// =================================
productCards.forEach((card, index) => {
    card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    card.style.transitionDelay = `${index * 0.05}s`;
});

// =================================
// Image Lazy Loading Simulation
// =================================
const imagePlaceholders = document.querySelectorAll('.image-placeholder');

imagePlaceholders.forEach(placeholder => {
    placeholder.style.transition = 'opacity 0.5s ease';
    
    // Add shimmer effect
    placeholder.style.background = `
        linear-gradient(90deg, 
            transparent 0%, 
            rgba(255,255,255,0.1) 50%, 
            transparent 100%
        )
    `;
    placeholder.style.backgroundSize = '200% 100%';
    placeholder.style.animation = 'shimmer 2s infinite';
});

// Add shimmer animation
const shimmerStyle = document.createElement('style');
shimmerStyle.textContent = `
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
`;
document.head.appendChild(shimmerStyle);

// =================================
// Enhanced Hover Effects
// =================================
// Add hover sound effect simulation
const interactiveElements = document.querySelectorAll('.btn, .product-card, .feature-card, .blog-card');

interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// =================================
// Counter Animation for Stats
// =================================
const statNumbers = document.querySelectorAll('.stat-number');

function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = element.textContent.replace(/\d+/, target);
            clearInterval(timer);
        } else {
            element.textContent = element.textContent.replace(/\d+/, Math.floor(current));
        }
    }, 16);
}

// Trigger counter animation when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            statNumbers.forEach(stat => animateCounter(stat));
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// =================================
// Dynamic Year in Footer
// =================================
const updateFooterYear = () => {
    const yearElements = document.querySelectorAll('.footer-bottom p');
    yearElements.forEach(el => {
        if (el.textContent.includes('2026')) {
            el.textContent = el.textContent.replace('2026', new Date().getFullYear());
        }
    });
};

updateFooterYear();

// =================================
// Performance Optimization
// =================================
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy functions
window.addEventListener('scroll', debounce(() => {
    // Scroll-dependent code here
}, 10));

// =================================
// Accessibility Enhancements
// =================================
// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Arrow keys for carousel navigation
    if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// Add focus styles for keyboard navigation
const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
focusableElements.forEach(element => {
    element.addEventListener('focus', () => {
        element.style.outline = '3px solid var(--primary)';
        element.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', () => {
        element.style.outline = '';
        element.style.outlineOffset = '';
    });
});

// =================================
// Console Welcome Message
// =================================
console.log('%c🌟 Selamat Datang di Toko Lucky! 🌟', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cWebsite dibuat dengan ❤️ menggunakan HTML, CSS, dan JavaScript', 'color: #764ba2; font-size: 14px;');
console.log('%c© 2026 Toko Sembako Lucky - All Rights Reserved', 'color: #4a5568; font-size: 12px;');

// =================================
// Initialize on Load
// =================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Website fully loaded and interactive!');
    
    // Add entrance animation to hero elements
    const heroElements = document.querySelectorAll('.hero-text > *');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        setTimeout(() => {
            el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100 + 1000);
    });
});

// =================================
// Service Worker Registration (Optional)
// =================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}




// Timeline Animation
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const marker = entry.target.querySelector('.timeline-marker');
                const content = entry.target.querySelector('.timeline-content');
                
                // Animate marker
                marker.style.transform = 'scale(0)';
                marker.style.opacity = '0';
                
                setTimeout(() => {
                    marker.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    marker.style.transform = 'scale(1)';
                    marker.style.opacity = '1';
                }, 200);
                
                // Animate content
                content.style.transform = 'translateX(-20px)';
                content.style.opacity = '0';
                
                setTimeout(() => {
                    content.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s';
                    content.style.transform = 'translateX(0)';
                    content.style.opacity = '1';
                }, 400);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initTimelineAnimation();
});


// =================================
// PRODUCT IMAGE INTERACTIONS
// =================================

// 1. Quick View Modal untuk Gambar
const quickViewButtons = document.querySelectorAll('.quick-view');

quickViewButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const productCard = this.closest('.product-card');
        const productImage = productCard.querySelector('.product-img');
        const productTitle = productCard.querySelector('.product-title').textContent;
        const productPrice = productCard.querySelector('.price-current').textContent;
        const productDescription = productCard.querySelector('.product-description').textContent;
        
        // Ambil sumber gambar (gunakan placeholder jika gambar error)
        let imageSrc = '';
        if (productImage && productImage.src && !productImage.src.includes('placeholder')) {
            imageSrc = productImage.src;
        }
        
        // Tampilkan modal
        showImageModal({
            title: productTitle,
            price: productPrice,
            description: productDescription,
            imageSrc: imageSrc,
            productId: this.dataset.product
        });
    });
});

// 2. Fungsi untuk menampilkan modal gambar
function showImageModal(product) {
    // Hapus modal yang ada
    const existingModal = document.querySelector('.image-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Buat HTML modal
    const modalHTML = `
        <div class="image-modal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        ">
            <div class="modal-container" style="
                max-width: 90%;
                max-height: 90%;
                position: relative;
                animation: slideUp 0.4s ease;
            ">
                <button class="modal-close" style="
                    position: absolute;
                    top: -40px;
                    right: 0;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 30px;
                    cursor: pointer;
                    z-index: 10;
                ">×</button>
                
                <div class="modal-content" style="
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                    max-width: 500px;
                ">
                    <div class="modal-image" style="
                        width: 100%;
                        height: 300px;
                        background: #f8fafc;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        ${product.imageSrc ? 
                            `<img src="${product.imageSrc}" alt="${product.title}" 
                                  style="width: 100%; height: 100%; object-fit: cover;">` 
                            : 
                            `<div style="font-size: 60px;">🌾</div>`
                        }
                    </div>
                    
                    <div style="padding: 30px;">
                        <h3 style="margin: 0 0 10px 0; color: #1a202c; font-size: 22px;">
                            ${product.title}
                        </h3>
                        
                        <p style="color: #718096; margin-bottom: 15px; font-size: 15px;">
                            ${product.description}
                        </p>
                        
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="font-size: 24px; font-weight: 700; color: #667eea;">
                                ${product.price}
                            </div>
                            
                            <button class="modal-add-cart" style="
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                color: white;
                                border: none;
                                padding: 12px 25px;
                                border-radius: 10px;
                                font-weight: 600;
                                cursor: pointer;
                                transition: all 0.3s ease;
                            ">
                                <span>Tambah ke Keranjang</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Tambah modal ke body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Tambah style animasi
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(50px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Event listener untuk modal
    const modal = document.querySelector('.image-modal');
    const closeBtn = modal.querySelector('.modal-close');
    const addCartBtn = modal.querySelector('.modal-add-cart');
    
    // Tutup modal
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Escape key untuk tutup
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal) {
            closeModal();
        }
    });
    
    // Tambah ke keranjang
    addCartBtn.addEventListener('click', function() {
        addToCart(product.productId, product.title, product.price);
        showNotification(`✓ ${product.title} ditambahkan ke keranjang`);
        closeModal();
    });
    
    function closeModal() {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (modal && modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

// 3. Fungsi tambah ke keranjang
function addToCart(productId, title, price) {
    // Ambil keranjang dari localStorage atau buat baru
    let cart = JSON.parse(localStorage.getItem('tokoLuckyCart')) || [];
    
    // Cek apakah produk sudah ada di keranjang
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            title: title,
            price: price,
            quantity: 1,
            date: new Date().toISOString()
        });
    }
    
    // Simpan ke localStorage
    localStorage.setItem('tokoLuckyCart', JSON.stringify(cart));
    
    // Update tampilan keranjang
    updateCartCount();
}

// 4. Update jumlah keranjang
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('tokoLuckyCart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
        
        // Animasi
        cartCount.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 300);
    }
}

// 5. Fungsi notifikasi
function showNotification(message) {
    // Hapus notifikasi lama
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) {
        oldNotification.remove();
    }
    
    // Buat notifikasi baru
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(67, 233, 123, 0.4);
        z-index: 10000;
        animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    // Hapus setelah 3 detik
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// 6. Initialize saat halaman load
document.addEventListener('DOMContentLoaded', function() {
    // Update jumlah keranjang
    updateCartCount();
    
    // Lazy load images
    const images = document.querySelectorAll('.product-img');
    images.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    });
});


const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '.')));
app.use('/gambar', express.static(path.join(__dirname, 'gambar')));

// API untuk produk
const products = [
    {
        id: 1,
        name: "Beras Premium Pandan Wangi",
        description: "Beras premium kualitas terbaik dengan aroma pandan alami",
        rating: 5,
        ratingCount: 127,
        category: "beras",
        badge: "best-seller",
        image: "gambar/beras1.jpeg"
    },
    {
        id: 2,
        name: "Minyak Goreng Sehat",
        description: "Minyak goreng berkualitas tinggi dan ekonomis",
        rating: 3,
        ratingCount: 89,
        category: "minyak",
        badge: null,
        image: "gambar/minyakk.jpg"
    },
    {
        id: 3,
        name: "Mie Instan Goreng",
        description: "Mie instan praktis dengan rasa gurih khas",
        rating: 5,
        ratingCount: 234,
        category: "mie",
        badge: null,
        image: "gambar/mie1.jpg"
    },
    {
        id: 4,
        name: "Aneka Bumbu Dapur",
        description: "Aneka bumbu Dapur Royco, Desaku & Masako",
        rating: 3,
        ratingCount: 56,
        category: "bumbu",
        badge: "new",
        image: "gambar/bumbum1.png"
    },
    {
        id: 5,
        name: "Beras Mentari Kualitas A",
        description: "Beras Mentari pilihan terbaik untuk keluarga Indonesia",
        rating: 5,
        ratingCount: 178,
        category: "beras",
        badge: null,
        image: "gambar/Beras mentari.jpeg"
    },
    {
        id: 6,
        name: "Mie Instan Soto",
        description: "Mie kuah dengan Soto yang lezat",
        rating: 5,
        ratingCount: 145,
        category: "mie",
        badge: null,
        image: "gambar/Mie Instan Indomie Rasa Soto mie 5pcs, Pra...jpg"
    }
];

// API Routes
// 1. Get all products
app.get('/api/products', (req, res) => {
    res.json({
        success: true,
        count: products.length,
        data: products
    });
});

// 2. Get products by category
app.get('/api/products/category/:category', (req, res) => {
    const category = req.params.category;
    const filteredProducts = products.filter(product => 
        category === 'all' ? true : product.category === category
    );
    
    res.json({
        success: true,
        count: filteredProducts.length,
        data: filteredProducts
    });
});

// 3. Get product by ID
app.get('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }
    
    res.json({
        success: true,
        data: product
    });
});

// 4. Get best seller products
app.get('/api/products/best-seller', (req, res) => {
    const bestSellers = products.filter(product => product.badge === 'best-seller');
    
    res.json({
        success: true,
        count: bestSellers.length,
        data: bestSellers
    });
});

// 5. Search products
app.get('/api/products/search/:query', (req, res) => {
    const query = req.params.query.toLowerCase();
    const searchedProducts = products.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
    );
    
    res.json({
        success: true,
        count: searchedProducts.length,
        data: searchedProducts
    });
});

// 6. Get rating stars (helper function API)
app.get('/api/utils/rating-stars/:rating', (req, res) => {
    const rating = parseInt(req.params.rating);
    let stars = '';
    
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '★' : '☆';
    }
    
    res.json({
        success: true,
        rating: rating,
        stars: stars
    });
});

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API Documentation:`);
    console.log(`  GET /api/products - Get all products`);
    console.log(`  GET /api/products/category/:category - Get products by category`);
    console.log(`  GET /api/products/:id - Get product by ID`);
    console.log(`  GET /api/products/best-seller - Get best seller products`);
    console.log(`  GET /api/products/search/:query - Search products`);
});





// Fungsi untuk memperbaiki gambar yang bermasalah
function fixProductImages() {
    const productImages = document.querySelectorAll('.product-img');
    
    productImages.forEach(img => {
        // Pastikan semua gambar memiliki atribut yang benar
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        if (!img.hasAttribute('alt')) {
            const productTitle = img.closest('.product-card')?.querySelector('.product-title')?.textContent || 'Produk';
            img.setAttribute('alt', productTitle);
        }
        
        // Perbaiki gambar yang error
        img.onerror = function() {
            console.warn(`Gambar gagal dimuat: ${this.src}`);
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjBmNGY4Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjQwIiBmb250LWZhbWlseT0iQXJpYWwiPjB4MDA8L3RleHQ+Cjwvc3ZnPgo=';
            this.alt = 'Gambar tidak tersedia';
        };
    });
    
    console.log(`${productImages.length} gambar produk telah diperiksa`);
}

// Panggil fungsi setelah halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    fixProductImages();
    
    // Perbaikan tambahan untuk carousel
    setTimeout(() => {
        const carousels = document.querySelectorAll('.swiper');
        carousels.forEach(carousel => {
            if (carousel.swiper) {
                carousel.swiper.update();
            }
        });
    }, 100);
});






// ===== BLOG FUNCTIONALITY =====

// Fungsi untuk inisialisasi blog
function initializeBlog() {
    const blogCards = document.querySelectorAll('.blog-card');
    const readMoreButtons = document.querySelectorAll('.btn-read-more');
    
    // Hover effect untuk blog cards
    blogCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
            card.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        });
    });
    
    // Read more button functionality
    readMoreButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const blogCard = button.closest('.blog-card');
            const blogLink = blogCard.querySelector('.blog-link');
            const blogTitle = blogCard.querySelector('.blog-title').textContent;
            
            if (blogLink) {
                // Tampilkan konfirmasi sebelum membuka link
                if (confirm(`Buka artikel: "${blogTitle}"?`)) {
                    window.open(blogLink.href, '_blank');
                }
            }
        });
    });
    
    // Preload blog images
    preloadBlogImages();
}

// Fungsi untuk preload gambar blog
function preloadBlogImages() {
    const blogImages = [
        'gambar/blog-tips-penyimpanan.jpg',
        'gambar/blog-resep-mie.jpg',
        'gambar/blog-hemat-belanja.jpg',
        'gambar/blog-pilih-beras.jpg'
    ];
    
    blogImages.forEach(src => {
        const img = new Image();
        img.onload = function() {
            console.log(`✅ Gambar blog dimuat: ${src}`);
        };
        img.onerror = function() {
            console.warn(`⚠️ Gambar blog tidak ditemukan: ${src}`);
            // Fallback ke placeholder
            const blogCards = document.querySelectorAll('.blog-img');
            blogCards.forEach(cardImg => {
                if (cardImg.src.includes(src) || cardImg.alt.toLowerCase().includes(src.split('-')[1])) {
                    cardImg.src = `data:image/svg+xml;base64,${btoa(`
                        <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
                            <rect width="600" height="400" fill="#f3f4f6"/>
                            <text x="300" y="210" text-anchor="middle" font-family="Arial" font-size="40" fill="#6b7280">📝 Blog</text>
                        </svg>
                    `)}`;
                    cardImg.alt = 'Gambar blog placeholder';
                }
            });
        };
        img.src = src;
    });
}

// Fungsi untuk fetch blog data dari API (jika ada)
async function fetchBlogPosts() {
    try {
        const response = await fetch('/api/blog');
        if (response.ok) {
            const blogData = await response.json();
            console.log('Blog posts loaded:', blogData);
            return blogData;
        }
    } catch (error) {
        console.warn('Could not fetch blog posts:', error);
        return null;
    }
}

// ===== MAIN INITIALIZATION =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize products functionality
    initializeProducts();
    
    // Initialize blog functionality
    initializeBlog();
    
    // Fix images (fungsi yang sudah ada)
    fixProductImages();
});

// ===== EXISTING PRODUCTS FUNCTIONS (dipertahankan) =====

function initializeProducts() {
    // Get filter buttons and product cards
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    // Add click event to each filter button
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter value
            const filterValue = button.getAttribute('data-filter');
            
            // Filter products
            productCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'block';
                } else {
                    const category = card.getAttribute('data-category');
                    if (category === filterValue) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
    
    // Quick View Button Functionality
    const quickViewButtons = document.querySelectorAll('.quick-view');
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const productCard = button.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productDescription = productCard.querySelector('.product-description').textContent;
            
            // Create modal for product details
            showProductDetail(productTitle, productDescription);
        });
    });
}

function fixProductImages() {
    const productImages = document.querySelectorAll('.product-img');
    
    productImages.forEach(img => {
        // Pastikan semua gambar memiliki atribut yang benar
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        if (!img.hasAttribute('alt')) {
            const productTitle = img.closest('.product-card')?.querySelector('.product-title')?.textContent || 'Produk';
            img.setAttribute('alt', productTitle);
        }
        
        // Perbaiki gambar yang error
        img.onerror = function() {
            console.warn(`Gambar gagal dimuat: ${this.src}`);
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjBmNGY4Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjQwIiBmb250LWZhbWlseT0iQXJpYWwiPjB4MDA8L3RleHQ+Cjwvc3ZnPgo=';
            this.alt = 'Gambar tidak tersedia';
        };
    });
}

function showProductDetail(title, description) {
    // ... kode modal yang sudah ada ...
}



// HAPUS SEMUA EVENT STICKY NAVBAR
document.addEventListener('DOMContentLoaded', function() {
    // Hapus scroll event listener yang bikin sticky
    window.onscroll = null;
    
    // Hapus class sticky/fixed dari header
    const header = document.querySelector('header, .header, .navbar');
    if(header) {
        header.classList.remove('fixed', 'sticky', 'scrolled', 'active');
        header.style.position = 'static';
        header.style.top = 'auto';
    }
    
    // Hapus body padding
    document.body.style.paddingTop = '0';
});





// =================================
// TIMELINE TOGGLE FUNCTIONALITY
// =================================

document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('timelineToggleBtn');
    const extraTimeline = document.querySelector('.extra-timeline');
    let isExpanded = false;
    
    if (toggleBtn && extraTimeline) {
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!isExpanded) {
                // Tampilkan timeline tambahan
                extraTimeline.style.display = 'block';
                
                // Scroll ke timeline tambahan dengan smooth
                setTimeout(() => {
                    extraTimeline.querySelector('.timeline-item').scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 100);
                
                // Ubah teks dan ikon
                toggleBtn.querySelector('.btn-text').textContent = 'Lihat Lebih Sedikit';
                toggleBtn.classList.add('active');
                isExpanded = true;
                
            } else {
                // Sembunyikan timeline tambahan
                extraTimeline.style.display = 'none';
                
                // Ubah teks dan ikon
                toggleBtn.querySelector('.btn-text').textContent = 'Baca Selengkapnya';
                toggleBtn.classList.remove('active');
                isExpanded = false;
            }
        });
    }
});



// =================================
// TOKO RADITYA - TIMELINE INTERACTIONS
// =================================

document.addEventListener('DOMContentLoaded', function() {
    
    // =================================
    // 1. SCROLL ANIMATION FOR TIMELINE
    // =================================
    
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const marker = entry.target.querySelector('.timeline-marker');
                const content = entry.target.querySelector('.timeline-content');
                
                if (marker) {
                    marker.style.animation = 'popIn 0.5s ease forwards';
                }
                
                if (content) {
                    content.style.animation = 'slideIn 0.5s ease forwards';
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
    
    // =================================
    // 2. VALUE CARDS ANIMATION
    // =================================
    
    const valueCards = document.querySelectorAll('.value-card');
    
    const valueObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                valueObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    valueCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        valueObserver.observe(card);
    });
    
    // =================================
    // 3. COUNTER ANIMATION
    // =================================
    
    const badgeNumber = document.querySelector('.badge-number');
    
    if (badgeNumber) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(badgeNumber.textContent);
                    let current = 0;
                    const duration = 2000;
                    const step = target / (duration / 16);
                    
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            badgeNumber.textContent = target;
                            clearInterval(timer);
                        } else {
                            badgeNumber.textContent = Math.floor(current);
                        }
                    }, 16);
                    
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counterObserver.observe(badgeNumber);
    }
    
    // =================================
    // 4. HOVER EFFECT FOR VALUE CARDS
    // =================================
    
    valueCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.value-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'all 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.value-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // =================================
    // 5. ANIMATION KEYFRAMES (add to head)
    // =================================
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes popIn {
            0% {
                opacity: 0;
                transform: scale(0.3);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        @keyframes slideIn {
            0% {
                opacity: 0;
                transform: translateX(-30px);
            }
            100% {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes fadeInUp {
            0% {
                opacity: 0;
                transform: translateY(30px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .timeline-marker {
            opacity: 0;
            transform: scale(0.3);
        }
        
        .timeline-content {
            opacity: 0;
            transform: translateX(-30px);
        }
    `;
    document.head.appendChild(style);
    
    console.log('✅ Toko Raditya Timeline siap!');
});


// ============================================
// INITIALIZE AOS ANIMATION
// ============================================
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// ============================================
// INITIALIZE SWIPER CAROUSELS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    
    // Carousel 1: Mie Instan Goreng
    const mieGorengCarousel = new Swiper('#mieGorengCarousel', {
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '#mieGorengCarousel .swiper-button-next',
            prevEl: '#mieGorengCarousel .swiper-button-prev',
        },
        pagination: {
            el: '#mieGorengCarousel .swiper-pagination',
            clickable: true,
        },
        on: {
            slideChange: function() {
                updateCarouselIndicator(this, 'mieGorengCarousel');
            }
        }
    });

    // Carousel 2: Bumbu Dapur
    const bumbuCarousel = new Swiper('#bumbuCarousel', {
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '#bumbuCarousel .swiper-button-next',
            prevEl: '#bumbuCarousel .swiper-button-prev',
        },
        pagination: {
            el: '#bumbuCarousel .swiper-pagination',
            clickable: true,
        },
        on: {
            slideChange: function() {
                updateCarouselIndicator(this, 'bumbuCarousel');
            }
        }
    });

    // Carousel 3: Mie Instan Soto
    const mieSotoCarousel = new Swiper('#mieSotoCarousel', {
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '#mieSotoCarousel .swiper-button-next',
            prevEl: '#mieSotoCarousel .swiper-button-prev',
        },
        pagination: {
            el: '#mieSotoCarousel .swiper-pagination',
            clickable: true,
        },
        on: {
            slideChange: function() {
                updateCarouselIndicator(this, 'mieSotoCarousel');
            }
        }
    });

    // Fungsi update indikator slide
    function updateCarouselIndicator(swiper, carouselId) {
        const card = document.querySelector(`#${carouselId}`).closest('.product-card');
        const currentSlideElement = card.querySelector('.current-slide');
        const totalSlidesElement = card.querySelector('.total-slides');
        
        if (currentSlideElement && totalSlidesElement) {
            const currentSlide = swiper.realIndex + 1;
            const totalSlides = swiper.slides.length - (swiper.params.loop ? 2 : 0);
            
            currentSlideElement.textContent = currentSlide;
            totalSlidesElement.textContent = totalSlides;
        }
    }

    // Inisialisasi awal indikator
    updateCarouselIndicator(mieGorengCarousel, 'mieGorengCarousel');
    updateCarouselIndicator(bumbuCarousel, 'bumbuCarousel');
    updateCarouselIndicator(mieSotoCarousel, 'mieSotoCarousel');

    // ============================================
    // PRODUCT FILTER FUNCTIONALITY
    // ============================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Get filter value
            const filter = btn.getAttribute('data-filter');
            
            // Filter products
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ============================================
    // QUICK VIEW FUNCTIONALITY
    // ============================================
    const quickViewBtns = document.querySelectorAll('.quick-view');
    
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const productName = btn.getAttribute('data-product');
            showNotification(`🔍 Quick View: ${productName}`);
        });
    });

    // ============================================
    // NOTIFICATION FUNCTION
    // ============================================
    function showNotification(message) {
        // Hapus notifikasi lama
        const oldNotif = document.querySelector('.custom-notification');
        if (oldNotif) oldNotif.remove();
        
        // Buat notifikasi baru
        const notif = document.createElement('div');
        notif.className = 'custom-notification';
        notif.textContent = message;
        notif.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 12px 24px;
            border-radius: 10px;
            font-weight: 500;
            z-index: 9999;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(notif);
        
        // Hapus setelah 2 detik
        setTimeout(() => {
            notif.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 2000);
    }

    // Tambah CSS untuk animasi notifikasi
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});


// ============================================
// INITIALIZE AOS ANIMATION
// ============================================
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// ============================================
// TIMELINE ANIMATION ON SCROLL
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const marker = entry.target.querySelector('.timeline-marker');
                const content = entry.target.querySelector('.timeline-content');
                
                // Animasi marker
                if (marker) {
                    marker.style.opacity = '0';
                    marker.style.transform = 'scale(0.5)';
                    
                    setTimeout(() => {
                        marker.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        marker.style.opacity = '1';
                        marker.style.transform = 'scale(1)';
                    }, 200);
                }
                
                // Animasi content
                if (content) {
                    content.style.opacity = '0';
                    content.style.transform = 'translateX(-20px)';
                    
                    setTimeout(() => {
                        content.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s';
                        content.style.opacity = '1';
                        content.style.transform = 'translateX(0)';
                    }, 400);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Set initial state untuk setiap timeline item
    timelineItems.forEach(item => {
        const marker = item.querySelector('.timeline-marker');
        const content = item.querySelector('.timeline-content');
        
        if (marker) {
            marker.style.opacity = '0';
            marker.style.transform = 'scale(0.5)';
        }
        
        if (content) {
            content.style.opacity = '0';
            content.style.transform = 'translateX(-20px)';
        }
        
        observer.observe(item);
    });
    
    // ============================================
    // COUNTER ANIMATION FOR BADGE
    // ============================================
    
    const badgeNumber = document.querySelector('.badge-number');
    
    if (badgeNumber) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetNumber = parseInt(badgeNumber.textContent);
                    let currentNumber = 0;
                    const duration = 2000;
                    const step = targetNumber / (duration / 16);
                    
                    const timer = setInterval(() => {
                        currentNumber += step;
                        if (currentNumber >= targetNumber) {
                            badgeNumber.textContent = targetNumber;
                            clearInterval(timer);
                        } else {
                            badgeNumber.textContent = Math.floor(currentNumber);
                        }
                    }, 16);
                    
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counterObserver.observe(badgeNumber);
    }
    
    // ============================================
    // HOVER EFFECT FOR VALUE CARDS
    // ============================================
    
    const valueCards = document.querySelectorAll('.value-card');
    
    valueCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.value-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'all 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.value-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // ============================================
    // ADD ANIMATION STYLES
    // ============================================
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .timeline-marker {
            transition: all 0.3s ease;
        }
        
        .timeline-content {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    console.log('✅ Toko Raditya Timeline siap!');
});




// ============================================
// FILTER PRODUCTS FUNCTION
// ============================================

function filterProducts(category) {
    // Ambil semua produk
    const products = document.querySelectorAll('.product-card');
    
    // Ambil semua tombol filter
    const buttons = document.querySelectorAll('.filter-btn');
    
    // Update active class pada tombol
    buttons.forEach(btn => {
        if (btn.getAttribute('onclick') === `filterProducts('${category}')`) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Filter produk
    products.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        
        if (category === 'all' || productCategory === category) {
            // Tampilkan produk
            product.style.display = 'block';
            product.style.opacity = '1';
            setTimeout(() => {
                product.style.transform = 'translateY(0)';
            }, 10);
        } else {
            // Sembunyikan produk
            product.style.opacity = '0';
            product.style.transform = 'translateY(20px)';
            setTimeout(() => {
                product.style.display = 'none';
            }, 300);
        }
    });
    
    console.log(`Filtering: ${category}`);
}

// ============================================
// QUICK VIEW FUNCTION
// ============================================

function quickView(productName) {
    showNotification(`🔍 Quick View: ${productName}`);
}

// ============================================
// DARK MODE FUNCTION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Dark Mode
    const darkMode = localStorage.getItem('darkMode');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const moonIcon = darkModeToggle.querySelector('.fa-moon');
    const sunIcon = darkModeToggle.querySelector('.fa-sun');
    
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
    }
    
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        } else {
            localStorage.setItem('darkMode', 'disabled');
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
        }
    });
    
    // ============================================
    // NOTIFICATION FUNCTION
    // ============================================
    
    window.showNotification = function(message) {
        const oldNotif = document.querySelector('.custom-notification');
        if (oldNotif) oldNotif.remove();
        
        const notif = document.createElement('div');
        notif.className = 'custom-notification';
        notif.textContent = message;
        notif.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 12px 24px;
            border-radius: 10px;
            font-weight: 500;
            z-index: 9999;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(notif);
        
        setTimeout(() => {
            notif.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 2000);
    };
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    console.log('✅ Website siap! Filter produk bisa digunakan.');
});


