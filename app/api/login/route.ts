import { verify } from "@node-rs/argon2";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { sessions, users } from "@/db/schema";
import { corsPreflightResponse, withCors } from "@/lib/cors";
import { getDb } from "@/lib/db";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

const sessionMaxAgeSeconds = 60 * 60 * 24 * 7;

export const OPTIONS = async (request: Request) =>
  corsPreflightResponse(request);

export const POST = async (request: Request) => {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return withCors(
      request,
      NextResponse.json(
        { message: "Payload login tidak valid" },
        { status: 400 },
      ),
    );
  }

  const db = getDb();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, parsed.data.email))
    .limit(1);

  if (!user) {
    return withCors(
      request,
      NextResponse.json(
        { message: "Email atau password salah" },
        { status: 401 },
      ),
    );
  }

  const isPasswordValid = await verify(user.passwordHash, parsed.data.password);

  if (!isPasswordValid) {
    return withCors(
      request,
      NextResponse.json(
        { message: "Email atau password salah" },
        { status: 401 },
      ),
    );
  }

  const expiresAt = new Date(Date.now() + sessionMaxAgeSeconds * 1000);
  const token = createId();

  // API login JSON-only: token dikembalikan sebagai accessToken.
  // Penyimpanan cookie untuk web internal dilakukan di client memakai next-cookie.
  await db.insert(sessions).values({
    id: createId(),
    token,
    userId: user.id,
    expiresAt,
  });

  const response = NextResponse.json({
    accessToken: token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });

  return withCors(request, response);
};
