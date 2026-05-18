// =====================================================================
// ======================== products.js ================================
// ======================== صفحة جميع المنتجات ========================
// =====================================================================

// المتغيرات العامة
let currentProducts = [];
let filteredProducts = [];

// ======================== متغيرات الترقيم ========================
let currentPage = 1;
let itemsPerPage = getItemsPerPage();  
let totalPages = 1;

// ======================== [1] تهيئة الصفحة ===========================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ تهيئة صفحة المنتجات');
    
    // التأكد من وجود المنتجات
    if (typeof products === 'undefined') {
        console.error('❌ products غير معرف - تأكد من تحميل data.js');
        return;
    }
    
    // تهيئة المنتجات
    currentProducts = [...products];
    filteredProducts = [...currentProducts];

    itemsPerPage = getItemsPerPage();
    
    // عرض المنتجات مع الترقيم
    displayProductsWithPagination(filteredProducts);
    updateResultsCount();
    
    // البحث من URL
    handleUrlSearch();
    
    // تفعيل الفلاتر
    setupFilters();
    
    // تفعيل الترتيب
    setupSorting();
    
    // تفعيل البحث
    setupSearch();
    
    // تفعيل أزرار الإضافة للسلة
    setupAddToCart();
    
    // تحديث عداد السلة
    updateCartCount();
    
    // تحديث أعداد المنتجات
    updateFilterCounts();
    
    // تفعيل الـ Checkboxes
    initFilterCheckboxes();
    
    // تفعيل زر مسح الفلاتر
    setupClearFiltersButton();
    setupResponsivePagination();
});

function setupResponsivePagination() {
    let resizeTimer;
    
    window.addEventListener('resize', function() {
        // تأخير التنفيذ لتجنب التحميل المتكرر
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            const newItemsPerPage = getItemsPerPage();
            
            // إذا تغير عدد المنتجات لكل صفحة
            if (newItemsPerPage !== itemsPerPage) {
                console.log(`📱 تغير حجم الشاشة: ${itemsPerPage} → ${newItemsPerPage} منتج لكل صفحة`);
                itemsPerPage = newItemsPerPage;
                currentPage = 1;  // إعادة تعيين الصفحة إلى 1
                
                // إعادة عرض المنتجات مع العدد الجديد
                displayProductsWithPagination(filteredProducts);
                updateResultsCount();
                updatePaginationButtons();
            }
        }, 250);
    });
}

// ======================== [2] عرض المنتجات مع الترقيم =================
function displayProductsWithPagination(productsToShow) {
    const container = document.getElementById('allProductsGrid');
    const noResults = document.getElementById('noResults');
    const paginationContainer = document.getElementById('paginationContainer');
    
    if (!container) return;
    
    totalPages = Math.ceil(productsToShow.length / itemsPerPage);
    if (totalPages === 0) totalPages = 1;
    
    // التأكد من أن الصفحة الحالية ضمن النطاق
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;
    
    // حساب المنتجات التي ستظهر في الصفحة الحالية
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToDisplay = productsToShow.slice(startIndex, endIndex);
    
    container.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        if (noResults) noResults.style.display = 'block';
        if (paginationContainer) paginationContainer.style.display = 'none';
        return;
    }
    
    if (noResults) noResults.style.display = 'none';
    
    productsToDisplay.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
    
    updatePaginationButtons();
}

