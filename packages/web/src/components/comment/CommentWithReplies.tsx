"use client";

import { useState } from "react";
import { format } from "date-fns";
import { User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CommentLikeButton from "@/components/button/CommentLikeButton";
import ReplyButton from "@/components/button/ReplyButton";
import CommentReplyForm from "@/components/form/CommentReplyForm";

interface CommentWithRepliesProps {
  comment: any; // Using any for simplicity, ideally would use a proper type
  postId: string;
}

export default function CommentWithReplies({
  comment,
  postId,
}: CommentWithRepliesProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-center">
            <div className="font-medium flex items-center gap-2">
              <User size={14} />
              {comment.author.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {format(new Date(parseInt(comment.createdAt)), "MMM dd, yyyy")}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-sm">{comment.content}</p>
          <div className="mt-2 flex justify-between">
            <ReplyButton onClick={() => setShowReplyForm(!showReplyForm)} />
            <CommentLikeButton
              commentId={comment.id}
              likesCount={comment.likesCount || 0}
              usersWhoLike={(comment.likes || []).map(
                (like: any) => like.user.id
              )}
            />
          </div>
          {showReplyForm && (
            <CommentReplyForm
              commentId={comment.id}
              onCancel={() => setShowReplyForm(false)}
              onSuccess={() => setShowReplyForm(false)}
            />
          )}
        </CardContent>
      </Card>

      {/* Display replies with indentation */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-6 border-l-2 border-gray-200 dark:border-gray-700 space-y-3">
          {comment.replies.map((reply: any) => (
            <Card key={reply.id}>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center">
                  <div className="font-medium flex items-center gap-2">
                    <User size={14} />
                    {reply.author.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {format(
                      new Date(parseInt(reply.createdAt)),
                      "MMM dd, yyyy"
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="text-sm">{reply.content}</p>
                <div className="mt-2 flex justify-end">
                  <CommentLikeButton
                    commentId={reply.id}
                    likesCount={reply.likesCount || 0}
                    usersWhoLike={(reply.likes || []).map(
                      (like: any) => like.user.id
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
