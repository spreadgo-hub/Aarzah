# Image Management Guide - Aarzah

## Folder Structure

```
images/
├── products/
│   ├── kurtis/                    # Kurti & Kurta images
│   ├── sarees/                    # Saree images
│   ├── suits/                     # Suit & Salwar images
│   └── dresses/                   # Dress images
└── banners/                       # Hero/promo banners
```

## Current Images

### Product Images
| Category | File | Usage |
|----------|------|-------|
| Kurtis | `kurtis/embroidered-kurti.svg` | Homepage trending section |
| Sarees | `sarees/printed-saree.svg` | Homepage products |
| Suits | `suits/palazzo-suit.svg` | Homepage products |
| Dresses | `dresses/casual-dress.svg` | Homepage products |

### Banner Images
| Banner | File | Usage |
|--------|------|-------|
| Summer | `banners/summer-collection.svg` | Hero banner (index.html) |

---

## Adding New Images

### Method 1: Replace Placeholder Images
1. Take product photos (JPG at 400x500px minimum)
2. Upload to corresponding folder:
   - `images/products/kurtis/` for kurtas
   - `images/products/sarees/` for sarees
   - `images/products/suits/` for suits
   - `images/products/dresses/` for dresses

3. Use naming convention: `product-name.jpg`
   - Example: `embroidered-kurti.jpg` → `images/products/kurtis/embroidered-kurti.jpg`

4. Update HTML reference:
   ```html
   <!-- OLD -->
   <img src="https://images.unsplash.com/photo-1584622281867-8f4ee5f12744?w=400&h=500&fit=crop" alt="Embroidered Kurti">
   
   <!-- NEW -->
   <img src="images/products/kurtis/embroidered-kurti.jpg" alt="Embroidered Kurti">
   ```

### Method 2: Add More Products
1. Create image file: `images/products/[category]/[product-name].jpg`
2. Add product in admin panel at: `/admin.html`
3. In admin panel → Products → Add Product
4. Paste image URL: `images/products/[category]/[product-name].jpg`
5. Fill other details (name, price, description, stock)
6. Click "Save Product"

---

## Image Specifications

### Product Images
- **Format:** JPG (recommended) or PNG
- **Dimensions:** 400px × 500px (portrait)
- **File size:** 100-300 KB per image
- **Quality:** High quality, well-lit photos
- **Ratio:** 4:5 aspect ratio

### Banner Images
- **Format:** JPG or PNG
- **Dimensions:** 600px × 400px (landscape)
- **File size:** 200-500 KB per banner
- **Quality:** Eye-catching, clear text overlay
- **Ratio:** 3:2 aspect ratio

### Optimization Tips
1. **Compress images before uploading**
   - Use tools: tinypng.com or imageoptimizer.com
   - Aim for <200KB per image

2. **Use consistent styling**
   - Same background lighting
   - Similar color tone
   - Professional appearance

3. **Multiple angles per product** (optional)
   - Front view (primary)
   - Side view (secondary)
   - Detail view (closeup)
   - Name them: `product-front.jpg`, `product-side.jpg`

---

## File Naming Convention

### Pattern: `product-name-detail.jpg`

**Examples:**
```
embroidered-kurti.jpg          ✅ Single image per product
embroidered-kurti-front.jpg    ✅ Multiple angles
embroidered-kurti-side.jpg
palazzo-suit-set.jpg           ✅ With hyphens for spaces
cotton-saree-platinum.jpg      ✅ Color variant
casual-dress-summer-2024.jpg   ✅ Season/year info
```

**Rules:**
- Use lowercase only
- Use hyphens (-) not underscores (_)
- Be descriptive: `product-category.jpg`
- Keep filenames short (<50 characters)

---

## URLs for Different Contexts

### Current Static Site
```
Local path: images/products/kurtis/embroidered-kurti.jpg
Full URL:   https://aarzah.com/images/products/kurtis/embroidered-kurti.jpg
```

### WordPress Migration (Future)
```
WordPress media library path: /wp-content/uploads/products/kurtis/embroidered-kurti.jpg
WooCommerce recognizes: /images/ or /wp-content/uploads/
(Automatic replacement during migration)
```

