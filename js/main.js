// ===== main.js - النسخة النهائية مع الوضع الليلي العام =====

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== 1. الوضع الليلي (يطبق على جميع الصفحات) =====
    initTheme();
    
    // ===== 2. الهيدر الذكي =====
    initSmartHeader();
    
    // ===== 3. القائمة الجانبية =====
    initSideRail();
    
    // ===== 4. القائمة السفلية للجوال =====
    initBottomNav();
    
    // ===== 5. البحث =====
    setupSearch();
    
    // ===== 6. السلة =====
    updateCartCount();
    setupAddToCart();
    
    // ===== 7. التحسينات =====
    setTimeout(() => {
        animateStats();
        initTestimonials();
        initTrustBanner();
        initCardEffects();
        initScrollReveal();
    }, 500);
    
    // ===== 8. المنتجات (إذا كانت الصفحة الرئيسية) =====
    if (document.getElementById('kia-products')) {
        displayKiaProducts();
        displayHyundaiProducts();
    }
});

// ===== 1. الوضع الليلي (يعمل على جميع الصفحات) =====
function initTheme() {
    const themeBtn = document.getElementById('themeMode');
    
    // ✅ تطبيق الوضع المحفوظ فوراً عند تحميل أي صفحة
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    // ✅ تحديث شكل الزر إذا كان موجوداً
    if (themeBtn) {
        if (savedTheme === 'dark') {
            themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
        
        // ✅ عند النقر على الزر
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('theme', 'dark');
                showNotification('🌙 الوضع الليلي', 'info');
            } else {
                themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('theme', 'light');
                showNotification('☀️ الوضع النهاري', 'info');
            }
        });
    }
}

// ===== 2. الهيدر الذكي =====
function initSmartHeader() {
    let lastScroll = 0;
    const header = document.getElementById('mainHeader');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('hide');
            return;
        }
        
        if (currentScroll > lastScroll && currentScroll > 50) {
            header.classList.add('hide');
        } else {
            header.classList.remove('hide');
        }
        
        lastScroll = currentScroll;
    });
}

// ===== 3. القائمة الجانبية (محدثة) =====
function initSideRail() {
    const railMenu = document.getElementById('railMenu');
    const railToggle = document.getElementById('railToggle');
    const mobileToggle = document.getElementById('mobileToggle');
    const links = document.querySelectorAll('.rail-link');
    const sections = document.querySelectorAll('section[id]');
    
    if (railToggle && railMenu) {
        railToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            railMenu.classList.toggle('active');
            const icon = railToggle.querySelector('i');
            icon.className = railMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
        });
    }
    
    if (mobileToggle && railMenu) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            railMenu.classList.toggle('active');
            if (railToggle) {
                const icon = railToggle.querySelector('i');
                icon.className = railMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
            }
        });
    }
    
    document.addEventListener('click', (e) => {
        if (railMenu && railToggle && mobileToggle && 
            !railMenu.contains(e.target) && 
            !railToggle.contains(e.target) &&
            !mobileToggle.contains(e.target)) {
            railMenu.classList.remove('active');
            if (railToggle) {
                const icon = railToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            }
        }
    });
    
    // ✅ فقط للصفحة الرئيسية: تفعيل التمرير السلس للروابط الداخلية
    const hasSections = sections.length > 0;
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const target = link.getAttribute('data-target');
            
            // ✅ إذا كان الرابط خارجي (يبدأ بـ .html أو http)
            if (href && (href.includes('.html') || href.startsWith('http'))) {
                // الروابط الخارجية تعمل بشكل طبيعي
                return;
            }
            
            // ✅ فقط للروابط الداخلية (تبدأ بـ #)
            if (target) {
                e.preventDefault();
                const element = document.getElementById(target);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    if (window.innerWidth <= 768 && railMenu) {
                        railMenu.classList.remove('active');
                        if (railToggle) {
                            const icon = railToggle.querySelector('i');
                            icon.className = 'fas fa-bars';
                        }
                    }
                }
            }
        });
    });
}

// ===== 4. القائمة السفلية للجوال =====
function initBottomNav() {
    const bottomNav = document.getElementById('bottomNav');
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    const sections = document.querySelectorAll('section[id]');
    
    if (!bottomNav) return;
    
    // تحديد العنصر النشط بناءً على الصفحة الحالية
    function setActiveBasedOnPage() {
        const currentPage = window.location.pathname.split('/').pop();
        
        bottomNavItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                item.classList.add('active');
            }
        });
    }
    
    // تحديد العنصر النشط عند التمرير (للصفحة الرئيسية فقط)
    if (sections.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            const footer = document.getElementById('footer');
            if (footer) {
                const footerTop = footer.offsetTop - 100;
                if (window.scrollY >= footerTop) {
                    current = 'footer';
                }
            }
            
            bottomNavItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-target') === current) {
                    item.classList.add('active');
                }
            });
        });
    } else {
        // للصفحات الأخرى (products, cart, returns, terms, thank-you)
        setActiveBasedOnPage();
    }
    
    // تمرير سلس عند النقر
    bottomNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const href = item.getAttribute('href');
            const target = item.getAttribute('data-target');
            
            if (href && !href.startsWith('#')) {
                // روابط الصفحات العادية
                return;
            }
            
            if (target) {
                e.preventDefault();
                const element = document.getElementById(target);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // إخفاء القائمة عند التمرير للأسفل
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > lastScroll && currentScroll > 200) {
            bottomNav.classList.add('hide');
        } else {
            bottomNav.classList.remove('hide');
        }
        lastScroll = currentScroll;
    });
}

