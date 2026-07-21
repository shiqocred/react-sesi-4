import { NextResponse, type NextRequest } from "next/server";

export const proxy = (request: NextRequest) => {
  const session = request.cookies.get("session")?.value;

  // Pemeriksaan awal: tanpa cookie langsung diarahkan ke login sebelum page diproses.
  if (!session) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("next", request.nextUrl.pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/applications/:path*"],
};
