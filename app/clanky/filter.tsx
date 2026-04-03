"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Ensure this is the correct import path
import { Button } from "@/components/ui/button";
import { TaxonomyEntry } from "@/lib/content";

interface FilterPostsProps {
  tags: TaxonomyEntry[];
  categories: TaxonomyEntry[];
  selectedTag?: string;
  selectedCategory?: string;
}

export default function FilterPosts({
  tags,
  categories,
  selectedTag,
  selectedCategory,
}: FilterPostsProps) {
  const router = useRouter();

  const handleFilterChange = (type: string, value: string) => {
    const newParams = new URLSearchParams(window.location.search);
    if (value === "all") {
      newParams.delete(type);
    } else {
      newParams.set(type, value);
    }
    router.push(`/clanky?${newParams.toString()}`);
  };

  const handleResetFilters = () => {
    router.push("/clanky");
  };

  return (
    <div className="grid md:grid-cols-[1fr_1fr_1fr_0.5fr] gap-2 my-4 !z-10">
      <Select
        value={selectedTag || "all"}
        onValueChange={(value) => handleFilterChange("tag", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Všetky značky" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Všetky značky</SelectItem>
          {tags.map((tag) => (
            <SelectItem key={tag.slug} value={tag.slug}>
              {tag.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedCategory || "all"}
        onValueChange={(value) => handleFilterChange("category", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Všetky kategórie" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Všetky kategórie</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.slug} value={category.slug}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={handleResetFilters}>
        Resetovať filter
      </Button>
    </div>
  );
}
