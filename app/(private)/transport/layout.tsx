import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transport - market.next.pl",
  description:
    "Giełda transportowa - market.next.pl - zleć i znajdź transport szybko i przystępnie.",
};

export default async function TransportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
