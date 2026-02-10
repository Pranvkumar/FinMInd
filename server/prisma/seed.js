/**
 * seed.js — Seeds the default categories into the database.
 * 
 * Run with:  node prisma/seed.js
 * 
 * This is idempotent — it uses upsert, so running it multiple
 * times won't create duplicates.
 */

require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  { name: "Food", icon: "🍔" },
  { name: "Transport", icon: "🚗" },
  { name: "Entertainment", icon: "🎬" },
  { name: "Rent", icon: "🏠" },
  { name: "Utilities", icon: "💡" },
  { name: "Shopping", icon: "🛍️" },
  { name: "Health", icon: "🏥" },
  { name: "Education", icon: "📚" },
  { name: "Subscriptions", icon: "📱" },
  { name: "Other", icon: "📁" },
];

async function main() {
  console.log("🌱 Seeding categories...");

  for (const cat of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: { icon: cat.icon },
      create: { name: cat.name, icon: cat.icon },
    });
    console.log(`  ✅ ${cat.icon} ${cat.name}`);
  }

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
