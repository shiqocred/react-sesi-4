import { NextResponse } from "next/server";

const defaultAllowedOrigins = ["*"];

const getAllowedOrigins = () => {
  const origins = process.env.CORS_ORIGINS;

  if (!origins) {
    return defaultAllowedOrigins;
  }

  return origins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const getCorsOrigin = (request: Request) => {
  const allowedOrigins = getAllowedOrigins();

  // Wildcard cocok untuk API Bearer token. Jangan kirim credentials saat origin "*".
  if (allowedOrigins.includes("*")) {
    return "*";
  }

  const origin = request.headers.get("origin");

  if (!origin) {
    return null;
  }

  if (allowedOrigins.includes(origin)) {
    return origin;
  }

  return null;
};

const setCorsHeaders = (request: Request, response: NextResponse) => {
  const corsOrigin = getCorsOrigin(request);

  if (corsOrigin) {
    response.headers.set("Access-Control-Allow-Origin", corsOrigin);

    if (corsOrigin !== "*") {
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }
  }

  response.headers.set("Vary", "Origin");

  return response;
};

export const withCors = (request: Request, response: NextResponse) =>
  setCorsHeaders(request, response);

export const corsPreflightResponse = (request: Request) => {
  const response = new NextResponse(null, { status: 204 });

  setCorsHeaders(request, response);
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Accept",
  );
  response.headers.set("Access-Control-Max-Age", "86400");

  return response;
};
