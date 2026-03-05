/* ===============================================
   AARZAH - JAVASCRIPT CORE
   Menu, Cart, Search, and Navigation
   =============================================== */

// ========== CART MANAGEMENT ==========
class Cart {
  constructor() {
    this.items = this.loadCart();
    this.updateBadge();
  }

  loadCart() {
    try {
      return JSON.parse(localStorage.getItem('aarzah_cart')) || [];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    localStorage.setItem('aarzah_cart', JSON.stringify(this.items));
    this.updateBadge();
  }

  addItem(name, price, image) {
    this.items.push({
      id: Date.now(),
      name,
      price,
      image,
      quantity: 1,
      addedAt: new Date().toISOString()
    });
    this.saveCart();
    this.showToast(`${name} added to cart!`);
  }

  removeItem(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.saveCart();
  }

  updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
      badge.textContent = this.items.length;
      badge.style.display = this.items.length > 0 ? 'flex' : 'none';
    }
  }

  showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideUp 300ms ease reverse forwards';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }
}

// Initialize cart
const cart = new Cart();

// ========== MENU FUNCTIONALITY ==========
function toggleMenu() {
  const sideMenu = document.getElementById('sideMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  
  if(!sideMenu || !menuOverlay) {
    console.warn('Menu elements not found');
    return;
  }
  
  const isActive = sideMenu.classList.contains('active');
  
  if(isActive) {
    // Close menu
    sideMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  } else {
    // Open menu
    sideMenu.classList.add('active');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }
}

function initMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const closeMenu = document.getElementById('closeMenu');
  const sideMenu = document.getElementById('sideMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const menuCategoryBtns = document.querySelectorAll('.menu-category-btn');

  if (!menuBtn && !sideMenu) return;

  // Toggle menu button
  if(menuBtn) {
    menuBtn.addEventListener('click', toggleMenu);
  }

  // Close menu
  if(closeMenu) {
    closeMenu.addEventListener('click', toggleMenu);
  }

  if(menuOverlay) {
    menuOverlay.addEventListener('click', toggleMenu);
  }

  // Expandable categories
  menuCategoryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const submenu = btn.nextElementSibling;
      const isExpanded = btn.classList.contains('expanded');
      
      // Close other submenus
      menuCategoryBtns.forEach(b => {
        b.classList.remove('expanded');
        if(b.nextElementSibling) {
          b.nextElementSibling.classList.remove('active');
        }
      });

      // Toggle this submenu with smooth animation
      if (!isExpanded) {
        btn.classList.add('expanded');
        if(submenu) submenu.classList.add('active');
      }
    });
  });

  // Close menu on link click
  const menuLinks = document.querySelectorAll('.menu-link, .submenu a, .menu-login-btn');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(() => {
        sideMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }, 100);
    });
  });
}

// ========== CART FUNCTIONS ==========
window.addToCart = function(name, price, image = 'https://via.placeholder.com/300') {
  cart.addItem(name, price, image);
};

// ========== PAGE ROUTING ==========
function showToast(message) {
  cart.showToast(message);
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  
  // Update cart badge on page load
  cart.updateBadge();

  // Handle announcement scroller
  const announcementSlider = document.querySelector('.announcement-slider');
  if (announcementSlider) {
    // Clone items for infinite scroll
    const items = announcementSlider.querySelectorAll('span');
    items.forEach(item => {
      const clone = item.cloneNode(true);
      announcementSlider.appendChild(clone);
    });
  }

  // Product card click tracking
  const productImageLinks = document.querySelectorAll('.product-image-link');
  productImageLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.closest('.product-card').getAttribute('data-id') || '1';
      window.location.href = `product-detail.html?id=${id}`;
    });
  });
});

// ========== PRODUCT DETAIL PAGE ==========
if (document.querySelector('.image-carousel')) {
  initProductDetail();
}

function initProductDetail() {
  const carousel = document.querySelector('.image-carousel');
  const dots = document.querySelectorAll('.carousel-dot');

  if (!carousel) return;

  // Update dots on scroll
  carousel.addEventListener('scroll', () => {
    const index = Math.round(carousel.scrollLeft / carousel.offsetWidth);
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  });

  // Size selector
  const sizeBtns = document.querySelectorAll('.size-btn');
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Color selector
  const colorBtns = document.querySelectorAll('.color-btn');
  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      colorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Back button
  const backBtn = document.querySelector('.detail-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => window.history.back());
  }

  // Add to cart from detail
  const addToCartBtn = document.querySelector('.add-to-cart-full');
  const buyNowBtn = document.querySelector('.buy-now-btn');

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const name = document.querySelector('.detail-name').textContent;
      const price = parseInt(document.querySelector('.detail-price .price').textContent.replace(/[₹,]/g, ''));
      const image = document.querySelector('.carousel-image img').src;
      addToCart(name, price, image);
    });
  }

  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      const name = document.querySelector('.detail-name').textContent;
      const price = parseInt(document.querySelector('.detail-price .price').textContent.replace(/[₹,]/g, ''));
      const image = document.querySelector('.carousel-image img').src;
      addToCart(name, price, image);
      setTimeout(() => {
        window.location.href = 'checkout.html';
      }, 300);
    });
  }
}

// ========== SEARCH PAGE ==========
if (document.querySelector('.search-container')) {
  initSearchPage();
}

