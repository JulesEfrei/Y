"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/modal/LoginModal";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import { REPLY_TO_COMMENT } from "@/lib/queries";

interface CommentReplyFormProps {
  commentId: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

export default function CommentReplyForm({
  commentId,
  onCancel,
  onSuccess,
}: CommentReplyFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const pathname = usePathname();

  const [replyToCommentMutation, { loading }] = useMutation(REPLY_TO_COMMENT, {
    onCompleted: (data) => {
      setIsSubmitting(false);
      if (data.replyToComment.success) {
        setContent("");
        toast("Reply added", {
          description: "Your reply has been posted successfully.",
        });
        router.refresh();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error("Error", {
          description: data.replyToComment.message || "Failed to post reply",
        });
      }
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast.error("Error", {
        description: error.message || "Failed to post reply",
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
    replyToCommentMutation({
      variables: {
        commentId,
        content: content.trim(),
      },
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-3 mt-2">
        <Textarea
          placeholder="Write a reply..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[80px]"
          disabled={isSubmitting}
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? "Posting..." : "Reply"}
          </Button>
        </div>
      </form>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        returnUrl={pathname}
      />
    </>
  );
}
