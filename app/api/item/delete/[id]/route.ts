import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import supabase from "@/app/utils/database";

const SECRET_KEY = new TextEncoder().encode("next-market-route-handlers");

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id;
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { message: "トークンがありません。" },
      { status: 401 }
    );
  }

  let userEmail = "";

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    userEmail = payload.email as string;
  } catch (error) {
    return NextResponse.json(
      { message: "トークンが無効です。再ログインしてください。" },
      { status: 401 }
    );
  }

  try {
    const { data: item, error: fetchError } = await supabase
      .from("items")
      .select("email")
      .eq("id", id)
      .single();

    if (fetchError || !item) {
      return NextResponse.json(
        { message: "該当するアイテムが見つかりません", error: fetchError },
        { status: 404 }
      );
    }

    if (item.email !== userEmail) {
      return NextResponse.json(
        { message: "このアイテムはあなたのものではありません" },
        { status: 403 }
      );
    }

    const { error: deleteError } = await supabase
      .from("items")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json(
        { message: "アイテム削除失敗", error: deleteError },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "アイテム削除成功" });
  } catch (e) {
    return NextResponse.json(
      { message: `予期せぬエラー：${e}` },
      { status: 500 }
    );
  }
}
