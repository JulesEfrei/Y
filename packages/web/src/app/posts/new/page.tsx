"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import BackButton from "@/components/button/BackButton";
import { CREATE_POST } from "@/lib/queries";

export default function NewPostPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<{ title?: string; content?: string }>(
    {}
  );

  const [createPost, { loading }] = useMutation(CREATE_POST, {
    onCompleted: (data) => {
      if (data.createPost.success) {
        toast.success("Post created successfully!");
        router.push(`/posts/${data.createPost.post!.id}`);
      } else {
        toast.error("Error", {
          description: data.createPost.message || "Failed to create post",
        });
      }
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message || "Failed to create post",
      });
    },
  });

  // Redirect if not logged in
  if (!isLoading && !user) {
    router.push("/login?returnUrl=/posts/new");
    return null;
  }

  const validateForm = () => {
    const newErrors: { title?: string; content?: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createPost({
      variables: {
        title: title.trim(),
        content: content.trim(),
      },
    });
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">Loading...</div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <BackButton />

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
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
                className={`min-h-[200px] ${
                  errors.content ? "border-red-500" : ""
                }`}
              />
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Publishing..." : "Publish Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
