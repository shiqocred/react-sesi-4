import { and, eq, gt } from "drizzle-orm";
import { NextResponse } from "next/server";
import { sessions, users } from "@/db/schema";
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

export const GET = async (request: Request) => {
  const token = getBearerToken(request);

  if (!token) {
    return withCors(
      request,
      NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    );
  }

  const db = getDb();

  const [session] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
    .limit(1);

  if (!session) {
    return withCors(
      request,
      NextResponse.json({ message: "Session tidak valid" }, { status: 401 }),
    );
  }

  return withCors(request, NextResponse.json(session));
};
