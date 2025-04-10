"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, gql } from "@apollo/client";
import {
  CREATE_CATEGORY,
  GET_CATEGORIES,
  GET_POST,
  UPDATE_POST,
} from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import BackButton from "@/components/button/BackButton";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, loading, error } = useQuery(GET_POST, {
    variables: { postId: id },
    fetchPolicy: "network-only",
  });

  const {
    data: categoriesData,
    loading: loadingCategories,
    refetch,
  } = useQuery(GET_CATEGORIES);

  const [createCategory, { loading: creatingCategory }] = useMutation(
    CREATE_CATEGORY,
    {
      onCompleted: (data: any) => {
        if (data.createCategory.success) {
          toast.success("Category created successfully");
          setCategoryName(data.createCategory.category.name);
          setNewCategoryName("");
          setShowNewCategoryInput(false);
          refetch(); // Refresh categories list
        } else {
          toast.error("Error creating category", {
            description: data.createCategory.message,
          });
        }
      },
      onError: (error: any) => {
        toast.error("Error creating category", {
          description: error.message,
        });
      },
    }
  );

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

  useEffect(() => {
    if (data?.post) {
      setTitle(data.post.title);
      setContent(data.post.content);
      if (data.post.category) {
        setCategoryName(data.post.category.name);
      }
    }
  }, [data]);

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

  useEffect(() => {
    if (!user && !loading) {
      toast.error("destructive", {
        description: "You need to be logged in to edit posts.",
      });
      router.push(`/posts/${id}`);
    }
  }, [user, loading, router, id]);

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCategoryName.trim()) {
      return;
    }

    createCategory({
      variables: {
        name: newCategoryName.trim(),
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    const finalCategoryName = showNewCategoryInput
      ? newCategoryName
      : categoryName;

    updatePost({
      variables: {
        id,
        title: title.trim(),
        content: content.trim(),
        categoryName: finalCategoryName || undefined,
      },
    });
  };

  if (loading) {
    return (
      <div
        suppressHydrationWarning
        className="container max-w-4xl mx-auto py-8 px-4 flex justify-center"
      >
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        suppressHydrationWarning
        className="container max-w-4xl mx-auto py-8 px-4"
      >
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
      <div
        suppressHydrationWarning
        className="container max-w-4xl mx-auto py-8 px-4"
      >
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
    <div
      suppressHydrationWarning
      className="container max-w-4xl mx-auto py-8 px-4"
    >
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
              <label htmlFor="category" className="text-sm font-medium">
                Category (optional)
              </label>

              {!showNewCategoryInput ? (
                <div className="flex gap-2">
                  <select
                    id="category"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    <option value="">Select a category (optional)</option>
                    {categoriesData?.categories?.map((cat: any) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewCategoryInput(true)}
                    disabled={isSubmitting}
                  >
                    New
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter new category name"
                    disabled={isSubmitting || creatingCategory}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCreateCategory}
                    disabled={isSubmitting || creatingCategory}
                  >
                    {creatingCategory ? "Creating..." : "Create"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowNewCategoryInput(false);
                      setNewCategoryName("");
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              )}
              <p className="text-xs text-gray-500">
                Select an existing category or create a new one
              </p>
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
