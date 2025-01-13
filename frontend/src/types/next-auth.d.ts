// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { DefaultSession } from "next-auth"
import { JWT as NextAuthJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      accessToken: string;
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    role: UserRole;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends NextAuthJWT {
    role: UserRole;
    accessToken: string;
  }
}