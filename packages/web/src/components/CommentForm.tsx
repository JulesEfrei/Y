"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "./LoginModal";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import { COMMENT_POST } from "@/lib/queries";

export default function CommentForm({ postId }: { postId: string }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const pathname = usePathname();

  // Replace the useMutation with useCreateCommentMutation
  const [createCommentMutation, { loading }] = useMutation(COMMENT_POST, {
    onCompleted: (data) => {
      setIsSubmitting(false);
      if (data.createComment.success) {
        setContent("");
        toast("Comment added", {
          description: "Your comment has been posted successfully.",
        });
        router.refresh();
      } else {
        toast.error("Error", {
          description: data.createComment.message || "Failed to post comment",
        });
      }
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast.error("Error", {
        description: error.message || "Failed to post comment",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    // Check if user is logged in
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setIsSubmitting(true);
    createCommentMutation({
      variables: {
        postId,
        content: content.trim(),
      },
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px]"
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        returnUrl={pathname}
      />
    </>
  );
}