// ======================== [3] تحديث أزرار الترقيم =====================
function updatePaginationButtons() {
    const pageNumbersContainer = document.getElementById('pageNumbers');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const paginationContainer = document.getElementById('paginationContainer');
    
    if (!pageNumbersContainer) return;
    
    // إخفاء الترقيم إذا كان هناك صفحة واحدة فقط
    if (totalPages <= 1) {
        if (paginationContainer) paginationContainer.style.display = 'none';
        return;
    }
    
    if (paginationContainer) paginationContainer.style.display = 'flex';
    
    // تفعيل/تعطيل أزرار السابق والتالي
    if (prevBtn) {
        const newPrevBtn = prevBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
        
        newPrevBtn.disabled = (currentPage === 1);
        newPrevBtn.style.opacity = (currentPage === 1) ? '0.5' : '1';
        newPrevBtn.style.cursor = (currentPage === 1) ? 'not-allowed' : 'pointer';
        
        newPrevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayProductsWithPagination(filteredProducts);
                updateResultsCount();
            }
        });
    }
    
    if (nextBtn) {
        const newNextBtn = nextBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
        
        newNextBtn.disabled = (currentPage === totalPages);
        newNextBtn.style.opacity = (currentPage === totalPages) ? '0.5' : '1';
        newNextBtn.style.cursor = (currentPage === totalPages) ? 'not-allowed' : 'pointer';
        
        newNextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayProductsWithPagination(filteredProducts);
                updateResultsCount();
            }
        });
    }
    
    // إنشاء أرقام الصفحات
    pageNumbersContainer.innerHTML = '';
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        addPageButton(1);
        if (startPage > 2) addDotsButton();
    }
    
    for (let i = startPage; i <= endPage; i++) {
        addPageButton(i);
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) addDotsButton();
        addPageButton(totalPages);
    }
}

function addPageButton(pageNum) {
    const pageNumbersContainer = document.getElementById('pageNumbers');
    if (!pageNumbersContainer) return;
    
    const btn = document.createElement('button');
    btn.className = 'page-number';
    btn.textContent = pageNum;
    if (pageNum === currentPage) {
        btn.classList.add('active');
    }
    btn.addEventListener('click', () => {
        if (currentPage !== pageNum) {
            currentPage = pageNum;
            displayProductsWithPagination(filteredProducts);
            updateResultsCount();
        }
    });
    pageNumbersContainer.appendChild(btn);
}

function addDotsButton() {
    const pageNumbersContainer = document.getElementById('pageNumbers');
    if (!pageNumbersContainer) return;
    
    const dots = document.createElement('span');
    dots.className = 'page-dots';
    dots.textContent = '...';
    pageNumbersContainer.appendChild(dots);
}

