"use client";

import { Reply } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReplyButtonProps {
  onClick: () => void;
}

export default function ReplyButton({ onClick }: ReplyButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1"
      onClick={onClick}
    >
      <Reply size={14} />
      <span>Reply</span>
    </Button>
  );
}
