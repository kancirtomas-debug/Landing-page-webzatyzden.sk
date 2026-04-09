"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [pin, setPin] = useState(["", "", "", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError("");

    // Auto-focus next input
    if (value && index < 7) {
      inputsRef.current[index + 1]?.focus();
    }

    // Auto-submit when all 8 digits entered
    if (value && index === 7 && newPin.every((d) => d !== "")) {
      submitPin(newPin.join(""));
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      const fullPin = pin.join("");
      if (fullPin.length === 8) {
        submitPin(fullPin);
      }
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8);
    if (pasted.length === 8) {
      const newPin = pasted.split("");
      setPin(newPin);
      submitPin(pasted);
    }
  }

  async function submitPin(fullPin: string) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: fullPin }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        setError("Nesprávny PIN");
        setPin(["", "", "", "", "", "", "", ""]);
        inputsRef.current[0]?.focus();
      }
    } catch {
      setError("Chyba pripojenia");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-2xl">🚀</span>
            <span className="text-xl font-bold text-white tracking-wide">
              WebZaTýždeň
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-zinc-400 text-sm">Zadajte 8-miestny PIN</p>
        </div>

        {/* PIN inputs */}
        <div className="flex justify-center gap-3 mb-6">
          {pin.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputsRef.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              disabled={loading}
              className="w-10 h-12 text-center text-xl font-bold text-white bg-zinc-800 border-2 border-zinc-700 rounded-xl focus:border-[#7B4BA8] focus:outline-none focus:ring-2 focus:ring-[#7B4BA8]/30 transition-all disabled:opacity-50"
              autoFocus={i === 0}
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        {/* Submit button */}
        <button
          onClick={() => submitPin(pin.join(""))}
          disabled={loading || pin.some((d) => d === "")}
          className="w-full py-3 px-4 bg-[#7B4BA8] hover:bg-[#6a3f94] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Overujem..." : "Prihlásiť sa"}
        </button>

        {/* Back link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
          >
            ← Späť na hlavnú stránku
          </a>
        </div>
      </div>
    </div>
  );
}
