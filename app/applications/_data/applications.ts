import type { AccountApplication } from "../_types/application";

// Data dummy untuk latihan daftar pengajuan rekening.
export const applications: AccountApplication[] = [
  {
    id: "APP-001",
    customerName: "Budi Santoso",
    accountType: "tabungan",
    branch: "Surabaya",
    status: "pending",
  },
  {
    id: "APP-002",
    customerName: "Siti Rahma",
    accountType: "giro",
    branch: "Malang",
    status: "approved",
  },
  {
    id: "APP-003",
    customerName: "Andi Wijaya",
    accountType: "tabungan",
    branch: "Kediri",
    status: "rejected",
  },
];
