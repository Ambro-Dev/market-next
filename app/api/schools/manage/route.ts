import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const subjectId = req.nextUrl.searchParams.get("subjectId");
  if (!subjectId || subjectId === "" || subjectId === "undefined") {
    return NextResponse.json({ error: "Missing subjectId" }, { status: 400 });
  }
  const subject = await prisma.subject.findUnique({
    where: {
      id: subjectId,
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          transports: true,
          members: true,
        },
      },
      administrator: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      accessExpires: true,
    },
  });

  if (!subject) {
    return NextResponse.json(
      { error: "Brak wyszukiwanej podmiotu" },
      { status: 404 }
    );
  }

  const latestTransports = await prisma.transport.findMany({
    where: {
      subjectId: subjectId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
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
  });

  return NextResponse.json({ subject, latestTransports });
};
