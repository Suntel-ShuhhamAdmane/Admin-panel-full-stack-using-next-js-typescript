import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    // Access params asynchronously
    const { params } = context; 

    if (!params?.id) {
      return NextResponse.json({ error: "Missing admin ID" }, { status: 400 });
    }

    // Convert ID to a number 
    const adminId = parseInt(params.id, 10);
    if (isNaN(adminId)) {
      return NextResponse.json({ error: "Invalid admin ID" }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: { photo: true },
    });

    if (!admin || !admin.photo) {
      return NextResponse.json({ error: "No image available" }, { status: 404 });
    }

    // Convert BLOB to Base64
    const base64Image = Buffer.from(admin.photo).toString("base64");

    return NextResponse.json({ photo: base64Image });
  } catch (error) {
    console.error("Error fetching admin photo:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
