import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LogoutButton from "../_components/logout-button";
import { applications } from "../_data/applications";

type ApplicationDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const ApplicationDetailPage = async ({
  params,
}: ApplicationDetailPageProps) => {
  const { isAuth, user } = await auth();

  if (!isAuth) {
    redirect("/login");
  }

  // App Router terbaru menerima params sebagai Promise pada dynamic route.
  const { id } = await params;

  const application = applications.find((item) => item.id === id);

  if (!application) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <section className="mx-auto w-full max-w-5xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Link
            href="/applications"
            className="text-sm font-semibold text-zinc-950 underline-offset-4 hover:underline"
          >
            Kembali
          </Link>

          <LogoutButton />
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-zinc-950">
          Detail Pengajuan
        </h1>

        <dl className="mt-8 grid gap-4 sm:grid-cols-[180px_1fr]">
          <dt className="font-medium text-zinc-500">ID Pengajuan</dt>
          <dd className="text-zinc-950">{application.id}</dd>

          <dt className="font-medium text-zinc-500">Nama Nasabah</dt>
          <dd className="text-zinc-950">{application.customerName}</dd>

          <dt className="font-medium text-zinc-500">Jenis Rekening</dt>
          <dd className="text-zinc-950">{application.accountType}</dd>

          <dt className="font-medium text-zinc-500">Cabang</dt>
          <dd className="text-zinc-950">{application.branch}</dd>

          <dt className="font-medium text-zinc-500">Status</dt>
          <dd className="text-zinc-950">{application.status}</dd>

          <dt className="font-medium text-zinc-500">Diakses oleh</dt>
          <dd className="text-zinc-950">{user.name}</dd>
        </dl>
      </section>
    </main>
  );
};

export default ApplicationDetailPage;
