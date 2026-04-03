import type { Metadata } from "next";
import { LegacyContentNotice } from "@/components/legacy/legacy-content-notice";

export const metadata: Metadata = {
  title: "Pôvodná značka už nie je dostupná | FitDoplnky",
  description:
    "Narazili ste na starý odkaz na značku z pôvodného WordPress webu. Web už funguje bez WordPressu.",
};

export default function LegacyBrandIndexPage() {
  return (
    <LegacyContentNotice
      title="Pôvodná značka už nie je dostupná"
      description="Tento odkaz smeroval na starú taxonómiu z WordPressu. Web sme presunuli na statickú verziu bez WordPressu, preto staré značkové URL nahrádzame fallback stránkou namiesto chyby."
    />
  );
}
