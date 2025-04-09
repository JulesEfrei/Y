"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-1 mb-4"
      onClick={() => router.back()}
    >
      <ChevronLeft size={16} />
      <span>Go back</span>
    </Button>
  );
}