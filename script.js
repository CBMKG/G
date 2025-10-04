// Theme Management
function initTheme() {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeToggle();
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggle();
}

function updateThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const icon = themeToggle.querySelector('.theme-icon');
        if (icon) {
            icon.textContent = currentTheme === 'light' ? 'DARK' : 'LIGHT';
        }
    }
}

// Package Selection
function switchPayment(type) {
    const robuxPackages = document.getElementById('robux-packages');
    const idrPackages = document.getElementById('idr-packages');
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    
    if (type === 'robux') {
        robuxPackages.style.display = 'grid';
        idrPackages.style.display = 'none';
        tabs[0].classList.add('active');
    } else {
        robuxPackages.style.display = 'none';
        idrPackages.style.display = 'grid';
        tabs[1].classList.add('active');
    }
}

function selectPackage(packageName, price) {
    localStorage.setItem('selectedPackage', packageName);
    localStorage.setItem('selectedPrice', price);
    window.location.href = 'order.html';
}

// Password Visibility Toggle
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('robloxPassword');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.textContent = '○';
    } else {
        passwordInput.type = 'password';
        eyeIcon.textContent = '●';
    }
}

// Security Modal
function showSecurityModal() {
    const modal = document.getElementById('securityModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeSecurityModal() {
    const modal = document.getElementById('securityModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Order Form
function initOrderForm() {
    const packageInfo = document.getElementById('packageInfo');
    if (packageInfo) {
        const packageName = localStorage.getItem('selectedPackage');
        const price = localStorage.getItem('selectedPrice');
        
        if (packageName && price) {
            packageInfo.textContent = `${packageName} - ${price}`;
        } else {
            packageInfo.textContent = 'Tidak ada paket yang dipilih';
        }
    }
    
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmit);
    }
    
    const passwordInput = document.getElementById('robloxPassword');
    if (passwordInput) {
        passwordInput.addEventListener('focus', function() {
            const modalShown = sessionStorage.getItem('securityModalShown');
            if (!modalShown) {
                showSecurityModal();
                sessionStorage.setItem('securityModalShown', 'true');
            }
        });
    }
}

function handleOrderSubmit(e) {
    e.preventDefault();
    
    const packageName = localStorage.getItem('selectedPackage');
    const price = localStorage.getItem('selectedPrice');
    const username = document.getElementById('robloxUsername').value;
    const password = document.getElementById('robloxPassword').value;
    const customerName = document.getElementById('customerName').value || 'Customer';
    const customerPhone = document.getElementById('customerPhone').value;
    const notes = document.getElementById('notes').value;
    
    const order = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        package: packageName,
        price: price,
        robloxUsername: username,
        robloxPassword: password,
        customerName: customerName,
        customerPhone: customerPhone,
        notes: notes,
        status: 'pending',
        accountStatus: 'offline'
    };
    
    saveOrder(order);
    
    const whatsappNumber = '6281330032894';
    let message = `*ORDER BARU - ANTC STORE*\n\n`;
    message += `*Paket:* ${packageName}\n`;
    message += `*Harga:* ${price}\n\n`;
    message += `*Data Customer:*\n`;
    message += `Nama: ${customerName}\n`;
    if (customerPhone) message += `No. HP: ${customerPhone}\n`;
    message += `\n*Akun Roblox:*\n`;
    message += `Username: ${username}\n`;
    message += `Password: ${password}\n`;
    if (notes) message += `\n*Catatan:* ${notes}\n`;
    message += `\n*Pembayaran via Dana:* +62 813-3003-2894\n`;
    message += `\n_Terima kasih telah memesan di ANTC STORE!_`;
    
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    const successModal = document.getElementById('orderSuccessModal');
    if (successModal) {
        successModal.classList.add('active');
        
        setTimeout(() => {
            window.open(whatsappURL, '_blank');
            
            setTimeout(() => {
                successModal.classList.remove('active');
                window.location.href = 'index.html';
            }, 2000);
        }, 1500);
    } else {
        window.open(whatsappURL, '_blank');
        alert('Order berhasil! Anda akan diarahkan ke WhatsApp untuk konfirmasi pembayaran.');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

function saveOrder(order) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Admin Dashboard
function initAdminDashboard() {
    const loginForm = document.getElementById('adminLoginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleAdminLogin);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    checkAdminSession();
}

function handleAdminLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const errorMessage = document.getElementById('loginError');
    
    if (username === 'ANTC' && password === 'TRX') {
        localStorage.setItem('adminLoggedIn', 'true');
        showDashboard();
    } else {
        errorMessage.textContent = 'Username atau password salah!';
    }
}

function handleLogout() {
    localStorage.removeItem('adminLoggedIn');
    location.reload();
}

function checkAdminSession() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    
    if (isLoggedIn === 'true') {
        showDashboard();
    }
}

function showDashboard() {
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginSection) loginSection.style.display = 'none';
    if (dashboardSection) dashboardSection.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'block';
    
    loadOrders();
    updateStats();
}

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tableBody = document.getElementById('ordersTableBody');
    
    if (tableBody) {
        if (orders.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="10" class="no-orders">Belum ada order masuk</td></tr>';
        } else {
            tableBody.innerHTML = '';
            orders.reverse().forEach(order => {
                const row = createOrderRow(order);
                tableBody.appendChild(row);
            });
        }
    }
}

