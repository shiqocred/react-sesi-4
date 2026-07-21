import { hash } from "@node-rs/argon2";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { getDb } from "@/lib/db";

const db = getDb();

const dummyAccounts = [
  {
    name: "Admin Rekening",
    email: "admin@example.com",
    password: "password123",
    role: "admin" as const,
  },
  {
    name: "Staff Review",
    email: "staff@example.com",
    password: "password123",
    role: "staff" as const,
  },
];

for (const account of dummyAccounts) {
  const [existingUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, account.email))
    .limit(1);

  if (existingUser) {
    console.log(`Skip ${account.email}, sudah ada.`);
    continue;
  }

  await db.insert(users).values({
    id: createId(),
    name: account.name,
    email: account.email,
    role: account.role,
    passwordHash: await hash(account.password),
  });

  console.log(`Berhasil membuat user ${account.email} / ${account.password}`);
}

process.exit(0);
