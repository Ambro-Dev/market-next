import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Profil administratora",
  description:
    "Giełda transportowa - market.next.pl - zleć i znajdź transport szybko i przystępnie.",
};

export default async function SubjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/signin");
  return <>{children}</>;
}
