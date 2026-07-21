import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12">
      <section className="mx-auto w-full max-w-5xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Studi Kasus Sesi 4
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">
          Portal Review Pengajuan Rekening
        </h1>
        <p className="mt-4 text-zinc-600">
          Masuk sebagai petugas untuk melihat daftar, memfilter status, dan
          membuka detail pengajuan rekening.
        </p>
        <Link
          href="/applications"
          className="mt-6 inline-flex rounded-lg bg-zinc-950 px-4 py-2 font-semibold text-white hover:bg-zinc-800"
        >
          Buka Portal
        </Link>
      </section>
    </main>
  );
}
