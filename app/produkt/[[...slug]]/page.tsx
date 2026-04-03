import type { Metadata } from "next";
import { LegacyShopNotice } from "@/components/legacy/legacy-shop-notice";

export const metadata: Metadata = {
  title: "Pôvodný produkt už nie je dostupný | FitDoplnky",
  description:
    "Narazili ste na starý produktový odkaz z pôvodného WordPress / WooCommerce riešenia. Web už funguje bez WordPressu.",
};

export default function LegacyProductPage() {
  return (
    <LegacyShopNotice
      title="Pôvodný produktový odkaz už nie je dostupný"
      description="Tento odkaz smeroval na starý produkt z WordPress / WooCommerce riešenia, ktoré sme vyradili. Namiesto chyby zobrazujeme fallback stránku a navigáciu na nový statický web."
    />
  );
}