// ===== 5. البحث =====
function setupSearch() {
    const input = document.querySelector('.search-mini input');
    const btn = document.querySelector('.search-mini button');
    
    if (!input || !btn) return;
    
    function doSearch() {
        const term = input.value.trim();
        if (term) {
            window.location.href = `products.html?search=${encodeURIComponent(term)}`;
        }
    }
    
    btn.addEventListener('click', doSearch);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') doSearch();
    });
}

// ===== 6. السلة =====
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.length;
    const dots = document.querySelectorAll('.cart-dot');
    
    dots.forEach(dot => {
        dot.textContent = totalItems;
        dot.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

function setupAddToCart() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-cart');
        if (!btn) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const productId = btn.getAttribute('data-id');
        if (productId) {
            addToCart(parseInt(productId));
        }
    });
}

function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) {
        showNotification('❌ المنتج غير موجود', 'error');
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // ✅ البحث عن المنتج في السلة
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // ✅ المنتج موجود → رسالة خطأ ولا نزيد الكمية
        showNotification(`⚠️ المنتج "${product.name}" موجود بالفعل في السلة. يمكنك تعديل الكمية من صفحة السلة.`, 'warning');
        return;
    }
    
    // ✅ المنتج غير موجود → إضافة جديدة فقط (مرة واحدة)
    cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        oem: product.oem,
        brand: product.brand,
        category: product.category
    });
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`✅ تمت الإضافة: ${product.name}`, 'success');
}

// ===== 7. إشعار =====
function showNotification(msg, type = 'success') {
    const notif = document.createElement('div');
    const bgColor = type === 'success' ? 'linear-gradient(135deg, #0047ab, #c41e3a)' : 
                    type === 'info' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#ef4444';
    const icon = type === 'success' ? 'fa-check-circle' : type === 'info' ? 'fa-info-circle' : 'fa-exclamation-circle';
    
    notif.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 12px 20px;
        border-radius: 30px;
        font-size: 13px;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 8px;
    `;
    notif.innerHTML = `<i class="fas ${icon}"></i> ${msg}`;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 2000);
}

function addNotificationStyles() {
    if (document.getElementById('notificationStyles')) return;
    
    const style = document.createElement('style');
    style.id = 'notificationStyles';
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
}
addNotificationStyles();

// ===== 8. عرض منتجات كيا وهيونداي (للصفحة الرئيسية) =====
function displayKiaProducts() {
    const container = document.getElementById('kia-products');
    if (!container) return;
    
    const kiaProducts = getKiaProducts().slice(0, 3);
    container.innerHTML = '';
    
    kiaProducts.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
}

function displayHyundaiProducts() {
    const container = document.getElementById('hyundai-products');
    if (!container) return;
    
    const hyundaiProducts = getHyundaiProducts().slice(0, 3);
    container.innerHTML = '';
    
    hyundaiProducts.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);
    
    const imageUrl = product.image || 'https://via.placeholder.com/150/0047ab/ffffff?text=قطعة';
    
    let badgeText = '';
    if (product.isNew) {
        badgeText = '<span class="product-badge new">جديد</span>';
    } else if (product.isBestSeller) {
        badgeText = '<span class="product-badge best">الأكثر مبيعاً</span>';
    }
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${imageUrl}" alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/150/0047ab/ffffff?text=قطعة'">
            ${badgeText}
        </div>
        <div class="product-info">
            <span class="product-category">${product.category}</span>
            <h3 class="product-title">
                <a href="product-details.html?id=${product.id}">${product.name}</a>
            </h3>
            <span class="product-oem">${product.oem}</span>
            <div class="product-price">${product.price} ر.س</div>
            <button class="add-to-cart" data-id="${product.id}">
                <i class="fas fa-cart-plus"></i> أضف للسلة
            </button>
        </div>
    `;
    
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.add-to-cart') && !e.target.closest('a')) {
            window.location.href = `product-details.html?id=${product.id}`;
        }
    });
    
    return card;
}

// ===== 9. التحسينات =====
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateNumber = (element, target) => {
        let current = 0;
        const increment = target / 40;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (element.textContent.includes('+') ? '+' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
            }
        }, 25);
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.textContent;
                const number = parseInt(text);
                if (!isNaN(number)) {
                    animateNumber(element, number);
                }
                observer.unobserve(element);
            }
        });
    });
    
    statNumbers.forEach(el => observer.observe(el));
}

function initTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    testimonials.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

function initTrustBanner() {
    const trustItems = document.querySelectorAll('.trust-item');
    let index = 0;
    
    setInterval(() => {
        trustItems.forEach((item, i) => {
            if (i === index) {
                item.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    item.style.transform = 'scale(1)';
                }, 200);
            }
        });
        index = (index + 1) % trustItems.length;
    }, 2500);
}

function initCardEffects() {
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const badge = card.querySelector('.product-badge');
            if (badge) {
                badge.style.transform = 'scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const badge = card.querySelector('.product-badge');
            if (badge) {
                badge.style.transform = 'scale(1)';
            }
        });
    });
}

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.testimonial-card, .feature-card-hover, .product-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}


// ===== دوال مساعدة =====
window.getKiaProducts = window.getKiaProducts || function() { return []; };
window.getHyundaiProducts = window.getHyundaiProducts || function() { return []; };
window.getProductById = window.getProductById || function() { return null; };