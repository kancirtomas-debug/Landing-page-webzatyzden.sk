"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

interface Lead {
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

export default function DashboardClient() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((res) => res.json())
      .then((data) => {
        setLeads(data.leads ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredLeads = useMemo(() => {
    if (!search.trim()) return leads;
    const q = search.toLowerCase().trim();
    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q)
    );
  }, [search, leads]);

  // Compute stats from leads
  const stats = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
    if (startOfWeek > now) startOfWeek.setDate(startOfWeek.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      total: leads.length,
      today: leads.filter((l) => new Date(l.createdAt) >= startOfDay).length,
      thisWeek: leads.filter((l) => new Date(l.createdAt) >= startOfWeek).length,
      thisMonth: leads.filter((l) => new Date(l.createdAt) >= startOfMonth).length,
    };
  }, [leads]);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("sk-SK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const statCards = [
    { label: "Celkom", value: stats.total, color: "bg-[#7B4BA8]" },
    { label: "Dnes", value: stats.today, color: "bg-emerald-600" },
    { label: "Tento tyden", value: stats.thisWeek, color: "bg-blue-600" },
    { label: "Tento mesiac", value: stats.thisMonth, color: "bg-amber-600" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🚀</span>
            <h1 className="text-lg font-bold tracking-wide">
              WebZaTyždeň <span className="text-zinc-500 font-normal">/ Admin</span>
            </h1>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors disabled:opacity-50"
          >
            {loggingOut ? "Odhlasovanie..." : "Odhlasiť sa"}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-zinc-500">Nacitavam data...</div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-3 h-3 rounded-full ${card.color}`} />
                    <span className="text-zinc-400 text-sm font-medium">
                      {card.label}
                    </span>
                  </div>
                  <p className="text-3xl font-bold">{card.value}</p>
                </div>
              ))}
            </div>

            {/* Toolbar: Search + Export */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Hladat podla mena, emailu alebo telefonu..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#7B4BA8] focus:ring-1 focus:ring-[#7B4BA8]/30 transition-colors"
                />
              </div>
              <a
                href="/api/admin/export"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#7B4BA8] hover:bg-[#6a3f94] text-white font-medium rounded-lg transition-colors shrink-0"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export CSV
              </a>
            </div>

            {/* Results count */}
            <p className="text-zinc-500 text-sm mb-3">
              {filteredLeads.length}{" "}
              {filteredLeads.length === 1 ? "lead" : "leadov"}
              {search && ` pre "${search}"`}
            </p>

            {/* Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400">
                      <th className="text-left px-4 py-3 font-medium">Datum</th>
                      <th className="text-left px-4 py-3 font-medium">Meno</th>
                      <th className="text-left px-4 py-3 font-medium">Email</th>
                      <th className="text-left px-4 py-3 font-medium">Telefon</th>
                      <th className="text-left px-4 py-3 font-medium">UTM Source</th>
                      <th className="text-left px-4 py-3 font-medium">UTM Campaign</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-12 text-center text-zinc-500"
                        >
                          {search
                            ? "Ziadne vysledky pre tento filter"
                            : "Zatial ziadne leady"}
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr
                          key={lead.id}
                          className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                        >
                          <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">
                            {formatDate(lead.createdAt)}
                          </td>
                          <td className="px-4 py-3 font-medium whitespace-nowrap">
                            {lead.name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-[#B285E1] hover:text-[#c9a5f0] transition-colors"
                            >
                              {lead.email}
                            </a>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <a
                              href={`tel:${lead.phone}`}
                              className="text-[#B285E1] hover:text-[#c9a5f0] transition-colors"
                            >
                              {lead.phone}
                            </a>
                          </td>
                          <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">
                            {lead.utmSource || (
                              <span className="text-zinc-600">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">
                            {lead.utmCampaign || (
                              <span className="text-zinc-600">-</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer info */}
            <p className="text-zinc-600 text-xs mt-6 text-center">
              WebZaTyždeň Admin Dashboard
            </p>
          </>
        )}
      </main>
    </div>
  );
}
