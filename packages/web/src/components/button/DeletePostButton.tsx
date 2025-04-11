"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_POST } from "@/lib/queries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeletePostButton({
  postId,
  authorId,
}: {
  postId: string;
  authorId: string;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [deletePost, { loading }] = useMutation(DELETE_POST, {
    onCompleted: (data) => {
      if (data.deletePost.success) {
        toast.success("Post deleted successfully");
        router.push("/my-posts"); // Redirect to my posts page after deletion
      } else {
        toast.error(data.deletePost.message || "Failed to delete post");
      }
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "An error occurred while deleting the post");
      setIsDeleteDialogOpen(false);
    },
  });

  const handleDelete = () => {
    deletePost({
      variables: {
        id: postId,
      },
    });
  };

  // Only show delete button if the current user is the author
  if (!user || user.id !== authorId) {
    return null;
  }

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="flex items-center gap-2"
        >
          <Trash2 size={16} />
          <span>Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Post</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
