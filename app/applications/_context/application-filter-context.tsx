"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { ApplicationStatus } from "../_types/application";

type ApplicationFilterContextValue = {
  status: ApplicationStatus;
  changeStatus: (status: ApplicationStatus) => void;
};

type ApplicationFilterProviderProps = {
  children: ReactNode;
};

const ApplicationFilterContext =
  createContext<ApplicationFilterContextValue | null>(null);

export const ApplicationFilterProvider = ({
  children,
}: ApplicationFilterProviderProps) => {
  // Single source of truth untuk filter status seluruh halaman applications.
  const [status, setStatus] = useState<ApplicationStatus>("all");

  const changeStatus = (newStatus: ApplicationStatus) => {
    setStatus(newStatus);
  };

  return (
    <ApplicationFilterContext value={{ status, changeStatus }}>
      {children}
    </ApplicationFilterContext>
  );
};

export const useApplicationFilter = () => {
  const context = useContext(ApplicationFilterContext);

  if (!context) {
    throw new Error(
      "useApplicationFilter harus digunakan di dalam ApplicationFilterProvider",
    );
  }

  return context;
};
