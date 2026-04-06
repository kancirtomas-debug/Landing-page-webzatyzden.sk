"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Lead {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  note: string | null;
  sourcePage: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  fbclid: string | null;
}

const STATUSES = [
  { value: "new", label: "Nový", color: "bg-blue-500" },
  { value: "contacted", label: "Kontaktovaný", color: "bg-yellow-500" },
  { value: "meeting", label: "Stretnutie", color: "bg-purple-500" },
  { value: "proposal", label: "Ponuka odoslaná", color: "bg-orange-500" },
  { value: "won", label: "Vyhraný", color: "bg-emerald-500" },
  { value: "lost", label: "Stratený", color: "bg-red-500" },
];

function getStatus(value: string) {
  return STATUSES.find((s) => s.value === value) ?? STATUSES[0];
}

function StatusDropdown({
  lead,
  onStatusChange,
  onNoteChange,
}: {
  lead: Lead;
  onStatusChange: (id: string, status: string) => void;
  onNoteChange: (id: string, note: string) => void;
}) {
  const current = getStatus(lead.status);
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(lead.note ?? "");
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditingNote(false); }}>
      <DropdownMenuTrigger asChild>
        <button className="w-full inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer outline-none">
          <span className={`w-2 h-2 rounded-full ${current.color}`} />
          {current.label}
          <svg className="w-3 h-3 text-zinc-500 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {!editingNote ? (
          <>
            <DropdownMenuLabel>Zmeniť stav</DropdownMenuLabel>
            {STATUSES.map((s) => (
              <DropdownMenuItem
                key={s.value}
                onClick={() => { onStatusChange(lead.id, s.value); setOpen(false); }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <span className={`w-2 h-2 rounded-full ${s.color}`} />
                <span className={lead.status === s.value ? "text-white font-medium" : ""}>{s.label}</span>
                {lead.status === s.value && (
                  <svg className="w-3.5 h-3.5 ml-auto text-[#B285E1]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => { e.preventDefault(); setEditingNote(true); }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {lead.note ? "Upraviť poznámku" : "Pridať poznámku"}
            </DropdownMenuItem>
          </>
        ) : (
          <div className="p-2" onClick={(e) => e.stopPropagation()}>
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-1">
              Poznámka
            </p>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Napr. Zavolať v pondelok..."
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#7B4BA8] resize-none"
              autoFocus
              onKeyDown={(e) => e.stopPropagation()}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => { onNoteChange(lead.id, noteText); setEditingNote(false); setOpen(false); }}
                className="flex-1 py-1.5 bg-[#7B4BA8] hover:bg-[#6a3f94] text-white text-xs font-medium rounded-lg transition-colors"
              >
                Uložiť
              </button>
              <button
                onClick={() => setEditingNote(false)}
                className="flex-1 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs font-medium rounded-lg transition-colors"
              >
                Zrušiť
              </button>
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NoteCell({
  lead,
  onNoteChange,
}: {
  lead: Lead;
  onNoteChange: (id: string, note: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(lead.note ?? "");

  function handleSave() {
    onNoteChange(lead.id, text);
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setText(lead.note ?? "");
      setEditing(false);
    }
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-1.5">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          placeholder="Napíšte poznámku..."
          rows={3}
          autoFocus
          className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#7B4BA8] resize-none"
        />
        <p className="text-[10px] text-zinc-600">Enter = uložiť · Esc = zrušiť</p>
      </div>
    );
  }

  return (
    <button
      onClick={() => { setText(lead.note ?? ""); setEditing(true); }}
      className="w-full text-left cursor-pointer group"
    >
      {lead.note ? (
        <p className="text-sm text-zinc-300 whitespace-pre-wrap break-words leading-relaxed group-hover:text-white transition-colors">
          {lead.note}
        </p>
      ) : (
        <span className="text-zinc-600 text-sm group-hover:text-zinc-400 transition-colors">
          + Pridať poznámku
        </span>
      )}
    </button>
  );
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

  async function handleStatusChange(id: string, status: string) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function handleNoteChange(id: string, note: string) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, note } : l)));
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });
  }

  const filteredLeads = useMemo(() => {
    if (!search.trim()) return leads;
    const q = search.toLowerCase().trim();
    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        getStatus(lead.status).label.toLowerCase().includes(q)
    );
  }, [search, leads]);

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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((card) => (
                <div key={card.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-3 h-3 rounded-full ${card.color}`} />
                    <span className="text-zinc-400 text-sm font-medium">{card.label}</span>
                  </div>
                  <p className="text-3xl font-bold">{card.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Hladat podla mena, emailu, telefonu alebo stavu..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#7B4BA8] focus:ring-1 focus:ring-[#7B4BA8]/30 transition-colors"
                />
              </div>
              <a
                href="/api/admin/export"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#7B4BA8] hover:bg-[#6a3f94] text-white font-medium rounded-lg transition-colors shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </a>
            </div>

            <p className="text-zinc-500 text-sm mb-3">
              {filteredLeads.length} {filteredLeads.length === 1 ? "lead" : "leadov"}
              {search && ` pre "${search}"`}
            </p>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400">
                      <th className="text-left px-4 py-3 font-medium">Datum</th>
                      <th className="text-left px-4 py-3 font-medium">Meno</th>
                      <th className="text-left px-4 py-3 font-medium">Email</th>
                      <th className="text-left px-4 py-3 font-medium">Telefon</th>
                      <th className="text-left px-4 py-3 font-medium">Stav</th>
                      <th className="text-left px-4 py-3 font-medium">Poznamka</th>
                      <th className="text-left px-4 py-3 font-medium">UTM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-zinc-500">
                          {search ? "Ziadne vysledky pre tento filter" : "Zatial ziadne leady"}
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr key={lead.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                          <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{formatDate(lead.createdAt)}</td>
                          <td className="px-4 py-3 font-medium whitespace-nowrap">{lead.name}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <a href={`mailto:${lead.email}`} className="text-[#B285E1] hover:text-[#c9a5f0] transition-colors">{lead.email}</a>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <a href={`tel:${lead.phone}`} className="text-[#B285E1] hover:text-[#c9a5f0] transition-colors">{lead.phone}</a>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap min-w-[180px]">
                            <StatusDropdown
                              lead={lead}
                              onStatusChange={handleStatusChange}
                              onNoteChange={handleNoteChange}
                            />
                          </td>
                          <td className="px-4 py-3 min-w-[250px] max-w-[350px]">
                            <NoteCell
                              lead={lead}
                              onNoteChange={handleNoteChange}
                            />
                          </td>
                          <td className="px-4 py-3 text-zinc-500 whitespace-nowrap text-xs">
                            {lead.utmSource || "-"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-zinc-600 text-xs mt-6 text-center">WebZaTyždeň Admin Dashboard</p>
          </>
        )}
      </main>
    </div>
  );
}
