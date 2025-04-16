import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import supabase from "@/app/utils/database";

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase.from("items").select("*");

    if (error) {
      console.error("データ取得失敗:", error);
      return NextResponse.json(
        { message: "データ取得失敗", error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "アイテム読み取り成功（オール）",
      items: data,
    });
  } catch (e) {
    console.error("例外発生:", e);
    return NextResponse.json(
      { message: "予期せぬエラーで失敗しました" },
      { status: 500 }
    );
  }
}
