let currentProduct = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ تهيئة صفحة تفاصيل المنتج');
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        window.location.href = 'products.html';
        return;
    }
    
    currentProduct = getProductById(parseInt(productId));
    
    if (!currentProduct) {
        document.getElementById('productDetailsContainer').innerHTML = `
            <div class="product-not-found">
                <i class="fas fa-search"></i>
                <h3>المنتج غير موجود</h3>
                <p>عذراً، لم نتمكن من العثور على المنتج المطلوب</p>
                <a href="products.html" class="btn-primary">العودة إلى المنتجات</a>
            </div>
        `;
        return;
    }
    
    displayProductDetails(currentProduct);
    updateCartCount();
});

function displayProductDetails(product) {
    const container = document.getElementById('productDetailsContainer');
    if (!container) return;
    
    const imageUrl = product.image || 'https://via.placeholder.com/400x400/0047ab/ffffff?text=قطعة+غيار';
    const stockStatus = product.stock > 0 ? 
        `<span class="stock-status in-stock"><i class="fas fa-check-circle"></i> متوفر (${product.stock} قطعة)</span>` :
        `<span class="stock-status out-stock"><i class="fas fa-times-circle"></i> غير متوفر حالياً</span>`;
    
    const rating = product.rating || 4.5;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let ratingStars = '★'.repeat(fullStars);
    if (halfStar) ratingStars += '½';
    ratingStars += '☆'.repeat(5 - fullStars - (halfStar ? 1 : 0));
    
    container.innerHTML = `
        <div class="product-details-grid" data-aos="fade-up">
            <div class="product-details-image">
                <div class="image-main">
                    <img src="${imageUrl}" alt="${product.name}" id="mainImage">
                </div>
            </div>
            
            <div class="product-details-info">
                <div class="product-breadcrumb">
                    <a href="index.html">الرئيسية</a> / 
                    <a href="products.html">المنتجات</a> / 
                    <span>${product.name}</span>
                </div>
                
                <h1>${product.name}</h1>
                
                <div class="product-meta">
                    <div class="product-brand">
                        <img src="images/${product.brand === 'كيا' ? 'Kia-logo.png' : 'hyundai.webp'}" alt="${product.brand}" class="brand-icon-sm">
                        <span>${product.brand}</span>
                    </div>
                    <div class="product-model">${product.model} ${product.year || ''}</div>
                    <div class="product-oem">OEM: ${product.oem}</div>
                </div>
                
                <div class="product-rating-detail">
                    <div class="rating-stars">${ratingStars}</div>
                    <span class="rating-value">${rating}</span>
                    <span class="rating-count">(جيد جداً)</span>
                </div>
                
                <div class="product-price-detail">
                    <span class="current-price">${product.price} ر.س</span>
                </div>
                
                ${stockStatus}
                
                <div class="product-description">
                    <h4>وصف المنتج</h4>
                    <p>${product.description || 'قطع غيار أصلية 100% بجودة عالية. متوافقة مع جميع موديلات السيارة. ضمان الجودة وتوصيل سريع لجميع مدن المملكة.'}</p>
                </div>
                
                <div class="product-specs">
                    <h4>المواصفات</h4>
                    <ul class="specs-list">
                        <li><span>الماركة:</span> ${product.brand}</li>
                        <li><span>الموديل:</span> ${product.model}</li>
                        <li><span>السنة:</span> ${product.year || 'جميع الموديلات'}</li>
                        <li><span>المحرك:</span> ${product.engine || 'جميع المحركات'}</li>
                        <li><span>رقم OEM:</span> ${product.oem}</li>
                        <li><span>الفئة:</span> ${product.category}</li>
                    </ul>
                </div>
                
                <div class="product-actions-detail">
                    <button class="add-to-cart-detail" data-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i> أضف إلى السلة
                    </button>
                    <a href="https://wa.me/966534625694?text=${encodeURIComponent('السلام عليكم، أرغب في الاستفسار عن: ' + product.name)}" target="_blank" class="whatsapp-order">
                        <i class="fab fa-whatsapp"></i> استفسار واتساب
                    </a>
                </div>
                
                <div class="product-guarantee">
                    <div class="guarantee-item"><i class="fas fa-shield-alt"></i><span>ضمان الجودة 100%</span></div>
                    <div class="guarantee-item"><i class="fas fa-truck"></i><span>توصيل سريع</span></div>
                    <div class="guarantee-item"><i class="fas fa-undo-alt"></i><span>إرجاع خلال 14 يوم</span></div>
                </div>
            </div>
        </div>
    `;
    
    const addBtn = document.querySelector('.add-to-cart-detail');
    if (addBtn) {
        const newBtn = addBtn.cloneNode(true);
        addBtn.parentNode.replaceChild(newBtn, addBtn);
        
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = newBtn.getAttribute('data-id');
            if (productId) {
                addToCartDetail(parseInt(productId));
            }
        });
    }
}

function addToCartDetail(productId) {
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

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.length;
    const dots = document.querySelectorAll('.cart-dot');
    
    dots.forEach(dot => {
        dot.textContent = totalItems;
        dot.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

function showNotification(msg, type = 'success') {
    const notif = document.createElement('div');
    const colors = { success: '#10b981', error: '#ef4444', warning: '#f59e0b' };
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle' };
    
    notif.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${colors[type]};
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
        direction: rtl;
    `;
    notif.innerHTML = `<i class="fas ${icons[type]}"></i> ${msg}`;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 2500);
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