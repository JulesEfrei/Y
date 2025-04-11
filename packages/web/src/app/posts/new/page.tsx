"use client";

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useMutation, useQuery } from "@apollo/client";
import BackButton from "@/components/button/BackButton";
import { CREATE_CATEGORY, CREATE_POST, GET_CATEGORIES } from "@/lib/queries";

export default function NewPostPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    category?: string;
  }>({});

  const { data: categoriesData, loading, refetch } = useQuery(GET_CATEGORIES);

  const [createCategory, { loading: creatingCategory }] = useMutation(
    CREATE_CATEGORY,
    {
      onCompleted: (data: any) => {
        if (data.createCategory.success) {
          toast.success("Category created successfully");
          setCategoryName(data.createCategory.category.name);
          setNewCategoryName("");
          setShowNewCategoryInput(false);
          refetch();
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

  const [createPost, { loading: creatingPost }] = useMutation(CREATE_POST, {
    onCompleted: (data: any) => {
      if (data.createPost.success) {
        toast.success("Post created successfully!");
        redirect(`/posts/${data.createPost.post!.id}`);
      } else {
        toast.error("Error", {
          description: data.createPost.message || "Failed to create post",
        });
      }
    },
    onError: (error: any) => {
      toast.error("Error", {
        description: error.message || "Failed to create post",
      });
    },
  });

  // Redirect if not logged in
  if (!isLoading && !user) {
    redirect("/auth/login?returnUrl=/posts/new");
  }

  const validateForm = () => {
    const newErrors: { title?: string; content?: string; category?: string } =
      {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    }

    if (showNewCategoryInput && !newCategoryName.trim()) {
      newErrors.category = "Category name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCategoryName.trim()) {
      setErrors((prev) => ({ ...prev, category: "Category name is required" }));
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

    if (!validateForm()) {
      return;
    }

    const finalCategoryName = showNewCategoryInput
      ? newCategoryName
      : categoryName;

    createPost({
      variables: {
        title: title.trim(),
        content: content.trim(),
        categoryName: finalCategoryName || undefined,
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
                    className={errors.category ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCreateCategory}
                    disabled={creatingCategory}
                  >
                    {creatingCategory ? "Creating..." : "Create"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowNewCategoryInput(false);
                      setNewCategoryName("");
                      setErrors((prev) => ({ ...prev, category: undefined }));
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}

              {errors.category && (
                <p className="text-sm text-red-500">{errors.category}</p>
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
                className={`min-h-[200px] ${
                  errors.content ? "border-red-500" : ""
                }`}
              />
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={creatingPost}>
              {creatingPost ? "Publishing..." : "Publish Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
