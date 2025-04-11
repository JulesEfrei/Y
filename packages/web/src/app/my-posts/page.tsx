"use client";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { POSTS_BY_USER } from "@/lib/queries";
import { PromptCard } from "@/components/card/PromptCard";
import { Post } from "@/__generated__/graphql";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { useAuth } from "@/context/AuthContext";

export default function MyPosts() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam) : 1;
  const limit = 20;
  const { user } = useAuth();

  if (!user) {
    router.push("/auht/login");
    return null;
  }

  // Query posts once we have the user
  const { data, loading, error } = useQuery(POSTS_BY_USER, {
    variables: { userId: user.id, page, limit },
  });

  const posts = data?.postsByUser.posts || [];
  const totalCount = data?.postsByUser.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  if (loading && !data)
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">Loading...</div>
    );
  if (error)
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        Error loading posts: {error.message}
      </div>
    );
  if (!user)
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        Loading user...
      </div>
    );

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Posts</h1>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">
            You haven't created any posts yet
          </h2>
          <Button asChild>
            <Link href="/posts/new">Create your first post</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 mb-8">
            {posts.map((post) => (
              <PromptCard key={post.id} post={post as Post} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                {page > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href={`/my-posts?page=${page - 1}`}
                      aria-label="Go to previous page"
                    />
                  </PaginationItem>
                )}

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNumber = i + 1;
                  const isCurrentPage = pageNumber === page;

                  // Show first page, last page, current page, and pages around current page
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= page - 1 && pageNumber <= page + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <Link
                          href={`/my-posts?page=${pageNumber}`}
                          className={`${
                            isCurrentPage
                              ? "bg-primary text-primary-foreground"
                              : ""
                          } flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors hover:bg-muted`}
                          aria-current={isCurrentPage ? "page" : undefined}
                        >
                          {pageNumber}
                        </Link>
                      </PaginationItem>
                    );
                  }

                  // Show ellipsis for gaps
                  if (
                    (pageNumber === 2 && page > 3) ||
                    (pageNumber === totalPages - 1 && page < totalPages - 2)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return null;
                })}

                {page < totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      href={`/my-posts?page=${page + 1}`}
                      aria-label="Go to next page"
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
