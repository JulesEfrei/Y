"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { GET_POST, UPDATE_POST } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import BackButton from "@/components/BackButton";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditPostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch the post data
  const { data, loading, error } = useQuery(GET_POST, {
    variables: { postId: id },
    fetchPolicy: "network-only",
  });

  // Update post mutation
  const [updatePost] = useMutation(UPDATE_POST, {
    onCompleted: (data) => {
      setIsSubmitting(false);
      if (data.updatePost.success) {
        toast("Post updated", {
          description: "Your post has been updated successfully.",
        });
        router.push(`/posts/${id}`);
      } else {
        toast.error("Error", {
          description: data.updatePost.message || "Failed to update post",
        });
      }
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast.error("Error", {
        description: error.message || "Failed to update post",
      });
    },
  });

  // Set form values when post data is loaded
  useEffect(() => {
    if (data?.post) {
      setTitle(data.post.title);
      setContent(data.post.content);
    }
  }, [data]);

  // Check if the current user is the author of the post
  useEffect(() => {
    if (data?.post && user) {
      if (data.post.author.id !== user.id) {
        toast.error("Unauthorized", {
          description: "You can only edit your own posts.",
        });
        router.push(`/posts/${id}`);
      }
    }
  }, [data, user, router, id]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !loading) {
      toast.error("destructive", {
        description: "You need to be logged in to edit posts.",
      });
      router.push(`/posts/${id}`);
    }
  }, [user, loading, router, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    updatePost({
      variables: {
        id,
        title: title.trim(),
        content: content.trim(),
      },
    });
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">Error loading post: {error.message}</p>
            <Button
              onClick={() => router.push(`/posts/${id}`)}
              className="mt-4"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data?.post) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <p>Post not found</p>
            <Button onClick={() => router.push("/")} className="mt-4">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <BackButton />

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                className="min-h-[200px]"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/posts/${id}`)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
