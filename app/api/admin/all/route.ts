import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const countsubjects = await prisma.subject.count();
  const countMembers = await prisma.user.count({
    where: {
      role: "member",
    },
  });
  const countTransports = await prisma.transport.count();

  return NextResponse.json(
    {
      subjects: countsubjects,
      members: countMembers,
      transports: countTransports,
    },
    { status: 200 }
  );
};
