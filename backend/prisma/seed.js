/**
 * Prisma Seed Script (JavaScript version for backend)
 * Jalankan: node prisma/seed.js
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.checkIn.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.court.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      passwordHash: '202520',
      role: 'admin',
    },
  });
  console.log('Admin user created:', admin.username);

  const courts = [
    { name: 'Futsal 1', sport: 'futsal', pricePerHour: 150000 },
    { name: 'Badminton 1', sport: 'badminton', pricePerHour: 50000 },
    { name: 'Badminton 2', sport: 'badminton', pricePerHour: 50000 },
    { name: 'Badminton 3', sport: 'badminton', pricePerHour: 50000 },
    { name: 'Badminton 4', sport: 'badminton', pricePerHour: 50000 },
  ];

  for (const court of courts) {
    const created = await prisma.court.create({ data: court });
    console.log('Court created:', created.name);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
