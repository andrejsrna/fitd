import type { Metadata } from "next";
import { LegacyShopNotice } from "@/components/legacy/legacy-shop-notice";

export const metadata: Metadata = {
  title: "Pôvodný obchod už nie je dostupný | FitDoplnky",
  description:
    "Narazili ste na starý produktový odkaz z pôvodného WordPress obchodu. Obsah webu je presunutý na novú statickú verziu FitDoplnky.",
};

export default function LegacyShopPage() {
  return (
    <LegacyShopNotice
      title="Pôvodný produktový odkaz už nie je dostupný"
      description="Táto URL smerovala do starého WordPress / WooCommerce riešenia, ktoré sme vyradili. Obsah webu sme presunuli na novú statickú verziu, kde nájdete články a kontaktné informácie bez závislosti na WordPresse."
    />
  );
}
