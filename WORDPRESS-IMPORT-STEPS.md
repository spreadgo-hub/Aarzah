# WordPress Import Instructions - Aarzah

## Complete Setup in 5 Steps

### Step 1: Install WordPress + WooCommerce

1. Download and install WordPress on your server (Hostinger, Bluehost, etc.)
2. Go to **Plugins → Add New** and search for **WooCommerce**
3. Click **Install Now** → **Activate**
4. Follow the WooCommerce setup wizard:
   - Choose your store location (India)
   - Select industry (Fashion/Apparel)
   - Set currency to **Indian Rupee (₹)**

### Step 2: Install WordPress Importer Plugin

1. Go to **Tools → Import**
2. Look for **WordPress** in the list
3. Click **Install Importer** (if not already installed)
4. Click **Import** next to WordPress

### Step 3: Import the WXR Export File

1. Click **Choose File** and select: **aarzah-wordpress-export.xml**
2. From the archive, you'll see options to:
   - ✅ Assign posts to admin user (select `admin`)
   - ✅ Import attachments (if you want to download images from remote URLs)
3. Click **Submit** and wait for import to complete
4. This imports all pages and site structure

### Step 4: Import Products via CSV

1. Go to **WooCommerce → Products → Import**
2. Upload: **aarzah-woocommerce-products.csv**
3. Configure import settings:
   - Delimiter: Comma
   - Map columns properly
   - Click **Run Importer**
4. Wait for 6 products to be imported

### Step 5: Import Coupons via CSV

1. Go to **WooCommerce → Coupons**
2. Click **Import**
3. Upload: **aarzah-woocommerce-coupons.csv**
4. This imports all discount codes:
   - **SAVE20** - 20% off (min ₹500)
   - **FLAT50** - ₹50 off (min ₹300)
   - **WELCOME10** - 10% off first order
   - **SUMMER15** - 15% off (expires Mar 31)
   - **FREESHIP** - Free shipping (min ₹500)

### Step 6: Configure Payment Gateway

1. Go to **WooCommerce → Settings → Payments**
2. Search for **Razorpay** plugin and install it
3. Activate and go back to **Payments** tab
4. Click **Razorpay** settings:
   - **Production Key ID**: (Get from Razorpay)
   - **Production Key Secret**: (Get from Razorpay)
   - Enable **Razorpay Payments**

### Step 7: Upload Product Images

1. Extract **images/** folder from the archive
2. Upload via **Media → Add New**
3. Or use FTP to upload to `/wp-content/uploads/`
4. Update product image URLs to match your media library

## Files in Archive

- **aarzah-wordpress-export.xml** - Site structure, pages, categories
- **aarzah-woocommerce-products.csv** - 6 products with pricing
- **aarzah-woocommerce-coupons.csv** - 5 coupon codes
- **aarzah-woocommerce-customers.csv** - Sample customer template
- **images/** - Product images organized by category
- **WORDPRESS-MIGRATION-GUIDE.md** - Detailed migration info
- **IMAGE-MANAGEMENT.md** - Image folder structure guide

## Important Notes

✅ **WXR Version**: The export file is version 1.2 (WordPress standard)
✅ **Character Encoding**: UTF-8 (supports Unicode characters like ₹)
✅ **Admin User**: Default is `admin@aarzah.com`
✅ **Products**: Will be added as WooCommerce simple products
✅ **Categories**: 4 categories (Kurtis, Sarees, Suits, Dresses)

## Troubleshooting

**Import fails with "Missing WXR version"?**
- Ensure you're using the latest WordPress Importer plugin
- Check that XML file is valid UTF-8 encoding
- Try uploading via **Tools → Import** directly

**Products not importing?**
- Verify CSV delimiter is set to Comma (,)
- Check column headers match expected format
- Upload smaller batches if file is too large

**Images not showing?**
- Upload images to WordPress Media library
- Get media URL from Media tab
- Edit products to add image URLs

## Next Steps After Import

1. ✅ Verify all 7 pages are published
2. ✅ Check 4 product categories with 6 items
3. ✅ Test 5 coupon codes at checkout
4. ✅ Configure Razorpay payment gateway
5. ✅ Upload product images
6. ✅ Set up shipping zones and rates
7. ✅ Configure email notifications
8. ✅ Test complete checkout flow

## Support

For detailed migration information, see: **WORDPRESS-MIGRATION-GUIDE.md**
For image folder structure, see: **IMAGE-MANAGEMENT.md**

---

**Migration Package Version**: 1.0
**Created**: March 5, 2026
**Aarzah - Everyday Ethnic Wear**
