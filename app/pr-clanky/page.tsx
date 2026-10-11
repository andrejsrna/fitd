import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Publikovanie PR článkov a reklamná spolupráca | FitDoplnky",
  description: "Predstavte svoju značku čitateľom FitDoplnky.sk. PR články o výžive, fitness a doplnkoch stravy s transparentnými podmienkami spolupráce.",
  alternates: { canonical: "https://fitdoplnky.sk/pr-clanky" },
};

export default function PRClankyPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <header className="max-w-3xl border-l-4 border-primary pl-6">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">Spolupráca s FitDoplnky.sk</p>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Publikovanie PR článkov a reklamná spolupráca</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">Dajte svojej značke priestor v obsahu o výžive, pohybe a doplnkoch stravy. Hľadáme spolupráce, ktoré čitateľom prinášajú užitočné informácie, nie iba reklamný slogan.</p>
        <a href="mailto:info@fitdoplnky.sk?subject=Z%C3%A1ujem%20o%20PR%20%C4%8Dl%C3%A1nok" className="mt-8 inline-flex rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Mám záujem o publikovanie článku</a>
      </header>
      <div className="mt-16 grid gap-10 md:grid-cols-2">
        <section><h2 className="text-2xl font-semibold">Priestor pre relevantné značky</h2><p className="mt-4 leading-relaxed text-muted-foreground">Výživové doplnky, športová výživa, fitness vybavenie, zdravý životný štýl a služby spojené s pohybom. Každý návrh posudzujeme podľa toho, ako zapadá do zamerania portálu.</p></section>
        <section><h2 className="text-2xl font-semibold">Čo môžeme pripraviť</h2><p className="mt-4 leading-relaxed text-muted-foreground">Publikovanie dodaného PR článku po kontrole alebo prípravu textu podľa dohodnutého zadania. Rozsah, odkazy, podklady, cenu aj termín si potvrdíme vopred podľa konkrétnej spolupráce.</p></section>
      </div>
      <section className="mt-14 rounded-xl border bg-muted/40 p-6 md:p-10"><h2 className="text-2xl font-semibold">Ako prebieha publikovanie</h2><ol className="mt-5 list-decimal space-y-4 pl-5 leading-relaxed"><li>Pošlite značku, tému, cieľovú URL a informáciu, či máte hotový text.</li><li>Posúdime vhodnosť témy a dohodneme podmienky vrátane rozsahu a ceny.</li><li>Po kontrole obsahu a schválení podkladov dohodneme publikovanie.</li></ol></section>
      <section className="mt-14 max-w-3xl"><h2 className="text-2xl font-semibold">Transparentná reklama, dôveryhodný obsah</h2><p className="mt-4 leading-relaxed text-muted-foreground">Platené články označujeme ako reklamu alebo sponzorovaný obsah. Platené externé odkazy označujeme atribútom rel=&quot;sponsored&quot;. Neponúkame predaj odkazov na manipuláciu pozícií a negarantujeme výsledky vo vyhľadávaní.</p><p className="mt-4 leading-relaxed text-muted-foreground">Neprijímame zavádzajúce zdravotné tvrdenia, sľuby vyliečenia doplnkom ani obsah, ktorý nahrádza odbornú zdravotnú starostlivosť. Vyhradzujeme si právo nevhodnú tému odmietnuť.</p></section>
      <section className="mt-14 border-t pt-8"><h2 className="text-2xl font-semibold">Pošlite nám svoj návrh</h2><p className="mt-4">Napíšte na <a className="underline underline-offset-4" href="mailto:info@fitdoplnky.sk">info@fitdoplnky.sk</a>. Pomôže nám téma, odkaz na značku, požadovaný rozsah a termín.</p><Link href="/stranky/kontakt" className="mt-4 inline-block underline underline-offset-4">Ďalšie kontaktné údaje</Link></section>
    </main>
  );
}
