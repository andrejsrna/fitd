import { getAllTags } from "@/lib/content";
import { Section, Container } from "@/components/craft";
import { Metadata } from "next";
import Link from "next/link";
import BackButton from "@/components/back";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Všetky značky",
    description: "",
  };
}

export default async function Page() {
  const tags = await getAllTags();

  return (
    <Section>
      <Container>
        <BackButton />
        <h2>Všetky značky</h2>
        <div className="grid">
          {tags.map((tag) => (
            <Link key={tag.slug} href={`/clanky/znacky/${tag.slug}`}>
              {tag.name}
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
