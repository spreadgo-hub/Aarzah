/* ===============================================
   AARZAH - JAVASCRIPT CORE (OPTIMIZED)
   Menu, Cart, Search, and Navigation
   =============================================== */

// ========== PERFORMANCE UTILITIES ==========
const AppUtils = (() => {
  let debounceTimers = {};
  
  return {
    debounce(func, delay, key = 'default') {
      return (...args) => {
        clearTimeout(debounceTimers[key]);
        debounceTimers[key] = setTimeout(() => func(...args), delay);
      };
    },
    
    throttle(func, delay) {
      let lastCall = 0;
      return (...args) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
          lastCall = now;
          func(...args);
        }
      };
    },
    
    memoize(func) {
      const cache = new Map();
      return (...args) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const result = func(...args);
        cache.set(key, result);
        return result;
      };
    }
  };
})();

// ========== SECURITY MANAGER (NEW) ==========
class SecurityManager {
  constructor() {
    this.sessionId = localStorage.getItem('aarzah_session_id');
    this.csrfToken = localStorage.getItem('aarzah_csrf_token');
    this.APIEndpoint = 'http://localhost:3000'; // Change to actual backend URL
  }

  async initSession() {
    try {
      const response = await fetch(`${this.APIEndpoint}/api/auth/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.sessionId) {
        this.sessionId = data.sessionId;
        this.csrfToken = data.csrfToken;
        localStorage.setItem('aarzah_session_id', data.sessionId);
        localStorage.setItem('aarzah_csrf_token', data.csrfToken);
      }
    } catch (e) {
      console.warn('Session init failed:', e);
    }
  }

  async validateCart(cartItems) {
    if (!this.sessionId) await this.initSession();
    try {
      const response = await fetch(`${this.APIEndpoint}/api/products/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId,
          'X-CSRF-Token': this.csrfToken
        },
        body: JSON.stringify({ items: cartItems, sessionId: this.sessionId })
      });
      return await response.json();
    } catch (e) {
      console.error('Cart validation error:', e);
      return { success: false };
    }
  }

  async validateCoupon(code, subtotal) {
    if (!this.sessionId) await this.initSession();
    try {
      const response = await fetch(`${this.APIEndpoint}/api/coupons/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId,
          'X-CSRF-Token': this.csrfToken
        },
        body: JSON.stringify({ code, sessionId: this.sessionId, subtotal })
      });
      return await response.json();
    } catch (e) {
      console.error('Coupon validation error:', e);
      return { valid: false };
    }
  }

  async calculateCheckout(phone, coupon) {
    if (!this.sessionId) await this.initSession();
    try {
      const response = await fetch(`${this.APIEndpoint}/api/checkout/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId,
          'X-CSRF-Token': this.csrfToken
        },
        body: JSON.stringify({ sessionId: this.sessionId, phone, coupon })
      });
      return await response.json();
    } catch (e) {
      console.error('Checkout calculation error:', e);
      return { success: false };
    }
  }

  async placeOrder(checkoutId, phone, paymentMethod) {
    if (!this.sessionId) await this.initSession();
    try {
      const response = await fetch(`${this.APIEndpoint}/api/orders/place`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId,
          'X-CSRF-Token': this.csrfToken
        },
        body: JSON.stringify({ checkoutId, sessionId: this.sessionId, phone, paymentMethod })
      });
      return await response.json();
    } catch (e) {
      console.error('Order placement error:', e);
      return { success: false };
    }
  }
}

const security = new SecurityManager();

// ========== CART MANAGEMENT (OPTIMIZED) ==========
class Cart {
  constructor() {
    this.items = this.loadCart();
    this.badge = null;
    this.updateBadge();
  }

  loadCart() {
    try {
      const data = localStorage.getItem('aarzah_cart');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Cart load error:', e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem('aarzah_cart', JSON.stringify(this.items));
      this.updateBadge();
    } catch (e) {
      console.error('Cart save error:', e);
    }
  }

  addItem(name, price, image) {
    if (!name || price < 0) return false;
    
    const existingItem = this.items.find(item => item.name === name && item.price === price);
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      this.items.push({
        id: Date.now(),
        name,
        price,
        image,
        quantity: 1,
        addedAt: new Date().toISOString()
      });
    }
    
