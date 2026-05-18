// ===== تهيئة EmailJS =====
(function() {
    emailjs.init("MlUr5vP50Ym5StEto");
})();

// بيانات المدن حسب المناطق
const citiesData = {
    'الرياض': ['الرياض', 'الدرعية', 'الخرج', 'المجمعة', 'الزلفي', 'وادي الدواسر'],
    'مكة المكرمة': ['مكة المكرمة', 'جدة', 'الطائف', 'رابغ', 'الليث', 'الخرمة', 'رنية', 'تربة', 'القنفذة'],
    'المدينة المنورة': ['المدينة المنورة', 'ينبع', 'العلا', 'المهد', 'بدر', 'خيبر'],
    'الشرقية': ['الدمام', 'الخبر', 'الظهران', 'الأحساء', 'القطيف', 'جبيل', 'رأس تنورة', 'بقيق', 'النعيرية'],
    'القصيم': ['بريدة', 'عنيزة', 'الرس', 'المذنب', 'البكيرية', 'البدائع', 'عيون الجواء'],
    'عسير': ['أبها', 'خميس مشيط', 'محايل عسير', 'بيشة', 'النماص', 'ظهران الجنوب', 'سراة عبيدة'],
    'تبوك': ['تبوك', 'ضباء', 'تيماء', 'أملج', 'الوجه'],
    'حائل': ['حائل', 'بقعاء', 'الغزالة', 'الشنان', 'سميراء'],
    'جازان': ['جازان', 'صبيا', 'أبو عريش', 'الدرب', 'بيش', 'الريث', 'ضمد'],
    'نجران': ['نجران', 'شرورة', 'حبونا', 'ثار', 'يدمه'],
    'الباحة': ['الباحة', 'بلجرشي', 'المندق', 'المخواة', 'العقيق', 'قلوة'],
    'الجوف': ['سكاكا', 'دومة الجندل', 'القريات', 'طبرجل'],
    'الحدود الشمالية': ['عرعر', 'رفحاء', 'طريف', 'العويقيلة']
};

// ======================== [1] تهيئة الصفحة ===========================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ تهيئة صفحة السلة');
    displayCartItems();
    setupRegionCity();
    setupOrderForm();
    updateCartCount();
    setupGPSLocation();
    setupImageUpload();
});

// ======================== [2] عرض منتجات السلة =======================
function displayCartItems() {
    const container = document.getElementById('cartItemsList');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (!container) return;
    
    // ✅ إذا كانت السلة فارغة
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-message">
                <i class="fas fa-shopping-cart"></i>
                <h3>سلتك فارغة</h3>
                <p>أضف بعض المنتجات إلى سلة التسوق</p>
                <a href="products.html" class="btn-primary">تصفح المنتجات</a>
            </div>
        `;
        return;
    }
    
    // ✅ إذا كانت السلة تحتوي على منتجات
    let html = '';
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const quantity = item.quantity || 1;
        const itemTotal = item.price * quantity;
        subtotal += itemTotal;
        
        html += `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <span class="oem">${item.oem || 'OEM'}</span>
                </div>
                <div class="cart-item-price">${item.price} ر.س</div>
                <div class="cart-item-quantity">
                    <button class="qty-btn minus" onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${quantity}</span>
                    <button class="qty-btn plus" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <div class="cart-item-total">${itemTotal} ر.س</div>
                <button class="remove-item" onclick="removeItemById(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    const shipping = subtotal > 500 ? 0 : 30;
    const tax = subtotal * 0.15;
    const total = subtotal + shipping + tax;
    
    html += `
        <div class="cart-summary">
            <div class="summary-row">
                <span>المجموع الفرعي:</span>
                <span>${subtotal.toFixed(2)} ر.س</span>
            </div>
            <div class="summary-row">
                <span>الشحن:</span>
                <span>${shipping === 0 ? 'مجاني' : shipping + ' ر.س'}</span>
            </div>
            <div class="summary-row">
                <span>الضريبة (15%):</span>
                <span>${tax.toFixed(2)} ر.س</span>
            </div>
            <div class="summary-row total">
                <span>الإجمالي:</span>
                <span>${total.toFixed(2)} ر.س</span>
            </div>
                <button class="clear-cart-btn" onclick="clearCart()">
        <i class="fas fa-trash-alt"></i> تفريغ السلة
    </button>
        </div>
    `;
    
    container.innerHTML = html;
}

