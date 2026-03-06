import { faker } from '@faker-js/faker/locale/vi';
import fs from 'fs';
import path from 'path';

// ====== TYPES (inline for the seed script) ======
type Category = 'tom' | 'ca' | 'muc' | 'cua' | 'premium';
type OrderStatus = 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

// ====== HELPERS ======
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/gi, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

function generateOrderId(): string {
    const year = 2026;
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `HAI-${year}-${random}`;
}

// ====== SEAFOOD PRODUCT DATA ======
const SEAFOOD_PRODUCTS = [
    // Tôm
    { name: 'Tôm Hùm Xanh Tươi', category: 'tom', price: 1200000, desc: 'Tôm hùm xanh tươi sống, size 400-600g/con, vỏ xanh bóng', origin: 'Quảng Ninh' },
    { name: 'Tôm Sú Tươi Sống', category: 'tom', price: 280000, desc: 'Tôm sú loại 1, size 16-20 con/kg, còn sống', origin: 'Quảng Ninh' },
    { name: 'Tôm Thẻ Chân Trắng', category: 'tom', price: 180000, desc: 'Tôm thẻ chân trắng tươi, size 30-40 con/kg', origin: 'Quảng Ninh' },
    { name: 'Tôm Càng Xanh', category: 'tom', price: 350000, desc: 'Tôm càng xanh tươi ngon, size lớn', origin: 'Việt Nam' },
    { name: 'Tôm Đất Tươi', category: 'tom', price: 150000, desc: 'Tôm đất tự nhiên, khai thác từ biển', origin: 'Quảng Ninh' },
    { name: 'Tôm Tít Tươi Sống', category: 'tom', price: 320000, desc: 'Tôm tít (bọ ngựa biển) tươi, đầy thịt', origin: 'Quảng Ninh' },
    { name: 'Tôm Hùm Bông Tươi', category: 'tom', price: 1500000, desc: 'Tôm hùm bông cỡ lớn, thịt ngọt', origin: 'Nha Trang' },
    { name: 'Tôm Biển Tươi Loại 1', category: 'tom', price: 220000, desc: 'Tôm biển tươi sống, đánh bắt tự nhiên', origin: 'Quảng Ninh' },
    // Cá
    { name: 'Cá Hồi Na Uy Fillet', category: 'ca', price: 380000, desc: 'Cá hồi Na Uy nhập khẩu, fillet tươi, giàu omega-3', origin: 'Na Uy' },
    { name: 'Cá Mú Tươi Sống', category: 'ca', price: 420000, desc: 'Cá mú tươi sống, thịt trắng ngon', origin: 'Quảng Ninh' },
    { name: 'Cá Chẽm Tươi', category: 'ca', price: 160000, desc: 'Cá chẽm tươi, thịt chắc ngọt', origin: 'Việt Nam' },
    { name: 'Cá Thu Fillet Tươi', category: 'ca', price: 250000, desc: 'Cá thu fillet tươi, ít xương, dễ chế biến', origin: 'Quảng Ninh' },
    { name: 'Cá Bơn Biển Tươi', category: 'ca', price: 280000, desc: 'Cá bơn tươi, thịt mỏng dai ngon', origin: 'Nhật Bản' },
    { name: 'Cá Tráp Đỏ Nhập Khẩu', category: 'ca', price: 350000, desc: 'Cá tráp đỏ Nhật Bản, thịt săn chắc', origin: 'Nhật Bản' },
    { name: 'Cá Ngừ Đại Dương', category: 'ca', price: 290000, desc: 'Cá ngừ đại dương tươi, thịt đỏ đậm', origin: 'Việt Nam' },
    { name: 'Cá Hố Tươi', category: 'ca', price: 120000, desc: 'Cá hố tươi khai thác từ biển Quảng Ninh', origin: 'Quảng Ninh' },
    // Mực
    { name: 'Mực Ống Tươi Size Lớn', category: 'muc', price: 280000, desc: 'Mực ống tươi, size 300-500g/con, thịt giòn ngọt', origin: 'Quảng Ninh' },
    { name: 'Mực Nang Tươi', category: 'muc', price: 200000, desc: 'Mực nang tươi, dày thịt, dễ chế biến', origin: 'Quảng Ninh' },
    { name: 'Mực Khô Ngon Loại 1', category: 'muc', price: 450000, desc: 'Mực khô một nắng, thơm ngon', origin: 'Quảng Ninh' },
    { name: 'Bạch Tuộc Tươi', category: 'muc', price: 160000, desc: 'Bạch tuộc tươi sống, thịt giòn dai', origin: 'Quảng Ninh' },
    { name: 'Mực Tuộc Mini Tươi', category: 'muc', price: 180000, desc: 'Mực tuộc mini nhỏ, thích hợp chiên giòn', origin: 'Việt Nam' },
    { name: 'Mực Nhảy Tươi Sống', category: 'muc', price: 320000, desc: 'Mực nhảy còn sống, thịt trắng trong', origin: 'Quảng Ninh' },
    // Cua
    { name: 'Cua Bể Tươi Sống', category: 'cua', price: 380000, desc: 'Cua biển tươi sống, đầy gạch son', origin: 'Quảng Ninh' },
    { name: 'Ghẹ Xanh Tươi Sống', category: 'cua', price: 280000, desc: 'Ghẹ xanh tươi, thịt ngọt, đi từng cặp', origin: 'Quảng Ninh' },
    { name: 'Cua Gạch Son Tươi', category: 'cua', price: 550000, desc: 'Cua gạch son đặc trưng, gạch đầy', origin: 'Quảng Ninh' },
    { name: 'Ghẹ Đỏ Tươi', category: 'cua', price: 250000, desc: 'Ghẹ đỏ tươi ngon, nhiều thịt', origin: 'Việt Nam' },
    { name: 'Sam Biển Tươi', category: 'cua', price: 480000, desc: 'Sam biển tươi, trứng đầy, hiếm gặp', origin: 'Quảng Ninh' },
    { name: 'Cua Xanh Nhỏ Tươi', category: 'cua', price: 180000, desc: 'Cua xanh nhỏ, thích hợp hấp bia hoặc rang me', origin: 'Quảng Ninh' },
    // Premium
    { name: 'Bào Ngư Tươi Nhật Bản', category: 'premium', price: 1800000, desc: 'Bào ngư tươi nhập khẩu từ Nhật Bản, thịt dày', origin: 'Nhật Bản' },
    { name: 'Hàu Sữa Quảng Ninh', category: 'premium', price: 90000, desc: 'Hàu Quảng Ninh tươi, béo ngậy, khai thác mỗi ngày', origin: 'Quảng Ninh' },
    { name: 'Sò Huyết Tươi', category: 'premium', price: 120000, desc: 'Sò huyết tươi, huyết đỏ, đặc sản Quảng Ninh', origin: 'Quảng Ninh' },
    { name: 'Ngao Tươi Sống', category: 'premium', price: 75000, desc: 'Ngao tươi sống, sạch cát, hấp bia thơm ngon', origin: 'Việt Nam' },
    { name: 'Cầu Gai Biển Tươi', category: 'premium', price: 650000, desc: 'Cầu gai biển, ruột vàng béo ngậy, đặc sản cao cấp', origin: 'Quảng Ninh' },
    { name: 'Trai Xanh Tươi Sống', category: 'premium', price: 85000, desc: 'Trai xanh tươi, sạch, thịt ngọt', origin: 'Quảng Ninh' },
    { name: 'Hải Sâm Tươi', category: 'premium', price: 850000, desc: 'Hải sâm tươi, bổ dưỡng cao, đặc sản biển', origin: 'Quảng Ninh' },
    { name: 'Sò Điệp Nhật Bản', category: 'premium', price: 380000, desc: 'Sò điệp nhập khẩu Nhật Bản, thịt dày ngọt', origin: 'Nhật Bản' },
    { name: 'Vẹm Xanh New Zealand', category: 'premium', price: 220000, desc: 'Vẹm xanh New Zealand, thịt to béo', origin: 'New Zealand' },
    { name: 'Ốc Tươi Quảng Ninh', category: 'premium', price: 95000, desc: 'Ốc tươi đa dạng: ốc hương, ốc đỏ, ốc mỡ', origin: 'Quảng Ninh' },
    { name: 'Cá Trích Muối Cay', category: 'premium', price: 170000, desc: 'Cá trích muối ớt, ăn kèm cơm ngon', origin: 'Việt Nam' },
    { name: 'Cá Bớp Biển Tươi', category: 'premium', price: 280000, desc: 'Cá bớp tươi, thịt chắc, ít xương, rất ngon', origin: 'Quảng Ninh' },
];

