import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const photoFile = formData.get("photo") as File;

    if (!photoFile) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Check if email already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const buffer = Buffer.from(await photoFile.arrayBuffer()); // Convert File to Buffer

    const newAdmin = await prisma.admin.create({
      data: {
        fullName,
        email,
        password: hashedPassword, 
        photo: buffer, // Store image as binary
      },
    });

    return NextResponse.json({ message: "Admin created", admin: newAdmin });
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json({ error: "Error saving admin" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const adminId = parseInt(params.id);

  if (isNaN(adminId)) {
    return NextResponse.json({ error: "Invalid admin ID" }, { status: 400 });
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...admin,
      photo: admin.photo ? Buffer.from(admin.photo).toString("base64") : null,
    });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching admin data" }, { status: 500 });
  }
}

