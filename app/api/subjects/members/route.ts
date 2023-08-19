import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import bcrypt from "bcrypt";

export async function GET(req: NextRequest) {
  const subjectId = req.nextUrl.searchParams.get("subjectId");

  if (!subjectId) {
    return NextResponse.json({ error: "Missing subjectId" }, { status: 400 });
  }

  const members = await prisma.member.findMany({
    where: {
      subjectId: subjectId,
    },
    select: {
      name: true,
      surname: true,
      user: {
        select: {
          id: true,
          username: true,
          isBlocked: true,
        },
      },
    },
  });

  if (!members) {
    return NextResponse.json({ error: "No members found" }, { status: 404 });
  }

  const membersReturn = members.map((member) => {
    return {
      id: member.user.id,
      username: member.user.username,
      name_and_surname: `${member.name || ""} ${member.surname || ""}`,
      isBlocked: member.user.isBlocked,
    };
  });

  return NextResponse.json(membersReturn);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { username, subjectId, email } = await body;

  if (!username || !subjectId || !email) {
    return NextResponse.json({ error: "Brakuje wymaganych pól", status: 400 });
  }

  const usernameTaken = await prisma.user.findUnique({
    where: { username },
  });

  if (usernameTaken) {
    return NextResponse.json({
      error: `Użytkownik o nazwie ${username} już istnieje`,
      status: 400,
    });
  }

  const emailTaken = await prisma.user.findUnique({
    where: { email },
  });

  if (emailTaken) {
    return NextResponse.json({
      error: `Użytkownik o emailu ${email} już istnieje`,
      status: 400,
    });
  }

  const password = Math.random().toString(36).slice(-12);
  const hashedPassword = bcrypt.hashSync(password, 10);

  const member = await prisma.member.create({
    data: {
      subject: {
        connect: {
          id: subjectId,
        },
      },
      user: {
        create: {
          username: username,
          hashedPassword: hashedPassword,
          role: "member",
          email: email,
        },
      },
    },
  });

  if (!member) {
    return NextResponse.json({
      error: "Nie udało się dodać członka",
      status: 500,
    });
  }

  return NextResponse.json({
    user: {
      username,
      email,
      role: "member",
      password,
    },
    message: "Członek dodany prawidłowo",
    status: 201,
  });
}