// ======================== [3] تحديث الكمية ============================
function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart[index]) {
        const newQuantity = cart[index].quantity + change;
        
        if (newQuantity <= 0) {
            cart.splice(index, 1);
        } else {
            cart[index].quantity = newQuantity;
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateCartCount();
    }
}

// ======================== [4] حذف منتج ================================
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const deletedItem = cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
    showNotification('🗑️ تم حذف المنتج من السلة', 'info');
}
function removeItemById(productId) {
    // جلب السلة الحالية
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // ✅ فلترة المنتجات بحذف المنتج المطلوب
    const newCart = cart.filter(item => item.id !== productId);
    
    // ✅ التحقق إذا تم الحذف فعلاً
    if (cart.length !== newCart.length) {
        // حفظ السلة الجديدة
        localStorage.setItem('cart', JSON.stringify(newCart));
        
        // ✅ تحديث واجهة المستخدم
        displayCartItems();
        
        // ✅ تحديث عداد السلة
        updateCartCount();
        
        // ✅ إشعار للمستخدم
        showNotification('🗑️ تم حذف المنتج من السلة', 'info');
    } else {
        showNotification('❌ المنتج غير موجود', 'error');
    }
}


// ======================== [5] تفعيل المنطقة والمدينة ===================
function setupRegionCity() {
    const regionSelect = document.getElementById('region');
    const citySelect = document.getElementById('city');
    
    if (!regionSelect || !citySelect) return;
    
    regionSelect.addEventListener('change', function() {
        const selectedRegion = this.value;
        citySelect.innerHTML = '<option value="">اختر المدينة</option>';
        
        if (selectedRegion && citiesData[selectedRegion]) {
            citiesData[selectedRegion].forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
            citySelect.disabled = false;
        } else {
            citySelect.disabled = true;
        }
    });
}

// ======================== [6] تفعيل نموذج الطلب ========================
function setupOrderForm() {
    const form = document.getElementById('customerForm');
    const submitBtn = document.getElementById('submitOrderBtn');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const customerName = document.getElementById('customerName').value.trim();
        let customerPhone = document.getElementById('customerPhone').value.trim();
        const region = document.getElementById('region').value;
        const city = document.getElementById('city').value;
        const street = document.getElementById('street').value.trim();
        const buildingNumber = document.getElementById('buildingNumber').value.trim();
        
        if (!customerName) {
            alert('❌ الرجاء إدخال الاسم الكامل');
            return;
        }
        
        const phoneRegex = /^(\+966|0)?5[0-9]{8}$/;
        if (!phoneRegex.test(customerPhone)) {
            alert('❌ الرجاء إدخال رقم جوال سعودي صحيح');
            return;
        }
        
        if (customerPhone.startsWith('0')) {
            customerPhone = '+966' + customerPhone.substring(1);
        } else if (!customerPhone.startsWith('+966')) {
            customerPhone = '+966' + customerPhone;
        }
        
        if (!region || !city || !street || !buildingNumber) {
            alert('❌ الرجاء تعبئة جميع بيانات العنوان');
            return;
        }
        
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('❌ سلة التسوق فارغة');
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري معالجة الطلب...';
        
        processPayment(customerName, customerPhone, region, city, street, buildingNumber, cart, submitBtn);
    });
}

