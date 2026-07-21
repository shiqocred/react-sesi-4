export type ApplicationStatus = "all" | "pending" | "approved" | "rejected";

export type AccountApplication = {
  id: string;
  customerName: string;
  accountType: "tabungan" | "giro";
  branch: string;
  status: Exclude<ApplicationStatus, "all">;
};
