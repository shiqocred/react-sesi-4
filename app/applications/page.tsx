import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ApplicationFilter from "./_components/application-filter";
import ApplicationList from "./_components/application-list";
import ApplicationSummary from "./_components/application-summary";
import LogoutButton from "./_components/logout-button";
import { ApplicationFilterProvider } from "./_context/application-filter-context";
import { applications } from "./_data/applications";

const ApplicationsPage = async () => {
  const { isAuth, user } = await auth();

  if (!isAuth) {
    redirect("/login?next=/applications");
  }

  return (
    <ApplicationFilterProvider>
      <main className="min-h-screen bg-zinc-50 px-6 py-10">
        <div className="mx-auto grid w-full max-w-5xl gap-6">
          <header className="rounded-2xl bg-zinc-950 p-8 text-white">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-zinc-300">
                  Protected Route
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                  Review Pengajuan Rekening
                </h1>
                <p className="mt-3 text-zinc-300">Petugas: {user.name}</p>
              </div>

              <LogoutButton />
            </div>
          </header>

          <div className="grid gap-6 md:grid-cols-[1fr_220px]">
            <ApplicationFilter />
            <ApplicationSummary applications={applications} />
          </div>
          <ApplicationList applications={applications} />
        </div>
      </main>
    </ApplicationFilterProvider>
  );
};

export default ApplicationsPage;
