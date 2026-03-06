import { Rocket } from "lucide-react";
import Link from "next/link";

export default function GdprPage() {
  return (
    <main className="min-h-screen bg-bg-white">
      {/* Header */}
      <header className="border-b border-border-light px-6 py-6">
        <div className="mx-auto max-w-4xl">
          <Link href="/" className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-text-primary" />
            <span className="text-lg font-bold text-text-primary">
              WebZaTýždeň
            </span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <article className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="mb-12 text-4xl font-extrabold text-text-primary">
          Zásady ochrany osobných údajov
        </h1>

        <div className="space-y-8 text-base leading-relaxed text-text-secondary">
          <section>
            <h2 className="mb-3 text-xl font-bold text-text-primary">
              1. Úvod
            </h2>
            <p>
              Vaše súkromie je pre nás dôležité. Tieto zásady vysvetľujú, ako
              zhromažďujeme, používame a chránime vaše osobné údaje v súlade s
              Nariadením Európskeho parlamentu a Rady (EÚ) 2016/679 (GDPR) a
              zákonom č. 18/2018 Z. z. o ochrane osobných údajov.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-text-primary">
              2. Prevádzkovateľ osobných údajov
            </h2>
            <p>Prevádzkovateľom je:</p>
            <ul className="mt-2 list-none space-y-1">
              <li>
                <strong>TOMAR Group s.r.o.</strong>
              </li>
              <li>Adresa: Prešov, Slovensko</li>
              <li>IČO: 56449046</li>
              <li>
                E-mail:{" "}
                <a
                  href="mailto:info@webzatyzden.sk"
                  className="text-primary underline"
                >
                  info@webzatyzden.sk
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-text-primary">
              3. Aké údaje spracúvame?
            </h2>
            <p>
              Spracúvame tieto údaje, ktoré získavame cez formuláre na našej
              webstránke alebo prostredníctvom Facebook reklamy:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Meno a priezvisko</li>
              <li>E-mailová adresa</li>
              <li>Telefónne číslo</li>
              <li>Informácie o požadovanom termíne stretnutia</li>
              <li>IP adresa a cookies (viac nižšie)</li>
              <li>
                Údaje o správaní sa na stránke (cez analytické nástroje ako Meta
                Pixel alebo Google Analytics)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-text-primary">
              4. Na aký účel údaje používame?
            </h2>
            <p>Vaše údaje používame na nasledovné účely:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Spracovanie rezervácie stretnutia</li>
              <li>Odosielanie potvrdzujúcich a informačných emailov</li>
              <li>E-mail marketing (newslettery, špeciálne ponuky)</li>
              <li>
                Retargeting a personalizovaná reklama cez nástroje ako Facebook
                Pixel – na základe súhlasu so súbormi cookies
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-text-primary">
              5. Používanie cookies a retargeting
            </h2>
            <p>
              Na našej webstránke používame súbory cookies, vrátane tých, ktoré
              slúžia na analytické a marketingové účely (napr. Facebook Pixel).
              Pomáhajú nám:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Zlepšovať funkcionalitu stránky</li>
              <li>
                Zobrazovať relevantné reklamy na platformách ako
                Facebook/Instagram
              </li>
              <li>Analyzovať návštevnosť</li>
            </ul>
            <p className="mt-3">
              Používaním stránky a potvrdením cookies lišty vyjadrujete súhlas
              so spracovaním údajov na tieto účely. Svoj súhlas môžete
              kedykoľvek zmeniť alebo odvolať cez nastavenia prehliadača alebo
              kliknutím na &quot;Odmietnuť cookies&quot; v spodnej časti
              stránky.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-text-primary">
              6. Právny základ spracovania
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Zmluvný vzťah (napr. rezervácia stretnutia)</li>
              <li>Súhlas (napr. email marketing, cookies)</li>
              <li>
                Oprávnený záujem (napr. základná analytika pre chod stránky)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-text-primary">
              7. Ako dlho údaje uchovávame?
            </h2>
            <p>
              Vaše údaje uchovávame po dobu nevyhnutnú na splnenie účelu,
              maximálne však 7 rokov od posledného kontaktu alebo do odvolania
              súhlasu.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-text-primary">
              8. Vaše práva
            </h2>
            <p>Máte právo na:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Prístup k údajom</li>
              <li>Opravu nesprávnych údajov</li>
              <li>Vymazanie údajov (&quot;právo na zabudnutie&quot;)</li>
              <li>Obmedzenie spracovania</li>
              <li>Prenositeľnosť údajov</li>
              <li>Odvolanie súhlasu</li>
              <li>
                Podanie sťažnosti na Úrad na ochranu osobných údajov SR
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-text-primary">
              9. Kontakt
            </h2>
            <p>
              V prípade otázok alebo uplatnenia práv nás kontaktujte na:{" "}
              <a
                href="mailto:info@webzatyzden.sk"
                className="text-primary underline"
              >
                info@webzatyzden.sk
              </a>
            </p>
          </section>

          <section className="border-t border-border-light pt-8">
            <p className="text-sm text-text-muted">
              Tieto Podmienky ochrany osobných údajov vrátane ich súčastí sú
              platné a účinné od 5.3.2026 a sú dostupné v elektronickej forme
              na tejto stránke.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