function createOrderRow(order) {
    const tr = document.createElement('tr');
    
    const date = new Date(order.timestamp);
    const formattedDate = date.toLocaleString('id-ID');
    
    const statusClass = `status-${order.status}`;
    const accountStatusClass = `status-${order.accountStatus}`;
    
    tr.innerHTML = `
        <td>#${order.id.toString().slice(-6)}</td>
        <td>${formattedDate}</td>
        <td>${order.package}</td>
        <td>${order.price}</td>
        <td>${order.robloxUsername}</td>
        <td>${order.robloxPassword}</td>
        <td><span class="status-badge ${accountStatusClass}">${order.accountStatus.toUpperCase()}</span></td>
        <td>${order.customerName}${order.customerPhone ? '<br>' + order.customerPhone : ''}</td>
        <td><span class="status-badge ${statusClass}">${order.status.toUpperCase()}</span></td>
        <td>
            <button class="btn-small" onclick="updateOrderStatus(${order.id}, 'processing')">Process</button>
            <button class="btn-small" onclick="updateOrderStatus(${order.id}, 'completed')">Complete</button>
            <button class="btn-small" onclick="toggleAccountStatus(${order.id})">Toggle</button>
        </td>
    `;
    
    return tr;
}

function updateOrderStatus(orderId, newStatus) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    orders = orders.map(order => {
        if (order.id === orderId) {
            order.status = newStatus;
        }
        return order;
    });
    
    localStorage.setItem('orders', JSON.stringify(orders));
    loadOrders();
    updateStats();
}

function toggleAccountStatus(orderId) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    orders = orders.map(order => {
        if (order.id === orderId) {
            order.accountStatus = order.accountStatus === 'online' ? 'offline' : 'online';
        }
        return order;
    });
    
    localStorage.setItem('orders', JSON.stringify(orders));
    loadOrders();
}

function updateStats() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('pendingOrders').textContent = pendingOrders;
    document.getElementById('processingOrders').textContent = processingOrders;
    document.getElementById('completedOrders').textContent = completedOrders;
}

function refreshOrders() {
    loadOrders();
    updateStats();
    alert('Orders refreshed!');
}

function clearAllOrders() {
    if (confirm('Apakah Anda yakin ingin menghapus semua order? Tindakan ini tidak dapat dibatalkan!')) {
        localStorage.removeItem('orders');
        loadOrders();
        updateStats();
        alert('Semua order telah dihapus!');
    }
}

// Ratings Page
function initRatings() {
    const ratingForm = document.getElementById('ratingForm');
    if (ratingForm) {
        ratingForm.addEventListener('submit', handleRatingSubmit);
        initStarRating();
    }
    
    loadRatings();
}

function initStarRating() {
    const stars = document.querySelectorAll('.star');
    const ratingValue = document.getElementById('ratingValue');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            ratingValue.value = rating;
            
            stars.forEach(s => s.classList.remove('active'));
            for (let i = 0; i < rating; i++) {
                stars[i].classList.add('active');
            }
        });
    });
    
    stars.forEach(s => s.classList.add('active'));
}

