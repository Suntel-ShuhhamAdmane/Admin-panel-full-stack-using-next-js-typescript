import NextAuth, {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client"; // If using Prisma

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions={
    providers: [
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            email: { label: "Email", type: "email", placeholder: "admin@example.com" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials: { email: any; password: string; }) {
            if (!credentials?.email || !credentials?.password) {
              throw new Error("Missing email or password");
            }
    
            // Fetch user from database (Prisma example)
            const user = await prisma.user.findUnique({
              where: { email: credentials.email },
            });
    
            if (!user || user.password !== credentials.password) {
              throw new Error("Invalid email or password");
            }
    
            return { id: user.id, name: user.name, email: user.email, role: user.role };
          },
        }),
      ],
      callbacks: {
        async session({ session, token }) {
          session.user.role = token.role;
          return session;
        },
        async jwt({ token, user }) {
          if (user) token.role = user.role;
          return token;
        },
      },
      session: {
        strategy: "jwt",
      },
      secret: process.env.NEXTAUTH_SECRET,
    };
    
    export default NextAuth(authOptions);


