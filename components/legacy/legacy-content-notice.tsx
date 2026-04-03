import Link from "next/link";
import { Section, Container } from "@/components/craft";
import { Button } from "@/components/ui/button";

type LegacyContentNoticeProps = {
  title: string;
  description: string;
};

export function LegacyContentNotice({ title, description }: LegacyContentNoticeProps) {
  return (
    <Section>
      <Container>
        <article className="mx-auto max-w-3xl rounded-3xl border bg-background p-8 text-center shadow-sm">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Archivovaný odkaz
          </p>
          <h1 className="mb-4 text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mx-auto mb-8 max-w-2xl text-base text-muted-foreground">
            {description}
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/clanky">Prejsť na články</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Domov</Link>
            </Button>
          </div>
        </article>
      </Container>
    </Section>
  );
}
