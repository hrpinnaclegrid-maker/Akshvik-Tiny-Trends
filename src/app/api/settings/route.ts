import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Settings } from "@/lib/models";

export async function GET() {
  try {
    await connectToDatabase();
    let luckyWinnerSetting = await Settings.findOne({ key: "lucky_winner" });
    if (!luckyWinnerSetting) {
      luckyWinnerSetting = await Settings.create({ key: "lucky_winner", value: "Aarav" });
    }
    return NextResponse.json({ lucky_winner: luckyWinnerSetting.value });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const { key, value } = await request.json();
    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }
    const updatedSetting = await Settings.findOneAndUpdate(
      { key },
      { key, value },
      { new: true, upsert: true }
    );
    return NextResponse.json(updatedSetting);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
