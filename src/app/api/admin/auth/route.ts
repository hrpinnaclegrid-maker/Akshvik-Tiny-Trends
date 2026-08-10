import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Settings } from "@/lib/models";

const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "Akshvik@tinytrends";

async function getAdminPassword() {
  let passwordSetting = await Settings.findOne({ key: "admin_password" });
  if (!passwordSetting) {
    passwordSetting = await Settings.create({ key: "admin_password", value: DEFAULT_PASSWORD });
  }
  return passwordSetting.value;
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { password } = await request.json();
    const currentPassword = await getAdminPassword();

    if (password === currentPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Incorrect password" }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const { currentPassword, newPassword } = await request.json();
    const actualPassword = await getAdminPassword();

    if (currentPassword !== actualPassword) {
      return NextResponse.json({ success: false, error: "Current password is incorrect" }, { status: 401 });
    }

    if (!newPassword || newPassword.trim().length < 4) {
      return NextResponse.json({ success: false, error: "New password must be at least 4 characters long" }, { status: 400 });
    }

    await Settings.findOneAndUpdate(
      { key: "admin_password" },
      { value: newPassword },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
