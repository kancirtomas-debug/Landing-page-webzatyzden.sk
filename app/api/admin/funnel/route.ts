import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return !!session?.value;
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!prisma) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const [step1, step2, step3] = await Promise.all([
      prisma.$queryRaw`SELECT id::text, created_at, email, name, phone FROM "step 1" ORDER BY created_at DESC`,
      prisma.$queryRaw`SELECT id::text, created_at, email, name, phone FROM "step 2" ORDER BY created_at DESC`,
      prisma.$queryRaw`SELECT id::text, created_at, email, name, phone FROM "step 3" ORDER BY created_at DESC`,
    ]);

    return NextResponse.json({ step1, step2, step3 });
  } catch (error) {
    console.error("Failed to fetch funnel data:", error);
    return NextResponse.json({ error: "Failed to fetch funnel data" }, { status: 500 });
  }
}
