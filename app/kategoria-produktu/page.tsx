import type { Metadata } from "next";
import { LegacyShopNotice } from "@/components/legacy/legacy-shop-notice";

export const metadata: Metadata = {
  title: "Pôvodná kategória už nie je dostupná | FitDoplnky",
  description:
    "Narazili ste na starý odkaz na kategóriu produktu z pôvodného WordPress obchodu. Web už funguje bez WordPressu.",
};

export default function LegacyCategoryIndexPage() {
  return (
    <LegacyShopNotice
      title="Pôvodná produktová kategória už nie je dostupná"
      description="Táto URL patrila do pôvodného WordPress / WooCommerce obchodu. WordPress časť webu sme vyradili, preto sme staré kategórie nahradili informačnou fallback stránkou, aby staré odkazy nekončili na chybe."
    />
  );
}
