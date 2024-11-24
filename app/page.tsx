// Craft Imports
import { Section, Container } from "@/components/craft";
import Balancer from "react-wrap-balancer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <Section>
      <Container>
        <MainContent />
      </Container>
    </Section>
  );
}

const MainContent = () => {
  return (
    <article className="prose-m-none text-center">
      <h1 className="text-4xl font-bold mb-6">
        <Balancer>
          Výživové doplnky pre <b>prirodzené zdravie</b>
        </Balancer>
      </h1>
      <p className="text-lg mb-8 mx-auto">
        V našich produktoch sa spája sila prírody a moderná veda, aby ste mohli podporiť svoje zdravie bezpečne a efektívne.
      </p>

      <Button key="https://najsilnejsiaklbovavyziva.sk/" asChild variant="ghost" size="sm">
                <Link className="mt-8" href="https://najsilnejsiaklbovavyziva.sk/">
                Najsilnejšia kĺbová výživa
                </Link>
              </Button>
    </article>
  );
}