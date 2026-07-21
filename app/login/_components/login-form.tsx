"use client";

import { apiUrl } from "@/lib/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCookie } from "next-cookie";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginFormSchema = z.object({
  email: z.email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

type LoginFormProps = {
  next: string;
};

type LoginResponse = {
  accessToken: string;
};

const LoginForm = ({ next }: LoginFormProps) => {
  const cookie = useCookie();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "staff@example.com",
      password: "password123",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);

    // API login mengembalikan JSON token; cookie internal dibuat di client.
    const response = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      setServerError(payload?.message ?? "Login gagal.");
      return;
    }

    const payload = (await response.json()) as LoginResponse;

    if (!payload.accessToken) {
      setServerError("Response login tidak mengirim access token.");
      return;
    }

    cookie.set("session", payload.accessToken, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    window.location.assign(next);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-8 grid gap-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-2">
        <label className="text-sm font-medium text-zinc-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900 dark:text-black"
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-zinc-700" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900 dark:text-black"
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        ) : null}
      </div>

      {serverError ? (
        <p className="text-sm text-red-600">{serverError}</p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-zinc-950 px-4 py-2 font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Memproses..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
