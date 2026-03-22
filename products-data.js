/**
 * AARZAH PRODUCTS DATABASE
 * 18 items with colors, sizes, and multiple images
 * Used by frontend for dynamic rendering
 */

const PRODUCTS_DB = {
  // KURTIS (5 items)
  "kurti-001": { 
    id: "kurti-001",
    name: "Embroidered Cotton Kurti", 
    category: "kurtis",
    price: 649,
    originalPrice: 849,
    discount: 24,
    images: ["images/products/kurtis/embroidered-1.jpg", "images/products/kurtis/embroidered-2.jpg", "images/products/kurtis/embroidered-3.jpg"],
    colors: ["Red", "Blue", "Green", "Black"],
    sizes: ["M", "L", "XL", "XXL"],
    description: "Premium embroidered cotton kurti with traditional designs. Perfect for everyday wear.",
    rating: 4.5,
    reviews: 124
  },
  "kurti-002": { 
    id: "kurti-002",
    name: "Designer Silk Kurti", 
    category: "kurtis",
    price: 1599,
    originalPrice: 1999,
    discount: 20,
    images: ["images/products/kurtis/silk-1.jpg", "images/products/kurtis/silk-2.jpg"],
    colors: ["Maroon", "Gold", "Navy"],
    sizes: ["M", "L", "XL"],
    description: "Elegant silk kurti with intricate handwork. Premium quality fabric.",
    rating: 4.8,
    reviews: 42
  },
  "kurti-003": { 
    id: "kurti-003",
    name: "Printed Kurta with Pants", 
    category: "kurtis",
    price: 799,
    originalPrice: 999,
    discount: 20,
    images: ["images/products/kurtis/print-1.jpg", "images/products/kurtis/print-2.jpg", "images/products/kurtis/print-3.jpg", "images/products/kurtis/print-4.jpg"],
    colors: ["Multicolor", "Purple", "Orange"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Comfortable printed kurta set with matching pants. Great value for money.",
    rating: 4.3,
    reviews: 67
  },
  "kurti-004": { 
    id: "kurti-004",
    name: "Floral Rayon Kurti", 
    category: "kurtis",
    price: 549,
    originalPrice: 699,
    discount: 21,
    images: ["images/products/kurtis/floral-1.jpg", "images/products/kurtis/floral-2.jpg"],
    colors: ["Peach", "Pink", "Yellow"],
    sizes: ["M", "L", "XL", "XXL"],
    description: "Light and breathable floral rayon kurti perfect for summer.",
    rating: 4.2,
    reviews: 89
  },
  "kurti-005": { 
    id: "kurti-005",
    name: "Ethnic Fusion Kurti", 
    category: "kurtis",
    price: 899,
    originalPrice: 1199,
    discount: 25,
    images: ["images/products/kurtis/fusion-1.jpg", "images/products/kurtis/fusion-2.jpg", "images/products/kurtis/fusion-3.jpg"],
    colors: ["Cream", "Lavender", "Sage"],
    sizes: ["M", "L", "XL"],
    description: "Modern ethnic fusion design with classic touch. Versatile and elegant.",
    rating: 4.6,
    reviews: 56
  },

  // SAREES (5 items)
  "saree-001": { 
    id: "saree-001",
    name: "Printed Saree with Blouse", 
    category: "sarees",
    price: 1299,
    originalPrice: 1499,
    discount: 13,
    images: ["images/products/sarees/printed-1.jpg", "images/products/sarees/printed-2.jpg", "images/products/sarees/printed-3.jpg"],
    colors: ["MultiColor", "Blue", "Maroon"],
    sizes: ["Free Size"],
    description: "Beautiful printed saree with unstitched blouse piece included.",
    rating: 4.4,
    reviews: 98
  },
  "saree-002": { 
    id: "saree-002",
    name: "Silk Saree", 
    category: "sarees",
    price: 2499,
    originalPrice: 3299,
    discount: 24,
    images: ["images/products/sarees/silk-1.jpg", "images/products/sarees/silk-2.jpg", "images/products/sarees/silk-3.jpg", "images/products/sarees/silk-4.jpg"],
    colors: ["Red", "Royal Blue", "Green", "Black"],
    sizes: ["Free Size"],
    description: "Premium silk saree with traditional weaving patterns. Authentic and luxurious.",
    rating: 4.9,
    reviews: 203
  },
  "saree-003": { 
    id: "saree-003",
    name: "Cotton Saree", 
    category: "sarees",
    price: 599,
    originalPrice: 799,
    discount: 25,
    images: ["images/products/sarees/cotton-1.jpg", "images/products/sarees/cotton-2.jpg"],
    colors: ["White", "Beige", "Light Green"],
    sizes: ["Free Size"],
    description: "Soft and comfortable cotton saree perfect for everyday wear.",
    rating: 4.1,
    reviews: 145
  },
  "saree-004": { 
    id: "saree-004",
    name: "Designer Saree with Blouse", 
    category: "sarees",
    price: 1899,
    originalPrice: 2499,
    discount: 24,
    images: ["images/products/sarees/designer-1.jpg", "images/products/sarees/designer-2.jpg", "images/products/sarees/designer-3.jpg"],
    colors: ["Gold", "Mauve", "Rust"],
    sizes: ["Free Size"],
    description: "Handcrafted designer saree with embroidered blouse. Exclusive designs.",
    rating: 4.7,
    reviews: 72
  },
  "saree-005": { 
    id: "saree-005",
    name: "Chanderi Saree", 
    category: "sarees",
    price: 1399,
    originalPrice: 1699,
    discount: 18,
    images: ["images/products/sarees/chanderi-1.jpg", "images/products/sarees/chanderi-2.jpg", "images/products/sarees/chanderi-3.jpg", "images/products/sarees/chanderi-4.jpg", "images/products/sarees/chanderi-5.jpg"],
    colors: ["Cream", "Purple", "Orange"],
    sizes: ["Free Size"],
    description: "Elegant chanderi fabric saree with golden zari border. Traditional craftsmanship.",
    rating: 4.8,
    reviews: 81
  },

  // SUITS (4 items)
  "suit-001": { 
    id: "suit-001",
    name: "Palazzo Suit Set", 
    category: "suits",
    price: 899,
    originalPrice: 999,
    discount: 10,
    images: ["images/products/suits/palazzo-1.jpg", "images/products/suits/palazzo-2.jpg", "images/products/suits/palazzo-3.jpg"],
    colors: ["Navy", "Black", "Charcoal"],
    sizes: ["M", "L", "XL", "XXL"],
    description: "Comfortable palazzo suit with dupatta. Perfect for casual and semi-formal events.",
    rating: 4.3,
    reviews: 76
  },
  "suit-002": { 
    id: "suit-002",
    name: "Embroidered Suit Set", 
    category: "suits",
    price: 1499,
    originalPrice: 1999,
    discount: 25,
    images: ["images/products/suits/emb-1.jpg", "images/products/suits/emb-2.jpg"],
    colors: ["Pink", "Peach", "Red"],
    sizes: ["M", "L", "XL"],
    description: "Beautifully embroidered unstitched suit with dupatta. Premium quality.",
    rating: 4.6,
    reviews: 54
  },
  "suit-003": { 
    id: "suit-003",
    name: "Straight Suit", 
    category: "suits",
    price: 749,
    originalPrice: 899,
    discount: 17,
    images: ["images/products/suits/straight-1.jpg", "images/products/suits/straight-2.jpg", "images/products/suits/straight-3.jpg"],
    colors: ["Beige", "Brown", "Teal"],
    sizes: ["M", "L", "XL", "XXL"],
    description: "Classic straight cut suit with traditional look. Versatile and timeless.",
    rating: 4.2,
    reviews: 63
  },
  "suit-004": { 
    id: "suit-004",
    name: "Designer Suit with Work", 
    category: "suits",
    price: 1799,
    originalPrice: 2299,
    discount: 22,
    images: ["images/products/suits/designer-1.jpg", "images/products/suits/designer-2.jpg", "images/products/suits/designer-3.jpg", "images/products/suits/designer-4.jpg"],
    colors: ["Green", "Purple", "Gold"],
    sizes: ["M", "L", "XL"],
    description: "Premium designer suit with intricate embellishments. Luxurious and exclusive.",
    rating: 4.9,
    reviews: 38
  },

  // DRESSES (4 items)
  "dress-001": { 
    id: "dress-001",
    name: "Cotton Casual Dress", 
    category: "dresses",
    price: 449,
    originalPrice: 499,
    discount: 10,
    images: ["images/products/dresses/casual-1.jpg", "images/products/dresses/casual-2.jpg"],
    colors: ["White", "Blue", "Pink", "Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Simple and comfortable cotton casual dress. Perfect for daily wear.",
    rating: 4.1,
    reviews: 89
  },
  "dress-002": { 
    id: "dress-002",
    name: "Maxi Dress", 
    category: "dresses",
    price: 899,
    originalPrice: 1099,
    discount: 18,
    images: ["images/products/dresses/maxi-1.jpg", "images/products/dresses/maxi-2.jpg", "images/products/dresses/maxi-3.jpg"],
    colors: ["Black", "Navy", "Wine"],
    sizes: ["M", "L", "XL"],
    description: "Elegant maxi dress perfect for parties and special occasions.",
    rating: 4.5,
    reviews: 112
  },
  "dress-003": { 
    id: "dress-003",
    name: "Printed Summer Dress", 
    category: "dresses",
    price: 599,
    originalPrice: 799,
    discount: 25,
    images: ["images/products/dresses/summer-1.jpg", "images/products/dresses/summer-2.jpg", "images/products/dresses/summer-3.jpg", "images/products/dresses/summer-4.jpg", "images/products/dresses/summer-5.jpg"],
    colors: ["Floral Yellow", "Floral Blue", "Floral Pink"],
    sizes: ["S", "M", "L", "XL"],
    description: "Bright and breezy summer dress with vibrant prints. Maximum 5 images available.",
    rating: 4.4,
    reviews: 167
  },
  "dress-004": { 
    id: "dress-004",
    name: "Formal Midi Dress", 
    category: "dresses",
    price: 1099,
    originalPrice: 1399,
    discount: 21,
    images: ["images/products/dresses/formal-1.jpg", "images/products/dresses/formal-2.jpg"],
    colors: ["Black", "Gray", "Brown"],
    sizes: ["M", "L", "XL", "XXL"],
    description: "Sophisticated formal midi dress for special occasions.",
    rating: 4.7,
    reviews: 95
  }
};

// Function to get product by ID
function getProduct(id) {
  return PRODUCTS_DB[id];
}

// Function to get all products
function getAllProducts() {
  return Object.values(PRODUCTS_DB);
}

// Function to get products by category
function getProductsByCategory(category) {
  return Object.values(PRODUCTS_DB).filter(p => p.category === category);
}

// Export for use (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS_DB, getProduct, getAllProducts, getProductsByCategory };
}
