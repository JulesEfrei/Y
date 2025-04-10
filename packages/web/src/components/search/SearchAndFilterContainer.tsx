"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "./SearchBar";
import { CategoryFilter } from "../filters/CategoryFilter";

interface Category {
  id: string;
  name: string;
}

interface SearchAndFilterContainerProps {
  categories: Category[];
}

export function SearchAndFilterContainer({
  categories,
}: SearchAndFilterContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || null
  );

  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    if (searchParams.get("page")) params.set("page", searchParams.get("page")!);

    router.push(`/?${params.toString()}`);
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);

    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (categoryId) params.set("category", categoryId);
    if (searchParams.get("page")) params.set("page", searchParams.get("page")!);

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full" suppressHydrationWarning={true}>
      <SearchBar
        value={searchQuery}
        onChange={handleSearchInput}
        onSearch={handleSearch}
      />
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onChange={handleCategoryChange}
      />
    </div>
  );
}
