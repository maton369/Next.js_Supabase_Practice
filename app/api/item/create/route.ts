// app/api/items/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import supabase from "@/app/utils/database";

export async function POST(request: NextRequest) {
  const reqbody = await request.json();

  try {
    const { error } = await supabase.from("items").insert(reqbody);

    if (error) {
      console.error("Supabase挿入エラー:", error);
      return NextResponse.json(
        { message: "アイテム作成失敗", error },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "アイテム作成成功" });
  } catch (e) {
    console.error("例外発生:", e);
    return NextResponse.json(
      { message: "予期せぬエラーで失敗しました" },
      { status: 500 }
    );
  }
}
