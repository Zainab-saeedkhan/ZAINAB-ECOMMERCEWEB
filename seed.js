// Seeds demo data: node src/seed.js   (WARNING: clears existing data)
require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const CartItem = require('./models/CartItem');
const Order = require('./models/Order');
const Review = require('./models/Review');

const img = (seed) => `https://picsum.photos/seed/${seed}/600/400`;

(async () => {
  await connectDB();
  await Promise.all([User, Category, Product, CartItem, Order, Review].map((m) => m.deleteMany({})));

  const hash = await bcrypt.hash('password123', 12);
  const [, seller1, seller2] = await User.create([
    { name: 'Admin User', email: 'admin@shop.com', passwordHash: hash, role: 'ADMIN', phone: '03000000000' },
    { name: 'Ali Electronics', email: 'seller@shop.com', passwordHash: hash, role: 'SELLER', phone: '03001111111' },
    { name: 'Sara Fashion', email: 'seller2@shop.com', passwordHash: hash, role: 'SELLER', phone: '03002222222' },
    { name: 'Zainab Buyer', email: 'buyer@shop.com', passwordHash: hash, role: 'BUYER', phone: '03003333333', address: 'House 1, Street 2, Karachi' },
  ]);

  const [electronics, apparel, books, home] = await Category.create([
    { name: 'Electronics', slug: 'electronics', description: 'Phones, laptops and gadgets' },
    { name: 'Apparel', slug: 'apparel', description: 'Clothing and fashion' },
    { name: 'Books', slug: 'books', description: 'Fiction, non-fiction and textbooks' },
    { name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Everything for your home' },
  ]);

  await Product.create([
    { seller: seller1._id, category: electronics._id, title: 'Wireless Headphones', description: 'Noise cancelling over-ear headphones with 30h battery.', price: 59.99, stock: 25, imageUrls: [img('headphones')] },
    { seller: seller1._id, category: electronics._id, title: 'Smartphone X12', description: '6.5" display, 128GB storage, dual camera.', price: 299, stock: 10, imageUrls: [img('phone')] },
    { seller: seller1._id, category: electronics._id, title: 'Bluetooth Speaker', description: 'Portable waterproof speaker.', price: 35.5, stock: 40, imageUrls: [img('speaker')] },
    { seller: seller1._id, category: home._id, title: 'Electric Kettle', description: '1.7L stainless steel kettle.', price: 24.99, stock: 3, imageUrls: [img('kettle')] },
    { seller: seller2._id, category: apparel._id, title: 'Cotton T-Shirt', description: '100% cotton, available in all sizes.', price: 12.99, stock: 100, imageUrls: [img('tshirt')] },
    { seller: seller2._id, category: apparel._id, title: 'Denim Jacket', description: 'Classic blue denim jacket.', price: 49.0, stock: 15, imageUrls: [img('jacket')] },
    { seller: seller2._id, category: apparel._id, title: 'Running Shoes', description: 'Lightweight and comfortable.', price: 69.99, stock: 20, imageUrls: [img('shoes')] },
    { seller: seller2._id, category: books._id, title: 'JavaScript Basics', description: 'Beginner friendly guide to JS.', price: 19.99, stock: 50, imageUrls: [img('jsbook')] },
  ]);

  console.log('Seed complete. All passwords: password123');
  console.log('  admin@shop.com (ADMIN) | seller@shop.com, seller2@shop.com (SELLER) | buyer@shop.com (BUYER)');
  await mongoose.disconnect();
})().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
