import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import supabase from "@/app/utils/database";

export async function DELETE(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    const { error } = await supabase.from("items").delete().eq("id", id);

    if (error) {
      console.error("データ削除エラー:", error);
      return NextResponse.json(
        { message: "アイテム削除失敗", error },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "アイテム削除成功", id });
  } catch (e) {
    console.error("例外発生:", e);
    return NextResponse.json(
      { message: "予期せぬエラーで失敗しました" },
      { status: 500 }
    );
  }
}
