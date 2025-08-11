// server/scripts/seed.js
import { prisma } from '../lib/prisma.js';
import { generateSeedData } from '../config/gemini.js';
import bcrypt from 'bcryptjs';

const UNSPLASH_IMAGES = [
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1080',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1080',
  'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=1080',
  'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1080',
  'https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?w=1080',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1080',
  'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=1080',
  'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1080',
  'https://images.unsplash.com/photo-1506252374453-ef5237e7d42f?w=1080',
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding on Windows...');

    console.log('🤖 Generating seed data with Gemini AI...');
    const seedData = await generateSeedData();

    console.log(`📊 Generated ${seedData.length} posts`);

    for (let i = 0; i < seedData.length; i++) {
      const postData = seedData[i];
      
      try {
        let user = await prisma.user.findUnique({
          where: { username: postData.username }
        });

        if (!user) {
          const hashedPassword = await bcrypt.hash('password123', 12);
          user = await prisma.user.create({
            data: {
              username: postData.username,
              email: `${postData.username.toLowerCase()}@example.com`,
              password: hashedPassword,
            }
          });
        }

        const randomImage = UNSPLASH_IMAGES[Math.floor(Math.random() * UNSPLASH_IMAGES.length)];
        const randomDaysAgo = Math.floor(Math.random() * 90);
        const createdAt = new Date(Date.now() - randomDaysAgo * 24 * 60 * 60 * 1000);

        await prisma.post.create({
          data: {
            caption: postData.caption,
            location: postData.location,
            imageUrl: randomImage,
            imagePublicId: `seed_${Date.now()}_${i}`,
            userId: user.id,
            createdAt: createdAt,
            likesCount: Math.floor(Math.random() * 50),
            sharesCount: Math.floor(Math.random() * 10),
          }
        });

        console.log(`✅ Created post ${i + 1}/${seedData.length} by ${postData.username}`);
      } catch (error) {
        console.error(`❌ Error creating post ${i + 1}:`, error.message);
      }
    }

    console.log('🎉 Database seeding completed successfully on Windows!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
