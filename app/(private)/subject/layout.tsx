import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Profil administratora",
  description:
    "Giełda transportowa - market.next.pl - zleć i znajdź transport szybko i przystępnie.",
};

export default async function subjectManage({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/signin");
  if (session.user.role !== "subject_admin") redirect("/");
  return <Card className="flex flex-col space-y-8 mb-5">{children}</Card>;
}
