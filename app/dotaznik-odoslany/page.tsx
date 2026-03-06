import { Rocket } from "lucide-react";

export default function DotaznikOdoslanyPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#EFE1F9] px-6">
      <div className="mx-auto max-w-4xl rounded-[3rem] bg-gradient-to-b from-[#EFE1F9] to-[#B285E1] px-8 py-20 text-center sm:px-16 sm:py-28">
        {/* Logo */}
        <div className="mb-16 flex items-center justify-center gap-2">
          <Rocket className="h-5 w-5 text-white" />
          <span className="text-lg font-bold text-white">WebZaTýždeň</span>
        </div>

        {/* Main Heading */}
        <h1 className="mb-6 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
          Hotovo! Ďakujeme a čoskoro Vás budeme kontaktovať ✅
        </h1>

        {/* Subtext */}
        <p className="mx-auto max-w-xl text-lg text-white/80">
          Tešíme sa na naše stretnutie a veríme, že vám pomôžeme dosiahnuť
          výsledky, po ktorých túžite.
        </p>
      </div>
    </main>
  );
}