// Seafood images - high quality Unsplash
const SEAFOOD_IMAGES = [
    'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800',
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
    'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800',
    'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=800',
    'https://images.unsplash.com/photo-1606731219412-3b9e56e0c01a?w=800',
    'https://images.unsplash.com/photo-1578020190125-f4f7c18bc9cb?w=800',
    'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800',
    'https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?w=800',
    'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?w=800',
    'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800',
    'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=800',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
];

function getRandomImages(count = 4): string[] {
    const shuffled = [...SEAFOOD_IMAGES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// ====== SEED: PRODUCTS ======
function seedProducts() {
    return SEAFOOD_PRODUCTS.map((p, index) => {
        const hasDiscount = Math.random() > 0.4;
        const salePrice = hasDiscount ? Math.round(p.price * (1 - (Math.floor(Math.random() * 30) + 5) / 100) / 1000) * 1000 : null;
        const percentOff = salePrice ? Math.round(((p.price - salePrice) / p.price) * 100) : null;

        return {
            id: `prod_${String(index + 1).padStart(3, '0')}`,
            slug: generateSlug(p.name) + '-' + String(index + 1),
            name: p.name,
            category: p.category as Category,
            description: `${p.desc}. Sản phẩm được đánh bắt/khai thác tươi sống từ biển Quảng Ninh và các vùng biển lân cận, được bảo quản theo quy trình nghiêm ngặt đảm bảo chất lượng tốt nhất đến tay khách hàng.`,
            shortDescription: p.desc,
            images: getRandomImages(faker.number.int({ min: 3, max: 6 })),
            videoUrl: Math.random() > 0.7 ? null : null,
            price: p.price,
            salePrice,
            percentOff,
            inventoryKg: faker.number.int({ min: 5, max: 200 }),
            soldCount: faker.number.int({ min: 50, max: 5000 }),
            bestSeller: Math.random() > 0.65,
            isBaoRe: Math.random() > 0.5,
            isNew: Math.random() > 0.7,
            origin: p.origin,
            preservation: 'Bảo quản lạnh 0-4°C. Sử dụng trong vòng 24-48 giờ.',
            specification: `Xuất xứ: ${p.origin}. Trọng lượng tính theo kg.`,
            rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
            reviewCount: faker.number.int({ min: 5, max: 200 }),
            relatedProducts: [],
            createdAt: faker.date.past({ years: 1 }).toISOString(),
        };
    });
}

// ====== SEED: USERS ======
function seedUsers() {
    const users = [
        {
            id: 'user_admin',
            name: 'Admin Hải Sản',
            email: 'admin@haisanquangninh.vn',
            password: 'admin123',
            role: 'admin',
            image: 'https://ui-avatars.com/api/?name=Admin&background=0ea5e9&color=fff',
            phone: '0901234567',
            address: 'Hạ Long, Quảng Ninh',
            isActive: true,
        },
        {
            id: 'user_test',
            name: 'Test User',
            email: 'user@test.vn',
            password: 'password123',
            role: 'user',
            image: 'https://ui-avatars.com/api/?name=Test+User&background=random',
            phone: '0987654321',
            address: 'Hà Nội, Việt Nam',
            isActive: true,
            createdAt: new Date('2024-02-01').toISOString(),
        },
    ];

    for (let i = 0; i < 11; i++) {
        const fullName = faker.person.fullName();
        users.push({
            id: `user_${String(i + 1).padStart(3, '0')}`,
            name: fullName,
            email: faker.internet.email(),
            password: 'password123',
            role: 'user',
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
            phone: `09${faker.string.numeric(8)}`,
            address: faker.location.streetAddress(),
            isActive: Math.random() > 0.1,
            createdAt: faker.date.past({ years: 1 }).toISOString(),
        });
    }

    return users;
}

// ====== SEED: ORDERS ======
function seedOrders(products: ReturnType<typeof seedProducts>, users: ReturnType<typeof seedUsers>) {
    const statuses: OrderStatus[] = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];
    const provinces = ['Hà Nội', 'TP. Hồ Chí Minh', 'Quảng Ninh', 'Hải Phòng', 'Đà Nẵng'];
    const districts = ['Quận 1', 'Quận Ba Đình', 'TP. Hạ Long', 'Quận Hải Châu', 'Quận Lê Chân'];
    const paymentMethods = ['cod', 'transfer'];

    return Array.from({ length: 80 }, (_, index) => {
        const orderProducts = faker.helpers.arrayElements(products, { min: 1, max: 4 });
        const items = orderProducts.map(p => {
            const weight = Math.round((Math.random() * 4 + 0.5) * 10) / 10;
            const pricePerKg = p.salePrice || p.price;
            return {
                productId: p.id,
                productName: p.name,
                productImage: p.images[0],
                weight,
                pricePerKg,
                totalPrice: Math.round(pricePerKg * weight),
            };
        });

        const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
        const shippingFee = subtotal >= 500000 ? 0 : 30000;
        const total = subtotal + shippingFee;

        const statusIndex = faker.number.int({ min: 0, max: statuses.length - 1 });
        const currentStatus = statuses[statusIndex];

        const timeline = statuses.slice(0, statusIndex + 1).map((s, si) => ({
            status: s,
            timestamp: new Date(Date.now() - (statusIndex - si) * 4 * 3600000).toISOString(),
            note: s === 'cancelled' ? 'Khách hàng hủy đơn' : undefined,
        }));

        const randomUser = faker.helpers.arrayElement(users.filter(u => u.role === 'user'));
        const provinceIdx = faker.number.int({ min: 0, max: provinces.length - 1 });

        return {
            id: `order_${String(index + 1).padStart(4, '0')}`,
            orderId: generateOrderId(),
            userId: randomUser.id,
            items,
            shipping: {
                name: randomUser.name,
                phone: randomUser.phone,
                province: provinces[provinceIdx],
                district: districts[provinceIdx],
                ward: `Phường ${faker.number.int({ min: 1, max: 20 })}`,
                address: faker.location.streetAddress(),
                note: Math.random() > 0.5 ? 'Gọi trước khi giao' : '',
            },
            paymentMethod: faker.helpers.arrayElement(paymentMethods),
            subtotal,
            shippingFee,
            total,
            status: currentStatus,
            statusTimeline: timeline,
            createdAt: faker.date.past({ years: 1 }).toISOString(),
        };
    });
}

// ====== SEED: REVIEWS ======
function seedReviews(products: ReturnType<typeof seedProducts>, users: ReturnType<typeof seedUsers>) {
    const reviews = [];
    const nonAdminUsers = users.filter(u => u.role === 'user');

    for (const product of products) {
        const count = faker.number.int({ min: 2, max: 10 });
        for (let i = 0; i < count; i++) {
            const user = faker.helpers.arrayElement(nonAdminUsers);
            reviews.push({
                id: `review_${reviews.length + 1}`,
                productId: product.id,
                userId: user.id,
                userName: user.name,
                userImage: user.image,
                rating: faker.number.int({ min: 3, max: 5 }),
                comment: faker.helpers.arrayElement([
                    'Sản phẩm rất tươi ngon, giao hàng nhanh!',
                    'Chất lượng đúng như mô tả, sẽ mua lại.',
                    'Đóng gói cẩn thận, tôi rất hài lòng.',
                    'Tôm tươi sống, size đúng như quảng cáo.',
                    'Giao hàng đúng hẹn, sản phẩm chất lượng.',
                    'Hải sản rất tươi, gia đình khen ngon.',
                    'Giá hợp lý, chất lượng tốt, mua nhiều lần rồi.',
                    'Nhân viên tư vấn nhiệt tình, hàng đẹp.',
                ]),
                createdAt: faker.date.past({ years: 1 }).toISOString(),
            });
        }
    }
    return reviews;
}

// ====== MAIN ======
async function main() {
    console.log('🌱 Starting seed...');

    const products = seedProducts();
    const users = seedUsers();
    const orders = seedOrders(products, users);
    const reviews = seedReviews(products, users);

    const dbPath = path.join(process.cwd(), 'data', 'db.json');
    const dataDir = path.join(process.cwd(), 'data');

    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const db = { products, users, orders, reviews };
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');

    console.log(`✅ Seeded:`);
    console.log(`   📦 ${products.length} products`);
    console.log(`   👥 ${users.length} users (1 admin)`);
    console.log(`   📋 ${orders.length} orders`);
    console.log(`   💬 ${reviews.length} reviews`);
    console.log(`\n📁 Data written to: ${dbPath}`);
    console.log(`\n🔐 Admin credentials:`);
    console.log(`   Email: admin@haisanquangninh.vn`);
    console.log(`   Password: admin123`);
}

main();
