import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "auth-token";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);

    return NextResponse.json({ token: token?.value || null });
  } catch {
    return NextResponse.json({ token: null }, { status: 500 });
  }
}
