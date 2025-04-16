import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SignJWT } from "jose";
import supabase from "@/app/utils/database";

export async function POST(request: NextRequest) {
  const reqBody = await request.json();

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", reqBody.email)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { message: "ログイン失敗：ユーザー登録をしてください" },
        { status: 404 }
      );
    }

    // パスワード照合（そのまま比較 / 本番はハッシュ）
    if (reqBody.password !== user.password) {
      return NextResponse.json(
        { message: "ログイン失敗：パスワードが間違っています" },
        { status: 401 }
      );
    }

    // JWT 作成
    const secret = new TextEncoder().encode("next-market-route-handlers");

    const token = await new SignJWT({ email: user.email, id: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(secret);

    return NextResponse.json({
      message: "ログイン成功",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (e) {
    console.error("ログイン処理中エラー:", e);
    return NextResponse.json(
      { message: "ログイン失敗：サーバーエラー" },
      { status: 500 }
    );
  }
}
