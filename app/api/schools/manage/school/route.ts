import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId || userId === "" || userId === "undefined") {
    return NextResponse.json({
      error: "Brakuje parametru subjectId",
      status: 400,
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Użytkownik nie istnieje", status: 404 });
  }

  const subject = await prisma.subject.findFirst({
    where: {
      administratorId: userId,
    },
  });

  if (!subject) {
    return NextResponse.json({
      error: "Użytkownik nie jest administratorem żadnej podmiotu",
      status: 404,
    });
  }

  return NextResponse.json({ subject, status: 200 });
};
