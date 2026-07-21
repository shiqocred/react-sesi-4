"use client";

import Link from "next/link";
import { useApplicationFilter } from "../_context/application-filter-context";
import type { AccountApplication } from "../_types/application";

type ApplicationListProps = {
  applications: AccountApplication[];
};

const ApplicationList = ({ applications }: ApplicationListProps) => {
  const { status } = useApplicationFilter();

  const filteredApplications =
    status === "all"
      ? applications
      : applications.filter((application) => application.status === status);

  if (filteredApplications.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-zinc-600">
        Tidak ada pengajuan dengan status tersebut.
      </p>
    );
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-950">Daftar Pengajuan</h2>

      <ul className="mt-4 grid gap-4 md:grid-cols-3">
        {filteredApplications.map((application) => (
          <li
            key={application.id}
            className="rounded-xl border border-zinc-200 p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {application.id}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-zinc-950">
              {application.customerName}
            </h3>
            <p className="mt-2 text-sm text-zinc-600">
              Jenis rekening: {application.accountType}
            </p>
            <p className="text-sm text-zinc-600">Status: {application.status}</p>

            <Link
              href={`/applications/${application.id}`}
              className="mt-4 inline-flex text-sm font-semibold text-zinc-950 underline-offset-4 hover:underline"
            >
              Lihat Detail
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ApplicationList;
