"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";

export function SearchIndicator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("search");

  if (!searchQuery) return null;

  const resetSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="w-full flex justify-center my-6">
      <div className="inline-flex items-center bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg text-sm">
        <span className="mr-3">
          Showing results for:{" "}
          <span className="font-medium">"{searchQuery}"</span>
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-800"
          onClick={resetSearch}
          title="Clear search"
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );
}