    this.saveCart();
    this.showToast(`${name} added to cart!`);
    return true;
  }

  removeItem(id) {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => item.id !== id);
    
    if (this.items.length < initialLength) {
      this.saveCart();
      return true;
    }
    return false;
  }

  updateBadge() {
    if (!this.badge) {
      this.badge = document.getElementById('cartBadge');
    }
    
    if (this.badge) {
      const count = this.items.length;
      this.badge.textContent = count;
      this.badge.style.display = count > 0 ? 'flex' : 'none';
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

// ========== MENU FUNCTIONALITY (OPTIMIZED) ==========
const MenuManager = (() => {
  let menu = null;
  let overlay = null;
  let menuBtn = null;
  
  const toggleMenu = () => {
    const isActive = menu?.classList.contains('active');
    
    if (isActive) {
      menu.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      menu.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };
  
  const handleCategoryClick = (btn) => {
    e.preventDefault?.();
    const submenu = btn.nextElementSibling;
    const isExpanded = btn.classList.contains('expanded');
    
    document.querySelectorAll('.menu-category-btn').forEach(b => {
      if (b !== btn) {
        b.classList.remove('expanded');
        b.nextElementSibling?.classList.remove('active');
      }
    });
    
    if (!isExpanded) {
      btn.classList.add('expanded');
      submenu?.classList.add('active');
    }
  };
  
  const closeMenu = () => {
    menu?.classList.remove('active');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  };
  
  return {
    init() {
      menu = document.getElementById('sideMenu');
      overlay = document.getElementById('menuOverlay');
      menuBtn = document.getElementById('menuBtn');
      
      if (!menu || !overlay) return;
      
      // Event delegation instead of individual listeners
      if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
      document.getElementById('closeMenu')?.addEventListener('click', toggleMenu);
      overlay.addEventListener('click', toggleMenu);
      
      // Menu category expansion
      menu.addEventListener('click', (e) => {
        if (e.target.classList.contains('menu-category-btn')) {
          handleCategoryClick(e.target);
        }
      });
      
      // Close menu on link click
      menu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' || e.target.classList.contains('menu-login-btn')) {
          closeMenu();
        }
      });
    }
  };
})();

// Expose globally
window.toggleMenu = () => MenuManager.init() || document.getElementById('sideMenu')?.classList.toggle('active');

// ========== CART FUNCTIONS ==========
window.addToCart = (name, price, image = 'https://via.placeholder.com/300') => {
  return cart.addItem(name, price, image);
};

window.removeItemFromCart = (id) => {
  if (cart.removeItem(id)) {
    initCheckout?.();
    cart.showToast('Item removed from cart');
  }
};

window.removeFromCart = window.removeItemFromCart;

// ========== PAGE ROUTING ==========
function showToast(message) {
  cart.showToast(message);
}

// ========== PRODUCT DETAIL PAGE (OPTIMIZED) ==========
const ProductDetail = (() => {
  let currentIndex = 0;
  const carousel = document.querySelector('.image-carousel');
  const dots = document.querySelectorAll('.carousel-dot');
  
  if (!carousel) return { init: () => {} };
  
  const updateDots = AppUtils.throttle(() => {
    currentIndex = Math.round(carousel.scrollLeft / carousel.offsetWidth);
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }, 100);
  
  const setupSelectors = () => {
    const setupButtonGroup = (selector) => {
      const buttons = document.querySelectorAll(selector);
      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
      });
    };
    
    setupButtonGroup('.size-btn');
    setupButtonGroup('.color-btn');
  };
  
  return {
    init() {
      carousel?.addEventListener('scroll', updateDots);
      setupSelectors();
      
      const backBtn = document.querySelector('.detail-back-btn');
      backBtn?.addEventListener('click', () => window.history.back());
      
      document.querySelector('.add-to-cart-full')?.addEventListener('click', () => {
        const name = document.querySelector('.detail-name').textContent;
        const price = parseInt(document.querySelector('.detail-price .price').textContent.replace(/[₹,]/g, ''));
        const image = document.querySelector('.carousel-image img')?.src;
        addToCart(name, price, image);
      });
      
      document.querySelector('.buy-now-btn')?.addEventListener('click', () => {
        const name = document.querySelector('.detail-name').textContent;
        const price = parseInt(document.querySelector('.detail-price .price').textContent.replace(/[₹,]/g, ''));
        const image = document.querySelector('.carousel-image img')?.src;
        addToCart(name, price, image);
        setTimeout(() => {
          window.location.href = 'checkout.html';
        }, 300);
      });
    }
  };
})();

// ========== SEARCH PAGE (OPTIMIZED) ==========
const SearchManager = (() => {
  const MAX_RECENT = 10;
  
  const saveSearch = (query) => {
    try {
      let recent = JSON.parse(localStorage.getItem('aarzah_recent_searches')) || [];
      recent = [query, ...recent.filter(s => s !== query)].slice(0, MAX_RECENT);
      localStorage.setItem('aarzah_recent_searches', JSON.stringify(recent));
    } catch (e) {
      console.error('Search save error:', e);
    }
  };
  
  return {
    init() {
      const searchInput = document.querySelector('.search-input');
      const recentList = document.querySelector('.recent-list');
      const searchBtn = document.querySelector('.search-btn');
      
      if (!searchInput) return;
      
      // Load recent searches
      try {
        const recentSearches = JSON.parse(localStorage.getItem('aarzah_recent_searches')) || [];
        if (recentList && recentSearches.length > 0) {
          recentList.innerHTML = recentSearches.map(search => `
            <div class="recent-item" data-search="${search}">${search}</div>
          `).join('');
          
          // Event delegation for recent items
          recentList.addEventListener('click', (e) => {
            if (e.target.classList.contains('recent-item')) {
              window.performSearch(e.target.dataset.search);
            }
          });
        }
      } catch (e) {
        console.error('Recent searches load error:', e);
      }
      
      const performSearch = (query = searchInput.value) => {
        if (!query.trim()) return;
        saveSearch(query);
        window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
      };
      
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
      });
      
      searchBtn?.addEventListener('click', performSearch);
      
      window.performSearch = performSearch;
    }
  };
})();

