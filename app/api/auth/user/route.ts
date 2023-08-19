import prisma from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId || userId === "" || userId === "undefined") {
    return NextResponse.json({ error: "Brakuje ID użytkownika", status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return NextResponse.json({
      error: "Nie znaleziono użytkownika",
      status: 404,
    });
  }

  if (user.role === "member") {
    const member = await prisma.member.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!member) {
      return NextResponse.json({
        error: "Nie znaleziono członka",
        status: 404,
      });
    }

    if (!member.name || !member.surname) {
      return NextResponse.json({
        user: {
          name: member.name,
          surname: member.surname,
        },
        error: "Uzupełnij dane konta",
        status: 402,
      });
    }

    return NextResponse.json({
      message: "Wszystko aktualne",
      user: {
        name: member.name,
        surname: member.surname,
      },
      status: 200,
    });
  }

  if (!user.name || !user.surname) {
    return NextResponse.json({
      user: {
        name: user.name,
        surname: user.surname,
      },
      error: "Uzupełnij dane konta",
      status: 402,
    });
  }

  return NextResponse.json({
    message: "Wszystko aktualne",
    user: {
      name: user.name,
      surname: user.surname,
    },
    status: 200,
  });
};

export const PUT = async (req: NextRequest) => {
  const body = req.json();

  const { name, surname, userId } = await body;

  if (!userId || userId === "" || userId === "undefined") {
    return NextResponse.json({ error: "Brakuje ID użytkownika", status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return NextResponse.json({
      error: "Nie znaleziono użytkownika",
      status: 404,
    });
  }

  if (!name || !surname) {
    return NextResponse.json({
      error: "Brakuje imienia lub nazwiska",
      status: 422,
    });
  }

  if (user.role === "member") {
    const updatedMember = await prisma.member.update({
      where: {
        userId: user.id,
      },
      data: {
        name,
        surname,
      },
    });

    return NextResponse.json({
      message: "Dane zmienione prawidłowo",
      user: {
        name: updatedMember.name,
        surname: updatedMember.surname,
      },
      status: 200,
    });
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      name,
      surname,
    },
  });

  return NextResponse.json({
    message: "Dane zmienione prawidłowo",
    user: {
      name: updatedUser.name,
      surname: updatedUser.surname,
    },
    status: 200,
  });
};
