import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode("next-market-route-handlers");

export default async function middleware(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { message: "トークンがありません。ログインしてください。" },
      { status: 401 }
    );
  }

  try {
    const decoded = await jwtVerify(token, SECRET_KEY);
    return NextResponse.next();
  } catch (error) {
    console.error("JWT検証エラー:", error);
    return NextResponse.json(
      { message: "トークンが正しくないので、ログインしてください。" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: [
    "/api/item/create",
    "/api/item/update/:path*",
    "/api/item/delete/:path*",
  ],
};