// ======================== [4] إنشاء بطاقة منتج =======================
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);
    
    const imageUrl = product.image || 'https://via.placeholder.com/300x200/0047ab/ffffff?text=قطعة+غيار';
    
    // شارة المنتج (جديد / الأكثر مبيعاً)
    let badgeText = '';
    if (product.isNew) {
        badgeText = '<span class="product-badge new">جديد</span>';
    } else if (product.isBestSeller) {
        badgeText = '<span class="product-badge best">الأكثر مبيعاً</span>';
    }
    
    // التقييم
    const rating = product.rating || 4.5;
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    const ratingStars = '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${imageUrl}" alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x200/0047ab/ffffff?text=قطعة'">
            ${badgeText}
        </div>
        <div class="product-info">
            <span class="product-category">${product.category}</span>
            <h3 class="product-title">
                <a href="product-details.html?id=${product.id}">${product.name}</a>
            </h3>
            <span class="product-oem">${product.oem}</span>
            <div class="product-price">${product.price} ر.س</div>
            <div class="product-rating">
                <span class="stars">${ratingStars}</span>
                <span class="rating-value">(${rating})</span>
            </div>
            <button class="add-to-cart" data-id="${product.id}">
                <i class="fas fa-cart-plus"></i> أضف للسلة
            </button>
        </div>
    `;
    
    // عند النقر على البطاقة (غير الزر)
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.add-to-cart') && !e.target.closest('a')) {
            window.location.href = `product-details.html?id=${product.id}`;
        }
    });
    
    return card;
}

// ======================== [5] تحديث أعداد المنتجات ===================
function updateFilterCounts() {
    // عدد منتجات كيا
    const kiaCount = products.filter(p => p.brand === "كيا").length;
    const kiaCountSpan = document.getElementById('kiaCount');
    if (kiaCountSpan) kiaCountSpan.textContent = `(${kiaCount})`;
    
    // عدد منتجات هيونداي
    const hyundaiCount = products.filter(p => p.brand === "هيونداي").length;
    const hyundaiCountSpan = document.getElementById('hyundaiCount');
    if (hyundaiCountSpan) hyundaiCountSpan.textContent = `(${hyundaiCount})`;
}

// ======================== [6] تفعيل الـ Checkboxes ===================
function initFilterCheckboxes() {
    // تفعيل Checkboxes الماركة
    document.querySelectorAll('.brand-filter').forEach(cb => {
        cb.addEventListener('change', () => {
            updateActiveFilters();
        });
    });
    
    // تفعيل Checkboxes الفئة
    document.querySelectorAll('.category-filter').forEach(cb => {
        cb.addEventListener('change', () => {
            updateActiveFilters();
        });
    });
}

// ======================== [7] عرض الفلاتر النشطة =====================
function updateActiveFilters() {
    const activeContainer = document.getElementById('activeFilters');
    if (!activeContainer) return;
    
    const activeFilters = [];
    
    // جمع الماركات النشطة
    document.querySelectorAll('.brand-filter:checked').forEach(cb => {
        const label = cb.closest('.filter-check');
        const name = label?.querySelector('.filter-name')?.textContent || cb.value;
        activeFilters.push({ name, type: 'brand' });
    });
    
    // جمع الفئات النشطة
    document.querySelectorAll('.category-filter:checked').forEach(cb => {
        const label = cb.closest('.filter-check');
        const name = label?.querySelector('.filter-name')?.textContent || cb.value;
        activeFilters.push({ name, type: 'category' });
    });
    
    if (activeFilters.length === 0) {
        activeContainer.innerHTML = '';
        return;
    }
    
    activeContainer.innerHTML = `
        <div class="active-filters-title">
            <i class="fas fa-check-circle"></i>
            <span>الفلاتر المختارة (${activeFilters.length})</span>
        </div>
        <div class="active-filters-list">
            ${activeFilters.map(filter => `
                <span class="active-filter-tag" data-filter-name="${filter.name}">
                    ${filter.name}
                    <i class="fas fa-times" onclick="removeFilter('${filter.name}')"></i>
                </span>
            `).join('')}
            <button class="clear-all-filters" onclick="resetAllFilters()">
                <i class="fas fa-trash-alt"></i> مسح الكل
            </button>
        </div>
    `;
}

// ======================== [8] إزالة فلتر معين =========================
function removeFilter(filterName) {
    // إلغاء تحديد الماركة
    document.querySelectorAll('.brand-filter').forEach(cb => {
        const label = cb.closest('.filter-check');
        const name = label?.querySelector('.filter-name')?.textContent;
        if (name === filterName) {
            cb.checked = false;
        }
    });
    
    // إلغاء تحديد الفئة
    document.querySelectorAll('.category-filter').forEach(cb => {
        const label = cb.closest('.filter-check');
        const name = label?.querySelector('.filter-name')?.textContent;
        if (name === filterName) {
            cb.checked = false;
        }
    });
    
    // إعادة تعيين الصفحة إلى 1 وتطبيق الفلاتر
    currentPage = 1;
    applyAllFilters();
}

// ======================== [9] إعادة تعيين جميع الفلاتر ================
function resetAllFilters() {
    document.querySelectorAll('.brand-filter, .category-filter').forEach(cb => {
        cb.checked = false;
    });
    currentPage = 1;
    applyAllFilters();
}

// ======================== [10] تطبيق الفلاتر ==========================
function applyAllFilters() {
    let results = [...currentProducts];
    
    // فلترة الماركة
    const selectedBrands = Array.from(document.querySelectorAll('.brand-filter:checked')).map(cb => cb.value);
    if (selectedBrands.length > 0) {
        results = results.filter(p => selectedBrands.includes(p.brand));
    }
    
    // فلترة الفئة
    const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked')).map(cb => cb.value);
    if (selectedCategories.length > 0) {
        results = results.filter(p => selectedCategories.includes(p.category));
    }
    
    filteredProducts = results;
    
    // عرض المنتجات مع الترقيم
    displayProductsWithPagination(filteredProducts);
    updateResultsCount();
    
    // تطبيق الترتيب
    applySorting();
    
    // تحديث عرض الفلاتر النشطة
    updateActiveFilters();
}

// ======================== [11] تفعيل الفلاتر ==========================
function setupFilters() {
    // تطبيق الفلاتر (زر التطبيق)
    const applyBtn = document.getElementById('applyFilters');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            currentPage = 1;  // إعادة تعيين الصفحة إلى 1 عند تطبيق الفلاتر
            applyAllFilters();
            applyBtn.classList.add('clicked');
            setTimeout(() => applyBtn.classList.remove('clicked'), 300);
        });
    }
    
    // إعادة تعيين
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            currentPage = 1;
            resetAllFilters();
        });
    }
}

// ======================== [12] تفعيل الترتيب ==========================
function setupSorting() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            applySorting();
        });
    }
}

function applySorting() {
    const sortValue = document.getElementById('sortSelect').value;
    let sorted = [...filteredProducts];
    
    switch(sortValue) {
        case 'price-asc':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sorted.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            sorted = [...filteredProducts];
    }
    
    filteredProducts = sorted;
    displayProductsWithPagination(filteredProducts);
}

// ======================== [13] تحديث عدد النتائج ======================
function updateResultsCount() {
    const countSpan = document.getElementById('resultsCount');
    if (countSpan) {
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, filteredProducts.length);
        if (filteredProducts.length === 0) {
            countSpan.textContent = `عرض 0 منتج`;
        } else {
            countSpan.textContent = `عرض ${start} - ${end} من أصل ${filteredProducts.length} منتج`;
        }
    }
}

function getItemsPerPage() {
    const width = window.innerWidth;
    
    if (width >= 800) {
        return 9;      
    } else if (width >= 576) {
        return 6;      
    } else if (width >= 375) {
        return 4;      
    } else {
        return 4;    
    }
}

// ======================== [14] البحث من URL ===========================
function handleUrlSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');
    const brandTerm = urlParams.get('brand');
    
    if (searchTerm) {
        const results = searchProducts(searchTerm);
        filteredProducts = results;
        currentPage = 1;
        displayProductsWithPagination(filteredProducts);
        updateResultsCount();
        
        const searchInput = document.querySelector('.search-mini input');
        if (searchInput) searchInput.value = searchTerm;
    }
    
    if (brandTerm) {
        const results = currentProducts.filter(p => p.brand === brandTerm);
        filteredProducts = results;
        currentPage = 1;
        displayProductsWithPagination(filteredProducts);
        updateResultsCount();
    }
}

// ======================== [15] البحث في الصفحة ========================
function setupSearch() {
    const searchInput = document.querySelector('.search-mini input');
    const searchBtn = document.querySelector('.search-mini button');
    
    if (!searchInput || !searchBtn) return;
    
    function doSearch() {
        const term = searchInput.value.trim().toLowerCase();
        if (term) {
            const results = currentProducts.filter(p => 
                p.name.toLowerCase().includes(term) ||
                p.oem.toLowerCase().includes(term) ||
                p.brand.toLowerCase().includes(term)
            );
            filteredProducts = results;
            currentPage = 1;
            displayProductsWithPagination(filteredProducts);
            updateResultsCount();
        } else {
            filteredProducts = [...currentProducts];
            currentPage = 1;
            displayProductsWithPagination(filteredProducts);
            updateResultsCount();
        }
    }
    
    searchBtn.addEventListener('click', doSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') doSearch();
    });
}

// ======================== [16] تفعيل زر مسح الفلاتر ===================
function setupClearFiltersButton() {
    const clearBtn = document.getElementById('clearFilters');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            currentPage = 1;
            resetAllFilters();
        });
    }
}

// ======================== [17] إضافة للسلة ============================
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

// ===== إضافة للسلة (صفحة المنتجات) =====
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

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const dots = document.querySelectorAll('.cart-dot');
    
    dots.forEach(dot => {
        dot.textContent = totalItems;
        dot.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

// ======================== [18] إشعارات ================================
function showNotification(message, type = 'success') {
    const notif = document.createElement('div');
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b'
    };
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle'
    };
    
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
    notif.innerHTML = `<i class="fas ${icons[type]}"></i> ${message}`;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 2500);
}

// ======================== [19] إضافة أنيميشن للإشعارات ================
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

// ======================== [20] دوال مساعدة ============================
window.getKiaProducts = window.getKiaProducts || function() { 
    return products.filter(p => p.brand === "كيا"); 
};

window.getHyundaiProducts = window.getHyundaiProducts || function() { 
    return products.filter(p => p.brand === "هيونداي"); 
};

window.getProductById = window.getProductById || function(id) { 
    return products.find(p => p.id === parseInt(id)); 
};
