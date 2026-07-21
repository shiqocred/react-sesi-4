import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { sessions } from "@/db/schema";
import { corsPreflightResponse, withCors } from "@/lib/cors";
import { getDb } from "@/lib/db";

const getBearerToken = (request: Request) => {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
};

export const OPTIONS = async (request: Request) =>
  corsPreflightResponse(request);

export const POST = async (request: Request) => {
  const token = getBearerToken(request);

  if (!token) {
    return withCors(
      request,
      NextResponse.json({ message: "Token tidak ditemukan" }, { status: 401 }),
    );
  }

  const db = getDb();

  // Logout API hanya invalidasi Bearer token di database, tanpa Set-Cookie.
  await db.delete(sessions).where(eq(sessions.token, token));

  return withCors(request, NextResponse.json({ message: "Logout berhasil" }));
};
