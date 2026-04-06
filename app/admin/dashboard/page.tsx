import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

interface LeadRow {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  sourcePage: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  fbclid: string | null;
}

interface Stats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

async function getStats(): Promise<Stats> {
  if (!prisma) return { total: 0, today: 0, thisWeek: 0, thisMonth: 0 };

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Monday
  if (startOfWeek > now) startOfWeek.setDate(startOfWeek.getDate() - 7);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [total, today, thisWeek, thisMonth] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.lead.count({ where: { createdAt: { gte: startOfWeek } } }),
    prisma.lead.count({ where: { createdAt: { gte: startOfMonth } } }),
  ]);

  return { total, today, thisWeek, thisMonth };
}

async function getLeads(): Promise<LeadRow[]> {
  if (!prisma) return [];

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  return leads.map((lead) => ({
    ...lead,
    createdAt: lead.createdAt.toISOString(),
  }));
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session?.value) {
    redirect("/admin");
  }

  let stats: Stats = { total: 0, today: 0, thisWeek: 0, thisMonth: 0 };
  let leads: LeadRow[] = [];

  try {
    [stats, leads] = await Promise.all([getStats(), getLeads()]);
  } catch (error) {
    console.error("Dashboard data fetch failed:", error);
  }

  return <DashboardClient stats={stats} initialLeads={leads} />;
}