// ========== CHECKOUT PAGE (OPTIMIZED) ==========
function initCheckout() {
  try {
    const cartItems = JSON.parse(localStorage.getItem('aarzah_cart') || '[]');
    const cartSummary = document.getElementById('cartSummary');
    
    if (!cartSummary) return;
    
    if (cartItems.length === 0) {
      cartSummary.innerHTML = '<p style="text-align:center;padding:20px;color:#999">Your cart is empty. <a href="index.html" style="color:#000;font-weight:600">Continue Shopping</a></p>';
    } else {
      const itemsHtml = cartItems.map(item => `
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
      `).join('');
      
      cartSummary.innerHTML = `<div style="max-height:200px;overflow-y:auto">${itemsHtml}</div>`;
    }
    
    updateOrderTotal();
  } catch (e) {
    console.error('Checkout init error:', e);
  }
}

function updateOrderTotal() {
  try {
    const cartItems = JSON.parse(localStorage.getItem('aarzah_cart') || '[]');
    const appliedCoupon = JSON.parse(localStorage.getItem('aarzah_applied_coupon') || '{}');
    
    let subtotal = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    let discount = appliedCoupon.discount ? Math.floor(subtotal * appliedCoupon.discount / 100) : 0;
    let shippingFee = subtotal < 500 ? 50 : 0;
    let total = subtotal - discount + shippingFee;
    
    const updates = {
      subtotal: { el: document.getElementById('subtotal'), text: '₹' + subtotal },
      discount: { el: document.getElementById('discount'), text: '-₹' + discount },
      shipping: { el: document.getElementById('shipping'), text: shippingFee === 0 ? 'Free' : '₹' + shippingFee, color: shippingFee === 0 ? '#2e7d32' : 'var(--secondary)' },
      total: { el: document.getElementById('totalAmount'), text: '₹' + total }
    };
    
    Object.values(updates).forEach(({ el, text, color }) => {
      if (el) {
        el.textContent = text;
        if (color) el.style.color = color;
      }
    });
  } catch (e) {
    console.error('Total calculation error:', e);
  }
}

// ========== LOGIN PAGE (OPTIMIZED) ==========
function initLoginPage() {
  const loginBtn = document.querySelector('.login-btn');
  const phoneInput = document.querySelector('input[name="phone"]');
  
  if (!loginBtn || !phoneInput) return;
  
  const handleLogin = () => {
    const phone = phoneInput.value.trim();
    
    if (!/^\d{10}$/.test(phone)) {
      alert('Please enter a valid 10-digit phone number');
      phoneInput.focus();
      return;
    }
    
    alert(`OTP sent to +91${phone}`);
    setTimeout(() => {
      localStorage.setItem('aarzah_user', JSON.stringify({
        phone: '+91' + phone,
        loginTime: new Date().toISOString()
      }));
      window.location.href = 'index.html';
    }, 500);
  };
  
  loginBtn.addEventListener('click', handleLogin);
  phoneInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
  });
}

// ========== INITIALIZATION (OPTIMIZED) ==========
document.addEventListener('DOMContentLoaded', () => {
  // Initialize secure session
  security.initSession();
  
  // Initialize menu
  MenuManager.init();
  
  // Update cart badge
  cart.updateBadge();

  // Handle announcement scroller
  const announcementSlider = document.querySelector('.announcement-slider');
  if (announcementSlider) {
    const items = Array.from(announcementSlider.querySelectorAll('span'));
    items.forEach(item => announcementSlider.appendChild(item.cloneNode(true)));
  }

  // Product card delegation
  document.addEventListener('click', (e) => {
    if (e.target.closest('.product-image-link')) {
      const id = e.target.closest('.product-card')?.dataset.id || '1';
      window.location.href = `product-detail.html?id=${id}`;
    }
  });

  // Initialize page-specific modules
  if (document.querySelector('.image-carousel')) ProductDetail.init();
  if (document.querySelector('.search-container')) SearchManager.init();
  if (document.querySelector('.checkout-section')) initCheckout();
  if (document.querySelector('.login-container')) initLoginPage();

  // Smooth scroll for categories
  const categoryItems = document.querySelectorAll('.category-item');
  categoryItems.forEach(item => {
    item.addEventListener('click', () => {
      cart.showToast(`Viewing ${item.dataset.category}`);
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

// ========== PERFORMANCE MONITORING ==========
if (window.performance && window.performance.mark) {
  window.addEventListener('load', () => {
    performance.mark('load-complete');
    performance.measure('page-load', 'navigationStart', 'load-complete');
    const measure = performance.getEntriesByName('page-load')[0];
    console.log(`[Performance] Page load: ${measure.duration.toFixed(2)}ms`);
  });
}