function handleRatingSubmit(e) {
    e.preventDefault();
    
    const rating = document.getElementById('ratingValue').value;
    const name = document.getElementById('reviewerName').value;
    const text = document.getElementById('reviewText').value;
    
    const review = {
        id: Date.now(),
        rating: parseInt(rating),
        name: name,
        text: text,
        date: new Date().toISOString()
    };
    
    saveRating(review);
    
    alert('Terima kasih atas rating Anda!');
    document.getElementById('ratingForm').reset();
    
    const stars = document.querySelectorAll('.star');
    stars.forEach(s => s.classList.add('active'));
    document.getElementById('ratingValue').value = '5';
    
    loadRatings();
}

function saveRating(review) {
    let ratings = JSON.parse(localStorage.getItem('ratings')) || [];
    ratings.push(review);
    localStorage.setItem('ratings', JSON.stringify(ratings));
}

function loadRatings() {
    const ratings = JSON.parse(localStorage.getItem('ratings')) || [];
    const reviewsList = document.getElementById('reviewsList');
    
    if (reviewsList && ratings.length > 0) {
        const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = (totalRating / ratings.length).toFixed(1);
        
        const overallRatingEl = document.getElementById('overallRating');
        const totalRatingsEl = document.getElementById('totalRatings');
        const satisfactionFillEl = document.getElementById('satisfactionFill');
        const satisfactionPercentEl = document.getElementById('satisfactionPercent');
        
        if (overallRatingEl) overallRatingEl.textContent = avgRating;
        if (totalRatingsEl) totalRatingsEl.textContent = `${ratings.length} ulasan`;
        
        const satisfactionPercent = (avgRating / 5 * 100).toFixed(0);
        if (satisfactionFillEl) satisfactionFillEl.style.width = `${satisfactionPercent}%`;
        if (satisfactionPercentEl) satisfactionPercentEl.textContent = `${satisfactionPercent}% Puas`;
        
        const customReviews = ratings.reverse().map(review => {
            const stars = '★'.repeat(review.rating);
            const date = new Date(review.date);
            const timeAgo = getTimeAgo(date);
            
            return `
                <div class="review-card fade-in-card">
                    <div class="review-header">
                        <div>
                            <strong>${review.name}</strong>
                            <div class="review-stars">${stars}</div>
                        </div>
                        <span class="review-date">${timeAgo}</span>
                    </div>
                    <p class="review-text">${review.text}</p>
                </div>
            `;
        }).join('');
        
        const existingReviews = reviewsList.innerHTML;
        reviewsList.innerHTML = customReviews + existingReviews;
    }
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " tahun lalu";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " bulan lalu";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " hari lalu";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " jam lalu";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " menit lalu";
    
    return "Baru saja";
}

// Loading Screen - Hide after content loaded
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            triggerEntranceAnimations();
        }, 800);
    }
}

// Trigger entrance animations for content
function triggerEntranceAnimations() {
    const navbar = document.querySelector('.navbar');
    const hero = document.querySelector('.hero');
    const sections = document.querySelectorAll('section');
    
    if (navbar) {
        navbar.style.animation = 'slideInLeft 0.6s ease-out';
    }
    
    if (hero) {
        hero.style.animation = 'fadeIn 0.8s ease-out 0.2s both';
    }
    
    sections.forEach((section, index) => {
        section.style.animation = `fadeIn 0.6s ease-out ${0.4 + (index * 0.1)}s both`;
    });
}

// Ensure loading screen hides even if there are errors
window.addEventListener('load', function() {
    const path = window.location.pathname;
    let loadingDuration = 1500;
    
    if (path.includes('admin.html')) {
        loadingDuration = 2500;
    } else if (path.includes('ratings.html')) {
        loadingDuration = 3000;
    } else if (path.includes('order.html')) {
        loadingDuration = 1800;
    }
    
    setTimeout(hideLoadingScreen, loadingDuration);
});

// Fallback to hide loading screen if window.load doesn't fire
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    let loadingDuration = 2000;
    
    if (path.includes('admin.html')) {
        loadingDuration = 3000;
    } else if (path.includes('ratings.html')) {
        loadingDuration = 3500;
    } else if (path.includes('order.html')) {
        loadingDuration = 2200;
    }
    
    setTimeout(hideLoadingScreen, loadingDuration);
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    const path = window.location.pathname;
    
    if (path.includes('order.html')) {
        initOrderForm();
    } else if (path.includes('admin.html')) {
        initAdminDashboard();
    } else if (path.includes('ratings.html')) {
        initRatings();
    }
});
