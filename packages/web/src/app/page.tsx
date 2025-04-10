import Link from "next/link";
import { Button } from "@/components/ui/button";
import createApolloClient from "../../apollo-client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  GET_POSTS,
  GET_CATEGORIES,
  SEARCH_POSTS,
  POSTS_BY_CATEGORY,
} from "@/lib/queries";
import { PromptCard } from "@/components/card/PromptCard";
import { Post } from "@/__generated__/graphql";
import { SearchAndFilterContainer } from "@/components/search/SearchAndFilterContainer";
import { SearchIndicator } from "@/components/search/SearchIndicator";

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; category?: string };
}) {
  const page = Number((await searchParams).page) || 1;
  const search = (await searchParams).search || "";
  const categoryId = (await searchParams).category || "";
  const limit = 20;

  const client = createApolloClient();

  // Fetch categories for the filter
  const { data: categoriesData } = await client.query({
    query: GET_CATEGORIES,
  });

  const categories = categoriesData?.categories || [];

  // Fetch posts based on search/filter criteria
  let postsData;
  let totalCount = 0;

  if (search) {
    const { data } = await client.query({
      query: SEARCH_POSTS,
      variables: { search, page, limit },
    });
    postsData = data?.searchPosts.posts || [];
    totalCount = data?.searchPosts.totalCount || 0;
  } else if (categoryId) {
    const { data } = await client.query({
      query: POSTS_BY_CATEGORY,
      variables: { categoryId, page, limit },
    });
    postsData = data?.postsByCategory || [];
    // For category filtering, we don't have totalCount in the schema
    totalCount = postsData.length === limit ? page * limit + 1 : page * limit;
  } else {
    const { data } = await client.query({
      query: GET_POSTS,
      variables: { page, limit },
    });
    postsData = data?.posts.posts || [];
    totalCount = data?.posts.totalCount || 0;
  }

  const posts = postsData;
  const hasNextPage = totalCount > page * limit;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero section remains unchanged */}
      <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 dark:from-blue-950 dark:via-purple-950 dark:to-indigo-950 py-24 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full mb-6 flex items-center gap-2">
              <span className="inline-block">New</span>
              <span>We've just released Y →</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-900 via-purple-600 to-pink-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-300 dark:to-pink-300">
              <span className="block">Boost Your Productivity,</span>
              <span className="block">Simplify Your Life</span>
            </h1>

            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl">
              Y is a prompt library to boost productivity and use best prompt
              the community has to offer. Start using Y today and see the
              difference it can make. Share your own prompts or browse through
              the community's collection.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700"
                asChild
              >
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>

        <div
          suppressHydrationWarning
          className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
        ></div>
        <div
          suppressHydrationWarning
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
        ></div>
        <div
          suppressHydrationWarning
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
        ></div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Latest Prompts</h2>

        <div className="mb-8">
          <SearchAndFilterContainer categories={categories} />
          <SearchIndicator />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">
                {search || categoryId
                  ? "No prompts found matching your criteria"
                  : "No posts yet. Be the first"}
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <PromptCard key={post.id} post={post as Post} />
            ))
          )}
        </div>

        <div suppressHydrationWarning className="mt-10">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={page > 1 ? `/?page=${page - 1}` : undefined}
                  aria-disabled={page <= 1}
                />
              </PaginationItem>

              {page > 1 && (
                <PaginationItem>
                  <PaginationLink href={`/?page=${page - 1}`}>
                    {page - 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationLink href={`/?page=${page}`} isActive>
                  {page}
                </PaginationLink>
              </PaginationItem>

              {hasNextPage && (
                <PaginationItem>
                  <PaginationLink href={`/?page=${page + 1}`}>
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  href={hasNextPage ? `/?page=${page + 1}` : undefined}
                  aria-disabled={!hasNextPage}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
