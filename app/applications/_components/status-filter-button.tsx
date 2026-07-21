import type { ApplicationStatus } from "../_types/application";

type StatusFilterButtonProps = {
  status: ApplicationStatus;
  label: string;
  isActive: boolean;
  onSelect: (status: ApplicationStatus) => void;
};

const StatusFilterButton = ({
  status,
  label,
  isActive,
  onSelect,
}: StatusFilterButtonProps) => (
  <button
    type="button"
    disabled={isActive}
    onClick={() => onSelect(status)}
    className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100 disabled:border-zinc-900 disabled:bg-zinc-900 dark:disabled:text-white dark:text-black"
  >
    {label}
  </button>
);

export default StatusFilterButton;
