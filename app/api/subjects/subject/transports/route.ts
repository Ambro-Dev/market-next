import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const subjectId = req.nextUrl.searchParams.get("subjectId");

  if (!subjectId || subjectId === "" || subjectId === "undefined") {
    return NextResponse.json({ error: "Brakuje ID podmiotu", status: 400 });
  }

  const subject = await prisma.subject.findUnique({
    where: {
      id: subjectId,
    },
    select: {
      transports: {
        select: {
          id: true,
          description: true,
          createdAt: true,
          vehicle: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          creator: {
            select: {
              id: true,
              username: true,
            },
          },
          type: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              objects: true,
            },
          },
        },
      },
    },
  });

  if (!subject) {
    return NextResponse.json({
      error: "Nie znaleziono podmiotu",
      status: 404,
    });
  }

  return NextResponse.json({ transports: subject.transports, status: 200 });
};
