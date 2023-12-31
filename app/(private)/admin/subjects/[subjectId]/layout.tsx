import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import { MainNav } from "@/components/dashboard/main-nav";
import { Search } from "@/components/dashboard/search";
import TeamSwitcher from "@/components/dashboard/team-switcher";

export const metadata: Metadata = {
  title: "Zarządzanie podmiotem",
  description: "Example dashboard app using the components.",
};

export default async function SubjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    subjectId: string;
  };
}) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/signin");
  return (
    <div className="flex flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center justify-between px-4">
          <TeamSwitcher subjectId={params.subjectId} />
          <MainNav subjectId={params.subjectId} />
        </div>
      </div>
      <>{children}</>
    </div>
  );
}
