"use client";

import { apiUrl } from "@/lib/config";
import { useCookie } from "next-cookie";
import { useState } from "react";

const LogoutButton = () => {
  const cookie = useCookie();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    const token = cookie.get<string>("session");

    if (token) {
      await fetch(`${apiUrl}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    cookie.remove("session", { path: "/" });
    window.location.assign("/login");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className="rounded-lg border border-red-600 bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:border-red-700 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? "Keluar..." : "Keluar"}
    </button>
  );
};

export default LogoutButton;
