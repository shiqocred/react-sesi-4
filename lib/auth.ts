import "server-only";

import { cookies } from "next/headers";
import { apiUrl } from "./config";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
};

type AuthResult =
  | {
      isAuth: true;
      user: AuthUser;
    }
  | {
      isAuth: false;
      user: null;
    };

export const auth = async (): Promise<AuthResult> => {
  const session = (await cookies()).get("session")?.value;

  if (!session) {
    return { isAuth: false, user: null };
  }

  // Page protected memvalidasi session ke /me memakai Bearer token.
  // Cookie tetap dipakai sebagai storage httpOnly dan pemeriksaan awal di proxy.
  const response = await fetch(`${apiUrl}/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session}`,
    },
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) {
    return { isAuth: false, user: null };
  }

  if (!response.ok) {
    throw new Error("Gagal memverifikasi session pengguna.");
  }

  const user = (await response.json()) as AuthUser;

  return { isAuth: true, user };
};
