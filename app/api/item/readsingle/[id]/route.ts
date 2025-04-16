// app/api/items/readsingle/[id]/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import supabase from "@/app/utils/database";

export async function GET(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    const { data, error } = await supabase
      .from("items")
      .select("id, title, image, price, description, email")
      .eq("id", id)
      .single();

    if (error) {
      console.error("データ取得エラー:", error);
      return NextResponse.json(
        { message: "データ取得失敗", error },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "アイテム取得成功",
      item: data,
    });
  } catch (e) {
    console.error("例外発生:", e);
    return NextResponse.json(
      { message: "予期せぬエラーで失敗しました" },
      { status: 500 }
    );
  }
}
