import type { Metadata } from "next";
import { LegacyContentNotice } from "@/components/legacy/legacy-content-notice";

export const metadata: Metadata = {
  title: "Pôvodný autor už nie je dostupný | FitDoplnky",
  description:
    "Narazili ste na starý autor URL z pôvodného WordPress webu. Web už funguje bez WordPressu.",
};

export default function LegacyAuthorPage() {
  return (
    <LegacyContentNotice
      title="Pôvodný autor už nie je dostupný"
      description="Tento odkaz patril do starého WordPress archívu autora. Po migrácii na statický web sme tieto legacy URL nahradili fallback stránkou."
    />
  );
}
