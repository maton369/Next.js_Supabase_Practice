// app/api/item/update/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import supabase from "@/app/utils/database";

const SECRET_KEY = new TextEncoder().encode("next-market-route-handlers");

export async function PUT(request: NextRequest) {
  // URL から ID 抽出
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json(
      { message: "IDが指定されていません" },
      { status: 400 }
    );
  }

  // トークン確認
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { message: "トークンがありません" },
      { status: 401 }
    );
  }

  let email = "";
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    email = payload.email as string;
  } catch {
    return NextResponse.json(
      { message: "トークンが無効です" },
      { status: 401 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "リクエスト形式が不正です" },
      { status: 400 }
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
        { message: "アイテムが見つかりません" },
        { status: 404 }
      );
    }

    if (item.email !== email) {
      return NextResponse.json(
        { message: "他の人のアイテムは編集できません" },
        { status: 403 }
      );
    }

    const { error: updateError } = await supabase
      .from("items")
      .update(body)
      .eq("id", id);

    if (updateError) {
      return NextResponse.json(
        { message: "更新に失敗しました", error: updateError },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "アイテムを更新しました" });
  } catch (err) {
    return NextResponse.json(
      { message: `更新処理失敗: ${err}` },
      { status: 500 }
    );
  }
}
