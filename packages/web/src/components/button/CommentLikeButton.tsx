"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TOGGLE_COMMENT_LIKE } from "@/lib/queries";
import LoginModal from "@/components/modal/LoginModal";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";

interface CommentLikeButtonProps {
  commentId: string;
  likesCount: number;
  usersWhoLike: string[];
}

export default function CommentLikeButton({
  commentId,
  likesCount,
  usersWhoLike,
}: CommentLikeButtonProps) {
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isLiked = user ? usersWhoLike.some((id) => id === user.id) : false;

  const [toggleLike] = useMutation(TOGGLE_COMMENT_LIKE, {
    onCompleted: (data) => {
      if (data.toggleCommentLike.success) {
        router.refresh();
      } else {
        toast.error("Error", {
          description: data.toggleCommentLike.message,
        });
      }
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message,
      });
    },
  });

  const handleLike = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    toggleLike({
      variables: {
        commentId,
      },
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 text-sm"
        onClick={handleLike}
      >
        <Heart
          size={16}
          className={isLiked ? "fill-red-500 text-red-500" : ""}
        />
        <span>{likesCount}</span>
      </Button>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        returnUrl={pathname}
      />
    </>
  );
}
