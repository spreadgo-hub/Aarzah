# Aarzah Production Site - Information

## Site Status
✅ **Production Ready** - Live at: https://aarzah.com

## Site Structure
```
├── index.html              # Homepage with product grid
├── product-detail.html     # Single product page
├── checkout.html           # Checkout & payment
├── order-confirmation.html # Order confirmation page
├── order-tracking.html     # Track orders
├── login.html              # User login/signup
├── admin.html              # Admin panel
├── search.html             # Search products
├── search-results.html     # Search results
├── contact.html            # Contact form
├── returns.html            # Returns/exchange info
├── style.css               # All styling (1494 lines)
└── script.js               # All JavaScript (460 lines)
```

## Admin Access
- **URL:** https://aarzah.com/admin.html
- **Username:** admin@aarzah.com
- **Password:** admin123 (⚠️ Change this immediately!)

### To Change Admin Password:
1. Edit `admin.html` line ~25
2. Find: `const validPassword = "admin123";`
3. Change to strong password
4. Re-upload to Hostinger

## Key Features
- ✅ Shopping cart (localStorage)
- ✅ Product management (admin)
- ✅ Razorpay payment integration
- ✅ Order tracking
- ✅ Coupon system
- ✅ Responsive design
- ✅ Mobile-optimized

## Important Settings

### Razorpay Test Mode
- Current Key: `rzp_test_1DP5mmOlF5G0m9`
- Status: **Test Mode** (no real charges)
- Test Card: 4111 1111 1111 1111

### Go Live Checklist
Before switching to production:
- [ ] Change admin password
- [ ] Get production Razorpay key from dashboard
- [ ] Update key in checkout.html (line ~380)
- [ ] Change admin email
- [ ] Remove test data from localStorage
- [ ] Enable HTTPS (auto on Hostinger)

### Shipping Configuration
- Free shipping: Orders > ₹500
- Flat rate: ₹50 for orders < ₹500
- (Configured in script.js updateOrderTotal function)

## Data Storage
All data stored in browser localStorage:
- `aarzah_user` - User profile
- `aarzah_cart` - Shopping cart
- `aarzah_orders` - Order history
- `aarzah_products` - Product catalog
- `aarzah_coupons` - Coupon codes
- `aarzah_discounts` - Product discounts

## File Upload Change Log
- ✅ Fixed UI distortion (menu & layout)
- ✅ Removed padding conflicts
- ✅ Cleaned up all test files
- ✅ Optimized production environment

## Support for Issues

### Menu not appearing
- F12 → Console → Check for errors
- Verify script.js loaded (F12 → Network tab)

### Payment failing
- Check Razorpay key is correct
- Ensure https:// connection
- Check browser console for errors

### Styling broken
- Clear browser cache: Ctrl+Shift+Delete
- Check style.css uploaded successfully

## Future Enhancements
When ready:
1. Migrate to WordPress + WooCommerce
2. Add SMS notifications
3. Implement wishlists
4. Add product reviews

---

**Last Updated:** March 5, 2026  
**Hosting:** Hostinger  
**Site Type:** Static HTML (no backend server)  
**Database:** Browser localStorage

