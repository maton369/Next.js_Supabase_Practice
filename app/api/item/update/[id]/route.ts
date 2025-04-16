// app/api/item/[id]/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import supabase from "@/app/utils/database";

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const body = await req.json();

  try {
    const { data, error } = await supabase
      .from("items")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("データ更新エラー:", error);
      return NextResponse.json(
        { message: "アイテム更新失敗", error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "アイテム更新成功",
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
