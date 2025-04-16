import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import supabase from "@/app/utils/database";

// 簡易メール形式チェック（正規表現）
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "名前、メール、パスワードは全て必須です" },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { message: "有効なメールアドレスを入力してください" },
      { status: 400 }
    );
  }

  try {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
      }
    );

    if (signUpError || !signUpData.user) {
      console.error("ユーザー登録失敗:", signUpError);
      return NextResponse.json(
        { message: "ユーザー登録失敗", error: signUpError },
        { status: 500 }
      );
    }

    const { error: insertError } = await supabase.from("users").insert({
      id: signUpData.user.id,
      name,
      email,
    });

    if (insertError) {
      console.error("ユーザー情報挿入失敗:", insertError);
      return NextResponse.json(
        { message: "ユーザー情報保存失敗", error: insertError },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "ユーザー登録と情報保存成功",
      user: {
        id: signUpData.user.id,
        email,
        name,
      },
    });
  } catch (e) {
    console.error("例外発生:", e);
    return NextResponse.json(
      { message: "予期せぬエラーで失敗しました" },
      { status: 500 }
    );
  }
}
