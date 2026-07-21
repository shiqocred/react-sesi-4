"use client";

import { useApplicationFilter } from "../_context/application-filter-context";
import type { ApplicationStatus } from "../_types/application";
import StatusFilterButton from "./status-filter-button";

type FilterOption = {
  value: ApplicationStatus;
  label: string;
};

const filterOptions: FilterOption[] = [
  { value: "all", label: "Semua" },
  { value: "pending", label: "Menunggu" },
  { value: "approved", label: "Disetujui" },
  { value: "rejected", label: "Ditolak" },
];

const ApplicationFilter = () => {
  const { status, changeStatus } = useApplicationFilter();

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-950">Filter Status</h2>
      <p className="mt-1 text-sm text-zinc-600">
        Tombol child mengirim status terpilih lewat callback ke Context.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <StatusFilterButton
            key={option.value}
            status={option.value}
            label={option.label}
            isActive={status === option.value}
            onSelect={changeStatus}
          />
        ))}
      </div>
    </section>
  );
};

export default ApplicationFilter;
