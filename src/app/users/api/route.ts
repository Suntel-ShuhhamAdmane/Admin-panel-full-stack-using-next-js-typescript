import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany(); 
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching users", error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { message: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    console.log("Received Data:", body);

    if (!body.name || !body.email || !body.status) {
      return NextResponse.json(
        { message: "Missing required fields (name, email, status)" },
        { status: 400 }
      );
    }

    console.log("Prisma Client Initialized:", prisma);

    // Check if name or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ name: body.name }, { email: body.email }],
      },
    });

    if (existingUser) {
      if (existingUser.email === body.email) {
        return NextResponse.json(
          { message: "Email is already registered" },
          { status: 400 }
        );
      }

      if (existingUser.name === body.name) {
        return NextResponse.json(
          { message: "Name is already taken" },
          { status: 400 }
        );
      }
    }

    // Fetch existing users to determine max ID
    const existingData = await prisma.user.findMany({ select: { id: true } });
    const maxExistingId = existingData.reduce((maxId: number, user: { id: number }) => (user.id > maxId ? user.id : maxId), 0);

    
    const newUser = await prisma.user.create({
      data: {
        id: maxExistingId + 1,
        name: body.name,
        email: body.email,
        status: body.status,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Database error:", error.message || error);
    return NextResponse.json(
      { message: "Error creating user", error: error.message },
      { status: 500 }
    );
  }
}
