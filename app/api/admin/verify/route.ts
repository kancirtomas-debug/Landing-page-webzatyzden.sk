import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { pin } = await request.json();
    const adminPin = process.env.ADMIN_PIN ?? "1234";

    if (!pin || pin !== adminPin) {
      return NextResponse.json(
        { error: "Nesprávny PIN" },
        { status: 401 }
      );
    }

    // Create a simple session token
    const token = Buffer.from(`admin:${Date.now()}:${adminPin}`).toString(
      "base64"
    );

    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Chyba servera" },
      { status: 500 }
    );
  }
}
