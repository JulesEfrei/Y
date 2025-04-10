"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginModal from "@/components/modal/LoginModal";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import { TOGGLE_LIKE } from "@/lib/queries";

interface LikeButtonProps {
  postId: string;
  likesCount: number;
  usersWhoLike: string[];
}

export default function LikeButton({
  postId,
  likesCount,
  usersWhoLike,
}: LikeButtonProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Check if the current user has liked the post
  const isLiked = user ? usersWhoLike.some((id) => id === user.id) : false;

  const [toggleLike, { loading: isToggling }] = useMutation(TOGGLE_LIKE, {
    onCompleted: (data) => {
      if (data.toggleLike.success) {
        router.refresh();
      } else {
        toast.error("Error", {
          description: data.toggleLike.message || "Failed to toggle like",
        });
      }
    },
    onError: (error) => {
      console.log(error);

      toast.error("Error", {
        description: error.message || "Failed to toggle like",
      });
    },
  });

  const handleLikeClick = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    toggleLike({
      variables: {
        postId,
      },
    });
  };

  // If user is not logged in, show empty button with just the count
  if (!user) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={handleLikeClick}
        >
          <Heart size={16} className="text-red-500" />
          <span>{likesCount} likes</span>
        </Button>

        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          returnUrl={pathname}
        />
      </>
    );
  }

  // For logged in users, show the button with the current like state
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="gap-1"
        onClick={handleLikeClick}
        disabled={isToggling}
      >
        <Heart
          size={16}
          className={isLiked ? "text-red-500 fill-red-500" : "text-red-500"}
        />
        <span>{likesCount} likes</span>
      </Button>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        returnUrl={pathname}
      />
    </>
  );
}
