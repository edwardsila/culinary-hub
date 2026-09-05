import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);

  await prisma.admin.upsert({
    where: { email: "admin@culinaryhub.co.ke" },
    update: {},
    create: {
      email: "admin@culinaryhub.co.ke",
      passwordHash: adminPassword,
      name: "Store Admin",
    },
  });

  const categories = [
    {
      name: "Cooking Pots",
      slug: "cooking-pots",
      description: "Durable pots for every kind of cooking",
      image: "",
    },
    {
      name: "Pans & Frying",
      slug: "pans-and-frying",
      description: "Non-stick pans and frying essentials",
      image: "",
    },
    {
      name: "Knives & Cutting",
      slug: "knives-and-cutting",
      description: "Sharp professional knives and boards",
      image: "",
    },
    {
      name: "Serving & Utensils",
      slug: "serving-and-utensils",
      description: "Spoons, ladles, and serving tools",
      image: "",
    },
    {
      name: "Drinkware & Accessories",
      slug: "drinkware-and-accessories",
      description: "Mugs, glasses, and kitchen extras",
      image: "",
    },
  ];

  const createdCategories = [];
  for (const c of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    createdCategories.push(cat);
  }

  const catMap: Record<string, string> = {};
  for (const c of createdCategories) {
    catMap[c.slug] = c.id;
  }

  const products = [
    {
      name: "Afrika Non-Stick Cooking Pot Set (3 piece)",
      slug: "afrika-nonstick-pot-set",
      description:
        "Premium 3-piece non-stick cooking pot set. Perfect for a modern Kenyan kitchen. Even heat distribution, easy to clean, and PFOA-free non-stick coating. Includes 20cm, 24cm and 28cm pots with glass lids.",
      price: 4500,
      compareAtPrice: 6500,
      sku: "POT-001",
      stock: 50,
      images: "",
      featured: true,
      categorySlug: "cooking-pots",
    },
    {
      name: "Pressure Cooker 6L Stainless Steel",
      slug: "pressure-cooker-6l",
      description:
        "6-litre stainless steel pressure cooker. Cooks food fast and saves up to 70% energy. Safe locking lid with multiple pressure settings. Ideal for beans, githeri and tough cuts of meat.",
      price: 7800,
      compareAtPrice: 9500,
      sku: "POT-002",
      stock: 30,
      images: "",
      featured: true,
      categorySlug: "cooking-pots",
    },
    {
      name: "Cast Iron Cooking Pot (Sufuria) 24cm",
      slug: "cast-iron-pot-24cm",
      description:
        "Traditional cast iron sufuria that retains heat beautifully. Perfect for slow-cooked stews and pilau. Comes with a heavy-duty lid and is suitable for all heat sources including open flame.",
      price: 3200,
      compareAtPrice: null,
      sku: "POT-003",
      stock: 20,
      images: "",
      featured: false,
      categorySlug: "cooking-pots",
    },
    {
      name: "Non-Stick Frying Pan 28cm",
      slug: "nonstick-frying-pan-28cm",
      description:
        "Large 28cm non-stick frying pan with comfortable ergonomic handle. Scratch-resistant granite coating. Oven safe up to 200°C and dishwasher safe.",
      price: 2200,
      compareAtPrice: 3000,
      sku: "PAN-001",
      stock: 60,
      images: "",
      featured: true,
      categorySlug: "pans-and-frying",
    },
    {
      name: "Deep Fry Pan / Wok 32cm",
      slug: "deep-fry-wok-32cm",
      description:
        "Versatile deep wok pan ideal for frying, stir-frying and making pilau. High-quality aluminium body with non-stick interior and tempered glass lid.",
      price: 2900,
      compareAtPrice: null,
      sku: "PAN-002",
      stock: 45,
      images: "",
      featured: false,
      categorySlug: "pans-and-frying",
    },
    {
      name: "Omelette Pan Non-Stick 24cm",
      slug: "omelette-pan-24cm",
      description:
        "Lightweight omelette pan with smooth non-stick surface. Makes perfect eggs, pancakes and crepes with minimal oil. Scratch resistant and easy to clean.",
      price: 1600,
      compareAtPrice: null,
      sku: "PAN-003",
      stock: 70,
      images: "",
      featured: false,
      categorySlug: "pans-and-frying",
    },
    {
      name: "Professional Chef Knife 8\"",
      slug: "professional-chef-knife-8",
      description:
        "High-carbon stainless steel chef knife. Precision forged, razor-sharp edge that stays sharp longer. Includes protective guard. Essential for every kitchen.",
      price: 2400,
      compareAtPrice: 3500,
      sku: "KNF-001",
      stock: 80,
      images: "",
      featured: true,
      categorySlug: "knives-and-cutting",
    },
    {
      name: "Knife Set 5 piece with Block",
      slug: "knife-set-5-piece",
      description:
        "Complete 5-piece knife set including chef knife, carving knife, utility knife, paring knife and bread knife. Comes with a stylish wooden storage block.",
      price: 5500,
      compareAtPrice: 7500,
      sku: "KNF-002",
      stock: 40,
      images: "",
      featured: true,
      categorySlug: "knives-and-cutting",
    },
    {
      name: "Cutting Board Set (3 piece) Bamboo",
      slug: "cutting-board-set-bamboo",
      description:
        "Set of 3 bamboo cutting boards in different sizes. Natural antibacterial properties, easy to clean and gentle on knife edges. Includes hanging loops for storage.",
      price: 1800,
      compareAtPrice: null,
      sku: "KNF-003",
      stock: 90,
      images: "",
      featured: false,
      categorySlug: "knives-and-cutting",
    },
    {
      name: "Stainless Steel Serving Spoon Set (5pc)",
      slug: "serving-spoon-set-5pc",
      description:
        "Elegant 5-piece stainless steel serving set including large spoon, slotted spoon, ladle, spatula and tongs. Mirror-polished finish, dishwasher safe.",
      price: 1500,
      compareAtPrice: 2000,
      sku: "UTL-001",
      stock: 100,
      images: "",
      featured: true,
      categorySlug: "serving-and-utensils",
    },
    {
      name: "Silicone Cooking Tools Set (8pc)",
      slug: "silicone-cooking-tools-8pc",
      description:
        "Heat-resistant silicone utensils set including spatula, spoon, whisk, ladle, brush and more. BPA free, safe for non-stick pans, withstands up to 230°C.",
      price: 2800,
      compareAtPrice: null,
      sku: "UTL-002",
      stock: 65,
      images: "",
      featured: false,
      categorySlug: "serving-and-utensils",
    },
    {
      name: "Stainless Steel Thermos Flask 1L",
      slug: "thermos-flask-1l",
      description:
        "Double-wall vacuum insulated thermos flask. Keeps drinks hot for 12 hours or cold for 24 hours. Leak-proof lid with cup. Perfect for travel and office.",
      price: 1900,
      compareAtPrice: 2500,
      sku: "DRK-001",
      stock: 85,
      images: "",
      featured: false,
      categorySlug: "drinkware-and-accessories",
    },
    {
      name: "Modern Coffee Mug Set (6pc)",
      slug: "coffee-mug-set-6pc",
      description:
        "Set of 6 stylish ceramic coffee mugs in assorted modern colors. Microwave and dishwasher safe. 350ml capacity with comfortable handles.",
      price: 2100,
      compareAtPrice: null,
      sku: "DRK-002",
      stock: 110,
      images: "",
      featured: false,
      categorySlug: "drinkware-and-accessories",
    },
    {
      name: "Ceramic Serving Bowls Set (6pc)",
      slug: "ceramic-serving-bowls-6pc",
      description:
        "Beautiful set of 6 ceramic serving bowls with elegant glaze finish. Perfect for soups, salads, ugali and stews. Microwave, oven and dishwasher safe.",
      price: 3300,
      compareAtPrice: 4200,
      sku: "DRK-003",
      stock: 55,
      images: "",
      featured: true,
      categorySlug: "drinkware-and-accessories",
    },
  ];

  for (const p of products) {
    const { categorySlug, ...productData } = p;
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productData,
        categoryId: catMap[categorySlug],
      },
    });
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
