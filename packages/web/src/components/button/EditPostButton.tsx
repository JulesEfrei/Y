"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";

export default function EditPostButton({
  postId,
  authorId,
}: {
  postId: string;
  authorId: string;
}) {
  const { user } = useAuth();

  // Only show edit button if the current user is the author
  if (!user || user.id !== authorId) {
    return null;
  }

  return (
    <Button variant="outline" size="sm" asChild>
      <Link href={`/posts/${postId}/edit`} className="flex items-center gap-2">
        <Edit size={16} />
        <span>Edit</span>
      </Link>
    </Button>
  );
}
