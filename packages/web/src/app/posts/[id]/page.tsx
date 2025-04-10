import { format } from "date-fns";
import { notFound } from "next/navigation";
import { User, MessageSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import CopyButton from "@/components/button/CopyButton";
import CommentForm from "@/components/form/CommentForm";
import LikeButton from "@/components/button/LikeButton";
import BackButton from "@/components/button/BackButton";
import createApolloClient from "../../../../apollo-client";
import { GET_POST } from "@/lib/queries";

import EditPostButton from "@/components/button/EditPostButton";
import DeletePostButton from "@/components/button/DeletePostButton";
import CommentWithReplies from "@/components/comment/CommentWithReplies";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const postId = (await params).id;

  const client = createApolloClient();
  const { data } = await client.query({
    query: GET_POST,
    variables: { postId },
  });

  if (!data?.post) {
    return notFound();
  }

  const { post } = data;

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <BackButton />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6 pb-2">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{post.title}</h1>

            <div className="flex gap-2">
              <EditPostButton postId={post.id} authorId={post.author.id} />
              <DeletePostButton postId={post.id} authorId={post.author.id} />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{post.author.name}</span>
              {post.category && (
                <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full dark:bg-indigo-900 dark:text-indigo-200">
                  {post.category.name}
                </span>
              )}
            </div>
            <div suppressHydrationWarning>
              {format(new Date(post.createdAt), "MMM dd, yyyy")}
            </div>
          </div>
        </div>

        <div className="p-6 pt-2 pb-4">
          <div className="relative bg-gray-50 dark:bg-gray-900 p-4 rounded-md mb-4">
            <CopyButton text={post.content} />
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <LikeButton
              postId={post.id}
              likesCount={post.likesCount}
              usersWhoLike={post.likes.map((like) => like.user.id)}
            />

            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <MessageSquare size={16} />
              <span>{post.comments?.length || 0} comments</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="p-6" id="comments-section">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MessageSquare size={18} />
            Comments
          </h2>

          <div className="mb-8">
            <CommentForm postId={post.id} />
          </div>

          <div className="space-y-4">
            {(post.comments?.length ?? 0) === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              post.comments
                ?.filter((comment) => !comment.parent)
                .map((comment) => (
                  <CommentWithReplies
                    key={comment.id}
                    comment={comment}
                    postId={post.id}
                  />
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
