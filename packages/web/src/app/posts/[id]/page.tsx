import { format } from "date-fns";
import { notFound } from "next/navigation";
import { User, MessageSquare, Edit } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";
import CommentForm from "@/components/CommentForm";
import LikeButton from "@/components/LikeButton";
import BackButton from "@/components/BackButton";
import { useAuth } from "@/context/AuthContext";
import createApolloClient from "../../../../apollo-client";
import { GET_POST } from "@/lib/queries";

// Add this client component to handle the edit button
import EditPostButton from "@/components/EditPostButton";

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
      {/* Back button */}
      <BackButton />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Post Header */}
        <div className="p-6 pb-2">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{post.title}</h1>

            {/* Edit button (client component) */}
            <EditPostButton postId={post.id} authorId={post.author.id} />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{post.author.name}</span>
            </div>
            <div>
              {format(new Date(parseInt(post.createdAt)), "MMM dd, yyyy")}
            </div>
          </div>
        </div>

        {/* Post Content */}
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

            {/* Comment count as simple text */}
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <MessageSquare size={16} />
              <span>{post.comments?.length || 0} comments</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Comments Section */}
        <div className="p-6" id="comments-section">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MessageSquare size={18} />
            Comments
          </h2>

          {/* Comment Form */}
          <div className="mb-8">
            <CommentForm postId={post.id} />
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {(post.comments?.length ?? 0) === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              post.comments?.map((comment) => (
                <Card key={comment.id}>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-center">
                      <div className="font-medium flex items-center gap-2">
                        <User size={14} />
                        {comment.author.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {format(
                          new Date(parseInt(comment.createdAt)),
                          "MMM dd, yyyy"
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-sm">{comment.content}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
