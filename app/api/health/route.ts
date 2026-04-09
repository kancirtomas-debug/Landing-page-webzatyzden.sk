import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const checks = {
    server: true,
    database: false,
    timestamp: new Date().toISOString(),
  };

  let dbError: string | null = null;

  if (prisma) {
    try {
      await prisma.lead.count();
      checks.database = true;
    } catch (err) {
      checks.database = false;
      dbError = err instanceof Error ? err.message : String(err);
    }
  }

  const allOk = checks.server && checks.database;

  return NextResponse.json({ ...checks, dbError }, { status: allOk ? 200 : 503 });
}
