import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const checks = {
    server: true,
    database: false,
    timestamp: new Date().toISOString(),
  };

  if (prisma) {
    try {
      await prisma.lead.count();
      checks.database = true;
    } catch {
      checks.database = false;
    }
  }

  const allOk = checks.server && checks.database;

  return NextResponse.json(checks, { status: allOk ? 200 : 503 });
}
