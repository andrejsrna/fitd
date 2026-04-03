import { getPagesSummary } from "@/lib/content";
import { Section, Container } from "@/components/craft";
import Link from "next/link";

export default async function Page() {
  const pages = await getPagesSummary();

  return (
    <Section>
      <Container>
        <h1>Stránky</h1>

        <h2>Všetky stránky</h2>
        <div className="grid">
          {pages.map((page) => (
            <Link key={page.slug} href={`/stranky/${page.slug}`}>
              {page.title}
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
