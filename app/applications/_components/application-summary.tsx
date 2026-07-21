"use client";

import { useApplicationFilter } from "../_context/application-filter-context";
import type { AccountApplication } from "../_types/application";

type ApplicationSummaryProps = {
  applications: AccountApplication[];
};

const ApplicationSummary = ({ applications }: ApplicationSummaryProps) => {
  const { status } = useApplicationFilter();

  // Derived value: dihitung dari props + context, tidak perlu state tambahan.
  const total =
    status === "all"
      ? applications.length
      : applications.filter((application) => application.status === status)
          .length;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-950">Ringkasan</h2>
      <p className="mt-2 text-3xl font-bold text-zinc-950">{total}</p>
      <p className="text-sm text-zinc-600">Total pengajuan aktif</p>
    </section>
  );
};

export default ApplicationSummary;
