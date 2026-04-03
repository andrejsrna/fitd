import type { Metadata } from "next";
import { LegacyContentNotice } from "@/components/legacy/legacy-content-notice";

export const metadata: Metadata = {
  title: "Pôvodný tag už nie je dostupný | FitDoplnky",
  description:
    "Narazili ste na starý tag z pôvodného WordPress webu. Web už funguje bez WordPressu.",
};

export default function LegacyTagIndexPage() {
  return (
    <LegacyContentNotice
      title="Pôvodný tag už nie je dostupný"
      description="Tento odkaz smeroval na starú WordPress taxonómiu. Po migrácii na statický web sme staré tag URL nahradili fallback stránkou, aby neskončili na chybe."
    />
  );
}
