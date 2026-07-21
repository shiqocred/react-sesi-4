import { auth } from "@/lib/auth";
import LoginForm from "./_components/login-form";
import { redirect } from "next/navigation";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const { next } = await searchParams;
  const { isAuth } = await auth();

  console.log(isAuth);

  if (isAuth) {
    redirect(`${next ?? "/applications"}`);
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12">
      <section className="mx-auto w-full max-w-5xl">
        <div className="mx-auto w-full max-w-md">
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Portal Internal
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">
            Login Petugas
          </h1>
          <p className="mt-3 text-zinc-600">
            Silakan login untuk mengakses portal review pengajuan rekening.
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Tujuan setelah login: {next}
          </p>

          <LoginForm next={next ?? ""} />
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
