import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Leaf,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import Balancer from "react-wrap-balancer";

import { Container, Section } from "@/components/craft";
import { Button } from "@/components/ui/button";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ProductImage from "@/public/product.jpg";

const capsuleUrl =
  "https://najsilnejsiaklbovavyziva.sk/produkt/najsilnejsia-klbova-vyziva";
const gelUrl =
  "https://najsilnejsiaklbovavyziva.sk/produkt/protizapalova-mast-na-klby-gel-joint-boost-gel-100-ml";

const products = [
  {
    name: "Najsilnejšia kĺbová výživa",
    format: "Kapsule",
    target: "kĺbová výživa kapsule",
    href: capsuleUrl,
    description:
      "Výživový doplnok pre ľudí, ktorí hľadajú praktické kapsule na podporu kĺbov, chrupaviek a pohodlného pohybu pri bežnej dennej záťaži.",
    points: [
      "praktické dávkovanie v kapsulách",
      "zamerané na kĺby, chrupavky a pohyb",
      "vhodné ako dlhodobejšia podpora aktívneho režimu",
    ],
    accent: "bg-emerald-50 text-emerald-950 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-50 dark:ring-emerald-800",
  },
  {
    name: "Joint Boost gél 100 ml",
    format: "Gél na kĺby",
    target: "protizápalová masť na kĺby",
    href: gelUrl,
    description:
      "Lokálny gél na kĺby pre miesta, kde chcete cielene riešiť nepríjemný pocit, stuhnutosť alebo preťaženie po pohybe.",
    points: [
      "lokálna aplikácia priamo na namáhané miesto",
      "dobrý doplnok ku kapsulovej kĺbovej výžive",
      "praktické balenie na doma aj do tašky",
    ],
    accent: "bg-amber-50 text-amber-950 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-50 dark:ring-amber-800",
  },
];

export const metadata: Metadata = {
  title: "Kĺbová výživa kapsule a gél na kĺby | Produkty FitDoplnky",
  description:
    "Vyberte si kĺbovú výživu v kapsulách alebo lokálny gél na kĺby. Prehľad produktov s popisom, použitím a odkazom na dostupné balenia.",
  alternates: {
    canonical: "/produkty",
  },
  openGraph: {
    title: "Kĺbová výživa kapsule a gél na kĺby",
    description:
      "Produktový prehľad pre kľúčové slová kĺbová výživa kapsule, výživa na kĺby a protizápalová masť na kĺby.",
    url: "/produkty",
    type: "website",
  },
};

export default function ProduktyPage() {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Produkty na podporu kĺbov",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.description,
        category: product.target,
        brand: {
          "@type": "Brand",
          name: "Najsilnejšia kĺbová výživa",
        },
        url: product.href,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Section className="pb-4 md:pb-8">
        <Container className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div className="not-prose">
            <span
              className={cn(
                badgeVariants({ variant: "outline" }),
                "mb-5 rounded-md px-3 py-1 text-sm",
              )}
            >
              Produkty na kĺby
            </span>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal md:text-6xl">
              <Balancer>Kĺbová výživa v kapsulách a gél na kĺby</Balancer>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Prehľad doplnkov pre ľudí, ktorí hľadajú výrazy ako kĺbová
              výživa kapsule, výživa na kĺby, prípravok na chrupavky alebo
              protizápalová masť na kĺby.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={capsuleUrl}>
                  Kĺbová výživa kapsule
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={gelUrl}>
                  Gél na kĺby
                  <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="not-prose overflow-hidden rounded-lg border bg-muted/25">
            <Image
              src={ProductImage}
              alt="Prírodné výživové doplnky na podporu zdravia"
              className="aspect-[4/3] h-full w-full object-cover"
              priority
            />
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container className="not-prose">
          <div className="grid gap-5 md:grid-cols-2">
            {products.map((product) => (
              <article
                key={product.href}
                className="flex h-full flex-col rounded-lg border bg-card p-6 shadow-sm"
              >
                <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row">
                  <div>
                    <p className="text-sm font-medium uppercase text-muted-foreground">
                      {product.format}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold leading-tight">
                      {product.name}
                    </h2>
                  </div>
                  <span
                    className={cn(
                      "rounded-md px-3 py-1 text-sm font-medium ring-1 sm:shrink-0",
                      product.accent,
                    )}
                  >
                    {product.target}
                  </span>
                </div>
                <p className="text-base leading-7 text-muted-foreground">
                  {product.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {product.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-6">
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-7 w-full sm:w-fit">
                  <Link href={product.href}>
                    Pozrieť produkt
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container className="not-prose">
          <div className="grid gap-5 rounded-lg border bg-muted/20 p-6 md:grid-cols-3">
            <div className="flex gap-4">
              <PackageCheck className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-semibold">Kapsule na každý deň</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Vhodné pri hľadaní praktickej výživy na kĺby bez miešania prášku.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <ShieldCheck className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-semibold">Cielená lokálna podpora</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Gél sa hodí na kolená, ramená, lakte alebo iné namáhané miesta.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Leaf className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-semibold">Doplnok k pohybu</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Najlepšie funguje ako súčasť režimu so spánkom, pohybom a regeneráciou.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