// ======================== [7] معالجة الدفع ============================
function processPayment(name, phone, region, city, street, buildingNumber, cart, submitBtn) {
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    const shipping = subtotal > 500 ? 0 : 30;
    const tax = subtotal * 0.15;
    const total = subtotal + shipping + tax;
    
    const originalButtonText = submitBtn.innerHTML;
    
    let selectedMethod = null;
    let uploadedImageUrl = null;
    
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
        <div class="payment-modal-content compact">
            <div class="payment-modal-header">
                <i class="fas fa-wallet"></i>
                <h3>اختر طريقة الدفع</h3>
                <button class="close-modal">&times;</button>
            </div>
            
            <div class="payment-amount-compact">
                <span>المبلغ:</span>
                <strong>${total.toFixed(2)} ر.س</strong>
            </div>
            
            <div class="payment-methods-compact">
                <div class="payment-option" data-method="cod">
                    <div class="payment-option-icon"><i class="fas fa-money-bill-wave"></i></div>
                    <div class="payment-option-info">
                        <h4>الدفع عند الاستلام</h4>
                        <p>ادفع كاش عند التوصيل</p>
                    </div>
                    <div class="payment-option-status active"><i class="fas fa-check-circle"></i> متاح</div>
                </div>
                
                <div class="payment-option" data-method="bank">
                    <div class="payment-option-icon"><i class="fas fa-university"></i></div>
                    <div class="payment-option-info">
                        <h4>تحويل بنكي</h4>
                        <p>حوالة مباشرة</p>
                    </div>
                    <div class="payment-option-status active"><i class="fas fa-check-circle"></i> متاح</div>
                </div>
                
                <div class="payment-option disabled" data-method="tabby">
                    <div class="payment-option-icon"><img src="/images/tabby.webp" alt="Tabby" style="width: 40px;"></div>
                    <div class="payment-option-info">
                        <h4>تابي</h4>
                        <p>4 دفعات بدون فوائد</p>
                    </div>
                    <div class="payment-option-status coming-soon"><i class="fas fa-clock"></i> قريباً</div>
                </div>
                
                <div class="payment-option disabled" data-method="tamara">
                    <div class="payment-option-icon"><img src="/images/tamara.webp" alt="Tamara" style="width: 40px;"></div>
                    <div class="payment-option-info">
                        <h4>تمارا</h4>
                        <p>اشتر الآن وادفع لاحقاً</p>
                    </div>
                    <div class="payment-option-status coming-soon"><i class="fas fa-clock"></i> قريباً</div>
                </div>
                
                <div class="payment-option disabled" data-method="card">
                    <div class="payment-option-icon"><i class="fas fa-credit-card"></i></div>
                    <div class="payment-option-info">
                        <h4>بطاقة ائتمانية</h4>
                        <p>فيزا / ماستركارد / مدى</p>
                    </div>
                    <div class="payment-option-status coming-soon"><i class="fas fa-clock"></i> قريباً</div>
                </div>
            </div>
            
            <div class="bank-transfer-section" id="bankTransferSection" style="display: none;">
                <div class="bank-info-card">
                    <i class="fas fa-info-circle"></i>
                    <div>
                        <h4>معلومات الحساب البنكي</h4>
                        <div class="bank-details">
                            <div class="bank-row"><span>المستفيد:</span><strong>التوب الكوري</strong></div>
                            <div class="bank-row"><span>الآيبان:</span><strong>SA0000000000000000000000</strong></div>
                            <div class="bank-row"><span>البنك:</span><strong>البنك الأهلي السعودي</strong></div>
                        </div>
                        <div class="image-upload-area">
                            <label>📸 صورة إيصال التحويل</label>
                            <input type="file" id="transferImageInput" accept="image/*">
                            <div id="imagePreviewArea"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="payment-modal-footer">
                <button class="cancel-payment-btn">إلغاء</button>
                <button class="confirm-payment-btn" disabled>تأكيد الطلب</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    setTimeout(() => modal.classList.add('show'), 10);
    
    const allOptions = modal.querySelectorAll('.payment-option');
    const bankSection = modal.querySelector('#bankTransferSection');
    const confirmBtn = modal.querySelector('.confirm-payment-btn');
    const cancelBtn = modal.querySelector('.cancel-payment-btn');
    const closeBtn = modal.querySelector('.close-modal');
    
    // ✅ دالة رفع الصورة إلى ImgBB (مجاني، بدون حساب)
    async function uploadImageToImgBB(base64String) {
        try {
            // إزالة رأس Base64 (مثل data:image/jpeg;base64,)
            const base64Data = base64String.split(',')[1];
            
            // مفتاح API مجاني لـ ImgBB
            const apiKey = 'e5ece8b2141f5b5f92c22e0ee5f29c48';
            
            const formData = new FormData();
            formData.append('image', base64Data);
            formData.append('key', apiKey);
            
            const response = await fetch('https://api.imgbb.com/1/upload', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                return result.data.url;
            } else {
                console.error('❌ ImgBB فشل:', result);
                return null;
            }
        } catch (error) {
            console.error('❌ خطأ في الرفع:', error);
            return null;
        }
    }
    
    // ✅ معالج رفع الصورة (باستخدام ImgBB)
    const imageInput = modal.querySelector('#transferImageInput');
    const imagePreview = modal.querySelector('#imagePreviewArea');
    
    if (imageInput) {
        imageInput.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (file) {
                // عرض معاينة مؤقتة
                const tempReader = new FileReader();
                tempReader.onload = function(event) {
                    imagePreview.innerHTML = `<img src="${event.target.result}" alt="إيصال التحويل" style="max-width: 100%; border-radius: 8px;">`;
                    imagePreview.innerHTML += '<p style="font-size: 12px; color: orange;">⏳ جاري رفع الصورة...</p>';
                };
                tempReader.readAsDataURL(file);
                
                // رفع الصورة إلى ImgBB
                const reader = new FileReader();
                reader.onload = async function(event) {
                    const base64String = event.target.result;
                    const imageUrl = await uploadImageToImgBB(base64String);
                    
                    if (imageUrl) {
                        uploadedImageUrl = imageUrl;
                        imagePreview.innerHTML = `<img src="${uploadedImageUrl}" alt="إيصال التحويل" style="max-width: 100%; border-radius: 8px;">`;
                        imagePreview.innerHTML += '<p style="font-size: 12px; color: green;">✅ تم رفع الصورة بنجاح</p>';
                        console.log('✅ رابط الصورة:', uploadedImageUrl);
                    } else {
                        // ✅ إذا فشل الرفع، استخدم صورة وهمية
                        const dummyImage = 'https://via.placeholder.com/400x300?text=لم+يتم+رفع+الصورة';
                        uploadedImageUrl = dummyImage;
                        imagePreview.innerHTML = `<img src="${dummyImage}" alt="إيصال التحويل" style="max-width: 100%; border-radius: 8px;">`;
                        imagePreview.innerHTML += '<p style="font-size: 12px; color: red;">⚠️ فشل رفع الصورة، يمكنك إكمال الطلب</p>';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // ✅ اختيار طريقة الدفع
    allOptions.forEach(option => {
        option.addEventListener('click', () => {
            const isDisabled = option.classList.contains('disabled');
            
            if (isDisabled) {
                const methodName = option.querySelector('h4').textContent;
                alert(`⚠️ طريقة الدفع "${methodName}" سيتم تفعيلها قريباً`);
                return;
            }
            
            allOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedMethod = option.getAttribute('data-method');
            
            if (selectedMethod === 'bank') {
                bankSection.style.display = 'block';
            } else {
                bankSection.style.display = 'none';
                uploadedImageUrl = null;
                if (imagePreview) imagePreview.innerHTML = '';
            }
            
            confirmBtn.disabled = false;
        });
    });
    
    // ✅ إلغاء
    function closeModal() {
        modal.remove();
        document.body.style.overflow = '';
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalButtonText;
    }
    
    cancelBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    
    // ✅ تأكيد الطلب
    confirmBtn.addEventListener('click', () => {
        if (!selectedMethod) {
            alert('❌ الرجاء اختيار طريقة الدفع');
            return;
        }
        
        if (selectedMethod === 'bank' && !uploadedImageUrl) {
            alert('❌ الرجاء رفع صورة إيصال التحويل');
            return;
        }
        
        let methodName = '';
        switch(selectedMethod) {
            case 'cod': methodName = 'الدفع عند الاستلام'; break;
            case 'bank': methodName = 'تحويل بنكي'; break;
            default: methodName = selectedMethod;
        }
        
        modal.remove();
        document.body.style.overflow = '';
        
        sendOrderToEmail(name, phone, region, city, street, buildingNumber, cart, total, subtotal,
             shipping, tax, methodName, uploadedImageUrl);
    });
}

// ======================== [8] إرسال الطلب عبر EmailJS ====================
function sendOrderToEmail(name, phone, region, city, street, buildingNumber, cart, total, subtotal, 
    shipping, tax, paymentMethod, transfer_image_url = '') {
    const fullAddress = `${city}، ${street}، رقم ${buildingNumber}، ${region}`;
    
    // تجهيز نص المنتجات
    let productsText = '';
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        productsText += `┌─────────────────────────────────────────────────────────────┐\n`;
        productsText += `│ ${index + 1}. ${item.name}\n`;
        productsText += `│   🏷️ السعر: ${item.price} ر.س للقطعة\n`;
        productsText += `│   🔢 الكمية: ${item.quantity} قطعة\n`;
        productsText += `│   💰 الإجمالي: ${itemTotal} ر.س\n`;
        productsText += `│   🔧 رقم OEM: ${item.oem || 'غير متوفر'}\n`;
        productsText += `└─────────────────────────────────────────────────────────────┘\n\n`;
    });
    
    const orderNumber = 'ORD-' + Date.now().toString().slice(-8);
    const currentDate = new Date().toLocaleDateString('ar-SA');
    
    const templateParams = {
        customer_email: "topkoreanorders99@gmail.com",
        customer_name: name,
        customer_phone: phone,
        customer_region: region,
        customer_city: city,
        customer_street: street,
        customer_building: buildingNumber,
        customer_address: fullAddress,
        order_date: currentDate,
        order_number: orderNumber,
        products_text: productsText,
        subtotal: subtotal.toFixed(2),
        shipping: shipping === 0 ? 'مجاني' : shipping + ' ر.س',
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        payment_method: paymentMethod,
        transfer_image: transfer_image_url  || ''
    };
    
    // ✅ تم تصحيح Service ID
    emailjs.send('service_beh6m5u', 'template_xcymf0p', templateParams)
        .then(() => {
            localStorage.removeItem('cart');
            alert(`✅ تم استلام طلبك بنجاح!\n📋 رقم الطلب: ${orderNumber}\n📧 تم إرسال نسخة من الطلب إلى البريد الإلكتروني.`);
            window.location.href = 'thank-you.html';
        })
        .catch((error) => {
            console.error('❌ خطأ:', error);
            alert('❌ حدث خطأ في إرسال الطلب: ' + (error.text || error.message || error));
        });
}

// ======================== [9] تحديث عداد السلة ========================
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // ✅ عدد المنتجات المختلفة (عدد العناصر في المصفوفة)
    const totalItems = cart.length;
    
    const dots = document.querySelectorAll('.cart-dot');
    
    dots.forEach(dot => {
        dot.textContent = totalItems;
        dot.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

// ======================== [10] تفعيل زر GPS ============================
function setupGPSLocation() {
    const gpsBtn = document.getElementById('getLocationBtn');
    
    if (!gpsBtn) return;
    
    gpsBtn.addEventListener('click', function() {
        if (!navigator.geolocation) {
            alert('❌ متصفحك لا يدعم خدمة تحديد الموقع');
            return;
        }
        
        const originalText = gpsBtn.innerHTML;
        gpsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تحديد موقعك...';
        gpsBtn.disabled = true;
        
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                reverseGeocode(lat, lng, gpsBtn, originalText);
            },
            function(error) {
                gpsBtn.innerHTML = originalText;
                gpsBtn.disabled = false;
                
                let errorMessage = '';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'الرجاء السماح بتحديد الموقع في متصفحك';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'تعذر الحصول على موقعك، تأكد من تشغيل GPS';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'انتهى وقت محاولة تحديد الموقع';
                        break;
                    default:
                        errorMessage = 'حدث خطأ غير معروف';
                }
                alert('❌ ' + errorMessage);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
}

// ======================== [11] تحويل الإحداثيات إلى عنوان ===============
function reverseGeocode(lat, lng, gpsBtn, originalText) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=ar`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.address) {
                const address = data.address;
                let region = address.state || address.region || '';
                let city = address.city || address.town || address.village || address.municipality || '';
                let road = address.road || address.street || '';
                let houseNumber = address.house_number || '';
                let suburb = address.suburb || address.neighbourhood || '';
                
                if (region.includes('الرياض')) region = 'الرياض';
                else if (region.includes('مكة')) region = 'مكة المكرمة';
                else if (region.includes('المدينة')) region = 'المدينة المنورة';
                else if (region.includes('الشرقية')) region = 'الشرقية';
                else if (region.includes('القصيم')) region = 'القصيم';
                else if (region.includes('عسير')) region = 'عسير';
                else if (region.includes('تبوك')) region = 'تبوك';
                else if (region.includes('حائل')) region = 'حائل';
                else if (region.includes('جازان')) region = 'جازان';
                else if (region.includes('نجران')) region = 'نجران';
                else if (region.includes('الباحة')) region = 'الباحة';
                else if (region.includes('الجوف')) region = 'الجوف';
                else if (region.includes('الحدود')) region = 'الحدود الشمالية';
                
                if (region) {
                    const regionSelect = document.getElementById('region');
                    if (regionSelect && regionSelect.querySelector(`option[value="${region}"]`)) {
                        regionSelect.value = region;
                        regionSelect.dispatchEvent(new Event('change'));
                        
                        setTimeout(() => {
                            if (city) {
                                const citySelect = document.getElementById('city');
                                if (citySelect && citySelect.querySelector(`option[value="${city}"]`)) {
                                    citySelect.value = city;
                                }
                            }
                        }, 200);
                    }
                }
                
                const streetInput = document.getElementById('street');
                if (streetInput) {
                    let streetText = road;
                    if (suburb) streetText += (streetText ? '، ' : '') + suburb;
                    streetInput.value = streetText;
                }
                
                const buildingInput = document.getElementById('buildingNumber');
                if (buildingInput && houseNumber) {
                    buildingInput.value = houseNumber;
                }
                
                alert('✅ تم تحديد موقعك بنجاح! تم تعبئة بيانات العنوان تلقائياً.');
            } else {
                alert('❌ تعذر الحصول على تفاصيل العنوان، الرجاء إدخال العنوان يدوياً');
            }
            
            gpsBtn.innerHTML = originalText;
            gpsBtn.disabled = false;
        })
        .catch(error => {
            console.error('خطأ:', error);
            alert('❌ حدث خطأ في تحديد الموقع، الرجاء إدخال العنوان يدوياً');
            gpsBtn.innerHTML = originalText;
            gpsBtn.disabled = false;
        });
}
function clearCart() {
    if (confirm('⚠️ هل أنت متأكد من تفريغ السلة بالكامل؟')) {
        localStorage.removeItem('cart');
        displayCartItems();
        updateCartCount();
        showNotification('✅ تم تفريغ السلة بنجاح', 'success');
    }
}
// ======================== معالجة رفع الصورة ========================
async function setupImageUpload() {
    const imageInput = document.getElementById('transferImage');
    if (!imageInput) return;
    
    // ✅ دالة رفع الصورة إلى Catbox.moe
    async function uploadImageToCatbox(base64String) {
        try {
            const response = await fetch(base64String);
            const blob = await response.blob();
            
            const formData = new FormData();
            formData.append('image', blob, 'receipt.jpg');
            
            const uploadResponse = await fetch('https://catbox.moe/user/api.php', {
                method: 'POST',
                body: formData
            });
            
            const imageUrl = await uploadResponse.text();
            return imageUrl.trim();
        } catch (error) {
            console.error('❌ فشل رفع الصورة:', error);
            return null;
        }
    }
    
    imageInput.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (file) {
            // عرض معاينة مؤقتة
            const tempReader = new FileReader();
            tempReader.onload = function(event) {
                const preview = document.getElementById('imagePreview');
                if (preview) {
                    preview.innerHTML = `<img src="${event.target.result}" alt="إيصال التحويل" style="max-width: 100%; border-radius: 8px;">`;
                    preview.innerHTML += '<p style="font-size: 12px; color: green;">⏳ جاري رفع الصورة...</p>';
                }
            };
            tempReader.readAsDataURL(file);
            
            // رفع الصورة إلى Catbox
            const reader = new FileReader();
            reader.onload = async function(event) {
                const base64String = event.target.result;
                const imageUrl = await uploadImageToCatbox(base64String);
                
                if (imageUrl) {
                    uploadedImageBase64 = imageUrl;  // ✅ الآن الرابط وليس Base64
                    const preview = document.getElementById('imagePreview');
                    if (preview) {
                        preview.innerHTML = `<img src="${imageUrl}" alt="إيصال التحويل" style="max-width: 100%; border-radius: 8px;">`;
                        preview.innerHTML += '<p style="font-size: 12px; color: green;">✅ تم رفع الصورة بنجاح</p>';
                    }
                    console.log('✅ رابط الصورة:', imageUrl);
                } else {
                    const preview = document.getElementById('imagePreview');
                    if (preview) {
                        preview.innerHTML = '<p style="color: red;">❌ فشل رفع الصورة، حاول مرة أخرى</p>';
                    }
                    uploadedImageBase64 = null;
                }
            };
            reader.readAsDataURL(file);
        }
    });
}
