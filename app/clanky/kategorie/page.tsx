import { getAllCategories } from "@/lib/content";
import { Section, Container } from "@/components/craft";
import { Metadata } from "next";
import Link from "next/link";
import BackButton from "@/components/back";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Všetky kategórie",
    description: "",
  };
}

export default async function Page() {
  const categories = await getAllCategories();

  return (
    <Section>
      <Container>
        <BackButton />
        <h2>Všetky kategórie</h2>
        <div className="grid">
          {categories.map((category) => (
            <Link key={category.slug} href={`/clanky/?category=${category.slug}`}>
              {category.name}
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
