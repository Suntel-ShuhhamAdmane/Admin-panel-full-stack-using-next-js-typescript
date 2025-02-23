import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const adminId = parseInt(params.id, 10);
  if (isNaN(adminId)) {
    return NextResponse.json({ error: "Invalid admin ID" }, { status: 400 });
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: { photo: true },
    });

    if (!admin || !admin.photo) {
      return NextResponse.json({ error: "No photo found" }, { status: 404 });
    }

    return NextResponse.json({
      photo: Buffer.from(admin.photo).toString("base64"),
    });
  } catch (error) {
    console.error("Error fetching photo:", error);
    return NextResponse.json({ error: "Error fetching photo" }, { status: 500 });
  }
}

// Update Admin Photo
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const adminId = parseInt(params.id, 10);
  if (isNaN(adminId)) {
    return NextResponse.json({ error: "Invalid admin ID" }, { status: 400 });
  }

  const formData = await req.formData();
  const photoFile = formData.get("photo") as File;

  if (!photoFile) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await photoFile.arrayBuffer());

    const updatedAdmin = await prisma.admin.update({
      where: { id: adminId },
      data: { photo: buffer },
    });

    return NextResponse.json({
      message: "Photo updated successfully",
      photo: buffer.toString("base64"),
    });
  } catch (error) {
    console.error("Error updating photo:", error);
    return NextResponse.json({ error: "Failed to update photo" }, { status: 500 });
  }
}