function initSearchPage() {
  const searchInput = document.querySelector('.search-input');
  const recentList = document.querySelector('.recent-list');

  if (!searchInput) return;

  // Load recent searches
  const recentSearches = JSON.parse(localStorage.getItem('aarzah_recent_searches')) || [];
  
  if (recentList && recentSearches.length > 0) {
    recentList.innerHTML = recentSearches.map((search, idx) => `
      <div class="recent-item" onclick="performSearch('${search}')">${search}</div>
    `).join('');
  }

  // Handle search
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch(searchInput.value);
    }
  });

  document.querySelector('.search-btn').addEventListener('click', () => {
    performSearch(searchInput.value);
  });
}

window.performSearch = function(query) {
  if (!query.trim()) return;

  // Save to recent
  let recent = JSON.parse(localStorage.getItem('aarzah_recent_searches')) || [];
  recent = [query, ...recent.filter(s => s !== query)].slice(0, 10);
  localStorage.setItem('aarzah_recent_searches', JSON.stringify(recent));

  // Redirect with query
  window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
};

// ========== CHECKOUT PAGE ==========
if (document.querySelector('.checkout-section')) {
  initCheckout();
}

function initCheckout() {
  const cartItems = JSON.parse(localStorage.getItem('aarzah_cart') || '[]');
  const appliedCoupon = JSON.parse(localStorage.getItem('aarzah_applied_coupon') || '{}');
  
  // Render cart summary
  const cartSummary = document.getElementById('cartSummary');
  if (cartSummary) {
    if (cartItems.length === 0) {
      cartSummary.innerHTML = '<p style="text-align:center;padding:20px;color:#999">Your cart is empty. <a href="index.html" style="color:#000;font-weight:600">Continue Shopping</a></p>';
    } else {
      let html = '<div style="max-height:200px;overflow-y:auto">';
      cartItems.forEach((item, idx) => {
        html += `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #e0e0e0">
            <div style="flex:1">
              <div style="font-weight:600;font-size:14px">${item.name}</div>
              <div style="font-size:12px;color:#999">Qty: ${item.quantity || 1}</div>
            </div>
            <div style="text-align:right">
              <div style="font-weight:600">₹${item.price * (item.quantity || 1)}</div>
              <button onclick="removeItemFromCart(${item.id})" style="background:none;border:none;color:#d32f2f;font-size:12px;cursor:pointer;text-decoration:underline">Remove</button>
            </div>
          </div>
        `;
      });
      html += '</div>';
      cartSummary.innerHTML = html;
    }
  }

  // Calculate and display totals
  updateOrderTotal();
}

function updateOrderTotal() {
  const cartItems = JSON.parse(localStorage.getItem('aarzah_cart') || '[]');
  const appliedCoupon = JSON.parse(localStorage.getItem('aarzah_applied_coupon') || '{}');
  
  let subtotal = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  let discount = 0;
  let shippingFee = 0;
  
  if (appliedCoupon.discount) {
    discount = Math.floor(subtotal * appliedCoupon.discount / 100);
  }
  
  // Calculate shipping fee (free for orders over 500)
  if (subtotal < 500) {
    shippingFee = 50;
  }
  
  const total = subtotal - discount + shippingFee;
  
  // Update UI
  const subtotalEl = document.getElementById('subtotal');
  const discountEl = document.getElementById('discount');
  const shippingEl = document.getElementById('shipping');
  const totalEl = document.getElementById('totalAmount');
  
  if (subtotalEl) subtotalEl.textContent = '₹' + subtotal;
  if (discountEl) discountEl.textContent = '-₹' + discount;
  if (shippingEl) {
    if (shippingFee === 0) {
      shippingEl.textContent = 'Free';
      shippingEl.style.color = '#2e7d32';
    } else {
      shippingEl.textContent = '₹' + shippingFee;
      shippingEl.style.color = 'var(--secondary)';
    }
  }
  if (totalEl) totalEl.textContent = '₹' + total;
}

window.removeItemFromCart = function(id) {
  let cartItems = JSON.parse(localStorage.getItem('aarzah_cart') || '[]');
  cartItems = cartItems.filter(item => item.id !== id);
  localStorage.setItem('aarzah_cart', JSON.stringify(cartItems));
  cart.items = cartItems;
  cart.updateBadge();
  initCheckout();
  cart.showToast('Item removed from cart');
};

window.removeFromCart = function(id) {
  removeItemFromCart(id);
};

// ========== LOGIN PAGE ==========
if (document.querySelector('.login-container')) {
  initLoginPage();
}

function initLoginPage() {
  const loginBtn = document.querySelector('.login-btn');
  const phoneInput = document.querySelector('input[name="phone"]');

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const phone = phoneInput.value;
      
      if (!phone || phone.length !== 10) {
        alert('Please enter a valid 10-digit phone number');
        return;
      }

      // Simulate OTP
      alert(`OTP sent to +91${phone}`);
      setTimeout(() => {
        localStorage.setItem('aarzah_user', JSON.stringify({ phone: '+91' + phone, loginTime: new Date() }));
        window.location.href = 'index.html';
      }, 1000);
    });
  }

  // Enter key support
  if (phoneInput) {
    phoneInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') loginBtn.click();
    });
  }
}

// ========== SMOOTH SCROLL ON CATEGORY CLICK ==========
document.addEventListener('DOMContentLoaded', () => {
  const categoryItems = document.querySelectorAll('.category-item');
  categoryItems.forEach(item => {
    item.addEventListener('click', () => {
      const category = item.dataset.category;
      cart.showToast(`Viewing ${category}`);
      // In a real app, this would filter/search for that category
    });
  });
});

// ========== PREVENT DOUBLE-CLICK ZOOM ==========
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, false);
