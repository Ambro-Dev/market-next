import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const subjects = await prisma.subject.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  if (!subjects) {
    return NextResponse.json({ error: "Nie znaleziono szkół", status: 422 });
  }

  return NextResponse.json({ subjects, status: 200 });
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { name, plan } = body;

  if (!(name || plan)) {
    return NextResponse.json({ error: "Brakuje wymaganych pól", status: 400 });
  }

  const subjectExists = await prisma.subject.findFirst({
    where: {
      name,
    },
  });

  if (subjectExists) {
    return NextResponse.json({
      error: "Podmiot o takiej nazwie już istnieje",
      status: 422,
    });
  }

  const expireDate = () => {
    const date = new Date();
    switch (plan) {
      case "month":
        date.setMonth(date.getMonth() + 1);
        break;
      case "year":
        date.setFullYear(date.getFullYear() + 1);
        break;
      case "half-year":
        date.setMonth(date.getMonth() + 6);
        break;
      default:
        date.setMonth(date.getMonth() + 1);
        break;
    }
    return date;
  };

  const subject = await prisma.subject.create({
    data: {
      name,
      accessExpires: expireDate(),
    },
  });

  if (!subject) {
    return NextResponse.json({
      error: "Błąd podczas dodawania podmiotu",
      status: 422,
    });
  }

  return NextResponse.json({
    message: "Podmiot dodana",
    subjectId: subject.id,
    status: 200,
  });
};
