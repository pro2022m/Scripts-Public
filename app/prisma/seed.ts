import { PrismaClient } from "@prisma/client";
import { hash } from "@node-rs/argon2";

import { PERMISSIONS, SYSTEM_ROLES } from "../src/lib/permissions";

const prisma = new PrismaClient();

const ARGON2 = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
} as const;

async function main() {
  // 1. Permissions
  for (const p of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key: p.key },
      create: {
        key: p.key,
        area: p.area,
        resource: p.resource,
        action: p.action,
        description: p.description,
      },
      update: {
        area: p.area,
        resource: p.resource,
        action: p.action,
        description: p.description,
      },
    });
  }
  console.log(`✔ Upserted ${PERMISSIONS.length} permissions`);

  // 2. System roles
  for (const role of SYSTEM_ROLES) {
    const r = await prisma.role.upsert({
      where: { key: role.key },
      create: {
        key: role.key,
        name: role.name,
        description: role.description,
        isSystem: true,
      },
      update: {
        name: role.name,
        description: role.description,
        isSystem: true,
      },
    });

    // Reset role permissions to match the catalog exactly.
    await prisma.rolePermission.deleteMany({ where: { roleId: r.id } });
    await prisma.rolePermission.createMany({
      data: role.permissions.map((permissionKey) => ({
        roleId: r.id,
        permissionKey,
      })),
      skipDuplicates: true,
    });
  }
  console.log(`✔ Upserted ${SYSTEM_ROLES.length} system roles`);

  // 3. Owner user
  const ownerEmail = process.env.SEED_OWNER_EMAIL;
  if (!ownerEmail) {
    console.log("ℹ SEED_OWNER_EMAIL not set — skipping owner creation");
  } else {
    const ownerName = process.env.SEED_OWNER_NAME ?? "Owner";
    const ownerPassword = process.env.SEED_OWNER_PASSWORD;
    const passwordHash = ownerPassword ? await hash(ownerPassword, ARGON2) : null;

    await prisma.user.upsert({
      where: { email: ownerEmail },
      create: {
        email: ownerEmail,
        name: ownerName,
        isOwner: true,
        passwordHash,
      },
      update: {
        isOwner: true,
        // Only overwrite password if one was explicitly provided this run.
        ...(passwordHash ? { passwordHash } : {}),
      },
    });
    console.log(
      `✔ Owner user ${ownerEmail} (${ownerPassword ? "with local password" : "SSO only"})`,
    );
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
