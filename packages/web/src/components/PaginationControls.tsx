"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  currentPage: number;
}

export default function PaginationControls({
  hasNextPage,
  hasPrevPage,
  currentPage,
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handlePrevPage = () => {
    if (hasPrevPage) {
      const searchParams = new URLSearchParams();
      if (currentPage > 2) {
        searchParams.set("page", (currentPage - 1).toString());
      }
      const query = searchParams.toString();
      router.push(`${pathname}${query ? `?${query}` : ""}`);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      const searchParams = new URLSearchParams();
      searchParams.set("page", (currentPage + 1).toString());
      router.push(`${pathname}?${searchParams.toString()}`);
    }
  };

  return (
    <div className="flex justify-center mt-10 gap-2">
      <Button 
        onClick={handlePrevPage} 
        disabled={!hasPrevPage}
        variant="outline"
      >
        Previous
      </Button>
      <span className="flex items-center px-4">
        Page {currentPage}
      </span>
      <Button 
        onClick={handleNextPage} 
        disabled={!hasNextPage}
        variant="outline"
      >
        Next
      </Button>
    </div>
  );
}