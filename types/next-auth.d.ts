import { Role } from "@prisma/client";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        id: string;
        name: string;
        email: string;
    }

    interface User {
        id: string;
        name: string;
        email: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        email: string;
        name: string;
    }
}