### Admin Panel Upload
1. In admin panel, when adding product
2. Paste full path: `images/products/category/filename.jpg`
3. System stores in localStorage
4. On WordPress: path updates automatically

---

## Using in Code

### HTML Image Tag
```html
<img src="images/products/kurtis/embroidered-kurti.jpg" alt="Embroidered Kurti">
```

### JavaScript (Adding to Cart)
```javascript
addToCart('Embroidered Kurti', 649, 'images/products/kurtis/embroidered-kurti.jpg')
```

### Admin Form Field
```javascript
image: 'images/products/kurtis/embroidered-kurti.jpg'
```

---

## Uploading to Hostinger

### Via File Manager
1. Login to Hostinger
2. File Manager → `/public_html/`
3. Create `images` folder if not visible
4. Upload all image files **with folder structure** maintained:
   ```
   public_html/
   └── images/
       ├── products/
       │   ├── kurtis/
       │   ├── sarees/
       │   ├── suits/
       │   └── dresses/
       └── banners/
   ```

### Via FTP (FileZilla)
1. Connect to Hostinger via FTP
2. Navigate to `/public_html/`
3. Create folders: `images/products/kurtis/` etc.
4. Drag & drop image files

### What Happens
- Images stored on server
- HTML references them: `/images/products/category/file.jpg`
- Browsers cache images (faster loads)
- WordPress uses same paths during migration

---

## Image Optimization Tasks

### Before Going Live
- [ ] Replace all placeholder SVG images with real product photos
- [ ] Compress all JPGs to <200KB each
- [ ] Test image loads on https://aarzah.com
- [ ] Verify alt text is descriptive
- [ ] Check file permissions (755 recommended)

### Regular Maintenance
- [ ] Archive old product images (move to backup)
- [ ] Update seasonal banners
- [ ] Replace low-quality photos
- [ ] Monitor image folder size (keep <50MB)

---

## WordPress WooCommerce Integration (Future)

### Automatic Compatibility
Your image structure is **WooCommerce-ready**:

```
Current (Static):
/images/products/category/image.jpg

WordPress (Automatic conversion):
/wp-content/uploads/2024/03/image.jpg
                          ↓
                    WooCommerce copies images
                    to default library location
```

### During Migration
1. Export tool reads `images/` folder
2. Creates WooCommerce product bundle
3. Plugin imports with image references
4. Media library auto-organizes by month

### No Manual Work Needed
- Image paths update automatically
- File URLs rewritten by WooCommerce
- All references fixed by migration script

---

## Troubleshooting

### Images Not Loading on Site
1. **Check path:** `images/products/category/filename.jpg`
2. **Check capitalization:** Paths are case-sensitive on Linux servers
3. **Check file permissions:** 644 for files, 755 for folders
4. **Check file size:** Upload limit might be exceeded (usually 100MB)

**Solution:**
```bash
# On server (via SSH)
chmod 644 images/products/*/* 
chmod 755 images/products/*/
chmod 755 images/products
chmod 755 images
```

### Images Slow to Load
1. **Reduce file size:** Compress to <200KB per image
2. **Use JPG:** Better compression than PNG for photos
3. **Enable caching:** .htaccess cache headers (already set)
4. **Use CDN:** Hostinger offers free CDN option

### Path Issues in Admin Panel
1. Always use relative path: `images/products/category/file.jpg`
2. Never use absolute path: `/home/user/...` 
3. Never use external URLs in localStorage
4. Test path in browser first: `https://aarzah.com/images/products/category/file.jpg`

---

## Reference Links

- **Image Compression:** tinypng.com, compressor.io
- **Batch Resize:** imagemagick.org, ffmpeg
- **WooCommerce Docs:** woocommerce.com/document/product-image-gallery/
- **File Permissions:** wikipedia.org/wiki/File_permissions

---

## Quick Commands

### Check image folder size
```sh
du -sh images/
```

### Find all images recursively
```sh
find images/ -type f -name "*.jpg" -o -name "*.png"
```

### Compress all JPGs (Linux)
```sh
find images/ -name "*.jpg" -exec mogrify -quality 85 {} \;
```

---

**Last Updated:** March 5, 2026  
**Image Format Support:** JPG, PNG, SVG, WebP  
**Total Recommended Size:** <50MB  
**Recommended Number:** 20-50 product images initially
