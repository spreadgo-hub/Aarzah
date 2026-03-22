# WordPress & WooCommerce Data Export - Complete Migration Package

## What's Included

✅ **4 Import-Ready Files** created for WordPress:

1. **aarzah-wordpress-export.xml** - WordPress pages & basic structure
2. **aarzah-woocommerce-products.csv** - All products with prices, stock, images
3. **aarzah-woocommerce-coupons.csv** - All coupon codes
4. **aarzah-woocommerce-customers.csv** - Sample customer data

---

## File Details

### 1. aarzah-wordpress-export.xml
**What it contains:**
- WordPress site structure (XML format)
- 7 standard pages (Home, About, Contact, Returns, Privacy, Terms, Shipping)
- Sample product data
- Admin user information
- 4 product categories (Kurtis, Sarees, Suits, Dresses)

**How to import:**
1. WordPress Admin → **Tools** → **Import**
2. Select **WordPress** importer
3. Upload `aarzah-wordpress-export.xml`
4. Click "Import"
5. Assign content to admin user

---

### 2. aarzah-woocommerce-products.csv
**What it contains:**
- 6 Products with:
  - SKU codes (unique identifiers)
  - Product names and descriptions
  - Regular & sale prices
  - Stock quantities
  - Tax settings
  - Product categories
  - Product images (linked to `/images/products/` folder)
  - Ratings data

**How to import:**
1. WordPress Admin → **Products**
2. Click **Import** button
3. Select **CSV Import plugin** (or built-in importer)
4. Upload `aarzah-woocommerce-products.csv`
5. Map CSV columns to WooCommerce fields
6. Click "Import"

**Column Headers:**
| Column | Example |
|--------|---------|
| ID | 1 |
| SKU | SKU-KURTI-001 |
| Name | Embroidered Cotton Kurti |
| Regular price | 799 |
| Sale price | 649 |
| Stock | 50 |
| Categories | Kurtis |
| Images | images/products/kurtis/embroidered-kurti.svg |

---

### 3. aarzah-woocommerce-coupons.csv
**What it contains:**
- 5 Coupon codes:
  - SAVE20 - 20% discount on min ₹1000
  - FLAT50 - ₹50 flat discount on min ₹500
  - WELCOME10 - 10% first-time buyer discount
  - SUMMER15 - 15% seasonal discount on min ₹200
  - FREESHIP - Free shipping on min ₹499

**How to import:**
1. WordPress Admin → **Marketing** → **Coupons**
2. Click **Import** (if available in your plugin)
3. Or manually recreate using the CSV data
4. Set expiry dates and usage limits

**Coupon Details:**
| Code | Type | Amount | Min Spend | Expiry |
|------|------|--------|-----------|--------|
| SAVE20 | Percentage | 20% | ₹1000 | 2024-12-31 |
| FLAT50 | Fixed | ₹50 | ₹500 | 2024-12-31 |
| WELCOME10 | Percentage | 10% | ₹100 | 2024-06-30 |
| SUMMER15 | Percentage | 15% | ₹200 | 2024-08-31 |
| FREESHIP | Fixed | ₹50 | ₹499 | 2024-12-31 |

---

### 4. aarzah-woocommerce-customers.csv
**What it contains:**
- Sample customer record (demo account)
- Customer email: customer@example.com
- Billing & shipping address information
- Phone number and location (Mumbai, Maharashtra)

**How to import:**
1. WordPress Admin → **Users** → **Import**
2. Or use customer import plugin
3. Upload `aarzah-woocommerce-customers.csv`
4. Map fields and import

---

## Step-by-Step WordPress Migration

### Phase 1: Prepare WordPress (30 minutes)

1. **Install WordPress**
   - On Hostinger: Create new WordPress instance
   - Or on subdomain: shop.aarzah.com

2. **Install WooCommerce**
   - WordPress Admin → **Plugins** → **Add New**
   - Search "WooCommerce" → Install & Activate
   - Run WooCommerce Setup Wizard

3. **Install Import Plugins**
   - **WooCommerce - Import Products**
   - **CSV Import Suite** (for coupons/customers)
   - Or use built-in importers

---

### Phase 2: Import Site Structure (10 minutes)

1. **WordPress Admin** → **Tools** → **Import**
2. Select **WordPress** importer
3. Upload: `aarzah-wordpress-export.xml`
4. Assign content to admin user
5. Wait for import to complete

---

### Phase 3: Import Products (15 minutes)

1. **WordPress Admin** → **Products** → **Import**
2. Upload: `aarzah-woocommerce-products.csv`
3. **Map Columns:**
   - Name → Product Name
   - SKU → SKU
   - Regular price → Price
   - Sale price → Sale Price
   - Stock → Stock Quantity
   - Categories → Product Category
   - Images → Product Image

4. Click **Import**
5. Products appear in WooCommerce catalog

---

### Phase 4: Import Coupons (10 minutes)

1. **WordPress Admin** → **Marketing** → **Coupons**
2. Click **Add Coupon** or **Import**
3. Enter coupon details from CSV:
   - Code: SAVE20
   - Type: Percentage Discount
   - Amount: 20%
   - Min Spend: ₹1000
   - Expiry: 2024-12-31

4. Repeat for all 5 coupons

---

### Phase 5: Configure Settings (20 minutes)

1. **WooCommerce Settings** → **General**
   - Store name: Aarzah
   - Store address: Your location
   - Currency: INR (₹)

