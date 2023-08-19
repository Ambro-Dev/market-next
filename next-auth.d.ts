// Ref: https://next-auth.js.org/getting-started/typescript#module-augmentation

import { Role } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: String;
      role: Role;
      username: string;
      email?: string;
      subjectId?: string;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    role: Role;
    subjectId?: string;
    username: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: Role;
    id: string;
    username: string;
    email?: string;
    subjectId?: string;
  }
}
