import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!prisma) return NextResponse.json({ ok: true });

  try {
    const { email, name, step } = await request.json();
    if (!email || !step) return NextResponse.json({ ok: true });

    if (step === 1) {
      await prisma.$executeRaw`
        INSERT INTO "step 1" (email, name, phone)
        VALUES (${email}, ${""}, ${""})
      `;
    } else if (step === 2 && name) {
      await prisma.$executeRaw`
        INSERT INTO "step 2" (email, name, phone)
        VALUES (${email}, ${name}, ${""})
      `;
    }
  } catch (err) {
    console.error("Partial lead save failed:", err);
  }

  return NextResponse.json({ ok: true });
}
