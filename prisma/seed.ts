// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function hashedPassword(token: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(token, salt);
}

async function main() {
  // Create roles
  const roleAdmin = await prisma.role.upsert({
    where: { name: 'ROLE_ADMIN' },
    update: {},
    create: { name: 'ROLE_ADMIN' },
  });

  const roleProjectManager = await prisma.role.upsert({
    where: { name: 'ROLE_PROJECT_MANAGER' },
    update: {},
    create: { name: 'ROLE_PROJECT_MANAGER' },
  });

  const roleEngineer = await prisma.role.upsert({
    where: { name: 'ROLE_ENGINEER' },
    update: {},
    create: { name: 'ROLE_ENGINEER' },
  });

  // Seed a user and assign the ROLE_ADMIN
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      phoneNumber: '+123456789',
      address: '123 Admin Lane',
      kraPin: 'A1B2C3D4',
      kraAttachment: '',
      createdAt: new Date(),
      passwordDigest: hashedPassword('Password123@'),
    },
  });

  // Assign the ROLE_ADMIN to the user using the UserRole model
  await prisma.userRole.create({
    data: {
      userId: adminUser.id,
      roleId: roleAdmin.id,
    },
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