2. **Products** tab
   - Disable reviews if not needed
   - Set measurement units

3. **Shipping** tab
   - Free shipping above ₹500
   - Flat rate ₹50 for lower orders

4. **Taxes** tab
   - Add India tax rules
   - Or disable if not applicable

5. **Payments** tab
   - Add Razorpay payment gateway
   - Use production keys

---

### Phase 6: Theme & Design (30 minutes)

1. **Appearance** → **Themes**
   - Choose WooCommerce theme (Storefront recommended)
   - Or use current theme

2. **Customize** theme:
   - Logo: Upload Aarzah logo
   - Colors: Set primary to #d32f2f
   - Typography: System fonts

3. **Menus** → Set up navigation
4. **Header/Footer** → Configure

---

### Phase 7: Content & Copy (20 minutes)

1. **Pages** → **Edit**
   - Update About Us page
   - Add company story
   - Add contact information

2. **Add Missing Pages:**
   - Frequently Asked Questions
   - Size Guide
   - Material Care Instructions
   - Blog (if desired)

---

### Phase 8: Testing (30 minutes)

✅ **Test Checklist:**
- [ ] Products display correctly
- [ ] Images load properly
- [ ] Prices show with discounts
- [ ] Shopping cart works
- [ ] Checkout process works
- [ ] Payment gateway (Razorpay) works
- [ ] Coupons apply correctly
- [ ] Order confirmation emails send
- [ ] Admin receives order notifications
- [ ] Mobile responsive

---

### Phase 9: Go Live (15 minutes)

1. **Update DNS** (if migrating domains)
   - Point domain to WordPress server
   - Wait for DNS propagation (24-48 hours)

2. **Set up redirects** (from static site)
   - Old URLs → WordPress URLs
   - Maintains SEO ranking

3. **Enable SSL** (HTTPS)
   - Hostinger auto-enables

4. **Monitor** first 24 hours
   - Check email notifications
   - Monitor error logs
   - Track order flow

---

## File Locations

| File | Location | Purpose |
|------|----------|---------|
| aarzah-wordpress-export.xml | `/aarzah-site/` | WordPress import |
| aarzah-woocommerce-products.csv | `/aarzah-site/` | Product import |
| aarzah-woocommerce-coupons.csv | `/aarzah-site/` | Coupon reference |
| aarzah-woocommerce-customers.csv | `/aarzah-site/` | Customer import |
| images/ | `/aarzah-site/images/` | Product images |

---

## Data Migration Summary

### From Static Site → WordPress

| Data Type | Location | Import Method |
|-----------|----------|----------------|
| **Pages** | XML file | WordPress Importer |
| **Products** | CSV file | WooCommerce Importer |
| **Coupons** | CSV file | Manual or Plugin |
| **Customers** | CSV file | User Importer |
| **Images** | `/images/` folder | Automatic (product import) |
| **Orders** | localStorage | Manual entry (if needed) |
| **Settings** | Manual | Admin panel configuration |

---

## Important Notes

### Image Paths
Your product images are already in the correct structure:
```
/images/products/kurtis/embroidered-kurti.svg
/images/products/sarees/printed-saree.svg
/images/products/suits/palazzo-suit.svg
/images/products/dresses/casual-dress.svg
```
These will be recognized during product import!

### Product IDs
- Static site: localStorage-based IDs
- WordPress: Auto-generated post IDs (will differ)
- No issue - WordPress creates new IDs automatically

### Existing Orders
- Static site: Stored in localStorage
- WordPress: Need manual import if required
- Recommendation: Start fresh with WordPress orders

### Customer Data
- Static site: No persistent customer accounts
- WordPress: Full customer management system
- Sample customer included for reference

---

## Download All Files

Before upload, verify you have:
1. ✅ aarzah-wordpress-export.xml (17 KB)
2. ✅ aarzah-woocommerce-products.csv (2 KB)
3. ✅ aarzah-woocommerce-coupons.csv (500 B)
4. ✅ aarzah-woocommerce-customers.csv (1 KB)
5. ✅ images/ folder with all subfolders

---

## Support & Troubleshooting

### Import Fails?
- Check file encoding (should be UTF-8)
- Verify column headers match exactly
- Check file isn't corrupted

### Images Don't Import?
- Products import but images show broken
- Ensure `/images/` folder uploaded to WordPress root
- Check image file permissions (755 for folders, 644 for files)

### Coupons Not Working?
- Verify coupon code spelling (case-sensitive)
- Check expiry date hasn't passed
- Verify minimum spend requirement matches

### Payment Issues?
- Update Razorpay API keys from test to production
- Verify webhook URLs configured
- Test transaction with test card

---

## Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Prepare WordPress | 30 min | Next |
| Import Structure | 10 min | Next |
| Import Products | 15 min | Next |
| Import Coupons | 10 min | Next |
| Configure Settings | 20 min | Next |
| Theme & Design | 30 min | Next |
| Content & Copy | 20 min | Next |
| Testing | 30 min | Next |
| Go Live | 15 min | Final |
| **Total** | **3 hours** | Estimated |

---

## Next Steps

1. **Download all 4 files** from workspace
2. **Set up WordPress** instance
3. **Install WooCommerce** plugin
4. **Follow Phase-by-Phase guide** above
5. **Import files** in order
6. **Test thoroughly** before going live

---

**Ready for WordPress migration!** 🚀

All your site data is now in standard WordPress/WooCommerce format and can be imported into any WordPress installation.
