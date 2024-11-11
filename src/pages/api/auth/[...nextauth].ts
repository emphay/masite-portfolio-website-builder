import NextAuth, { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt"; // Assuming bcrypt is installed and correctly typed.

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials?.username && credentials?.password) {
          const userWithPassword = await prisma.user.findUnique({
            select: {
              id: true,
              FirstName: true,
              LastName: true,
              email: true,
              password: true,
            },
            where: {
              username: credentials.username,
            },
          });

          if (userWithPassword && userWithPassword.password) {
            const compareResult = bcrypt.compareSync(
              credentials.password,
              userWithPassword.password
            );
            if (compareResult) {
              console.log("Passwords match! User authenticated.");
              return {
                id: userWithPassword.id,
                name: `${userWithPassword.FirstName} ${userWithPassword.LastName}`,
                username: credentials.username,
                email: userWithPassword.email || "",
              };
            } else {
              console.log("Passwords do not match! Authentication failed.");
              return null;
            }
          } else {
            console.log("User not found or password missing!");
            return null;
          }
        } else {
          console.log("Credentials not provided.");
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.id = token.id;
        session.email = token.email;
        session.name = token.name;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  pages: {
    signIn: "/signin",
  },
};

export default NextAuth(authOptions);
