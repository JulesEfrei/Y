import Link from "next/link";
import { Button } from "@/components/ui/button";
import createApolloClient from "../../apollo-client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  GET_POSTS,
  GET_CATEGORIES,
  SEARCH_POSTS,
  POSTS_BY_CATEGORY,
  GET_POPULAR_POSTS,
} from "@/lib/queries";
import { PromptCard } from "@/components/card/PromptCard";
import { Post } from "@/__generated__/graphql";
import { SearchAndFilterContainer } from "@/components/search/SearchAndFilterContainer";
import { SearchIndicator } from "@/components/search/SearchIndicator";

export default async function Home({
  searchParams,
}: {
  searchParams: {
    page?: string;
    search?: string;
    category?: string;
    sort?: string;
  };
}) {
  const page = Number((await searchParams).page) || 1;
  const search = (await searchParams).search || "";
  const categoryId = (await searchParams).category || "";
  const sort = (await searchParams).sort || "latest"; // Default sort is latest
  const limit = 20;

  const client = createApolloClient();

  const { data: categoriesData } = await client.query({
    query: GET_CATEGORIES,
  });

  const categories = categoriesData?.categories || [];

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
    try {
      if (
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          categoryId
        )
      ) {
        console.error("ID de catégorie invalide:", categoryId);
        const { data } = await client.query({
          query: GET_POSTS,
          variables: { page, limit },
        });
        postsData = data?.posts.posts || [];
        totalCount = data?.posts.totalCount || 0;
      } else {
        const { data } = await client.query({
          query: POSTS_BY_CATEGORY as any,
          variables: { categoryId, page, limit },
        });
        postsData = data?.postsByCategory.posts || [];
        totalCount = data?.postsByCategory.totalCount || 0;
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des posts par catégorie:",
        error
      );
      const { data } = await client.query({
        query: GET_POSTS,
        variables: { page, limit },
      });
      postsData = data?.posts.posts || [];
      totalCount = data?.posts.totalCount || 0;
    }
  } else if (sort === "most_liked") {
    const { data } = await client.query({
      query: GET_POPULAR_POSTS,
      variables: { page, limit },
    });
    postsData = data?.popularPosts.posts || [];
    totalCount = data?.popularPosts.totalCount || 0;
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
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0) 0%, rgba(0,0,0,0.1) 100%)",
          }}
        ></div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Latest Prompts</h2>
        </div>

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
            posts.map((post: any) => {
              return <PromptCard key={post.id} post={post as Post} />;
            })
          )}
        </div>

        <div className="mt-12">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={`/?page=${Math.max(1, page - 1)}${
                    search ? `&search=${search}` : ""
                  }${categoryId ? `&category=${categoryId}` : ""}${
                    sort ? `&sort=${sort}` : ""
                  }`}
                  className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {page > 2 && (
                <PaginationItem>
                  <Link
                    href={`/?page=1${search ? `&search=${search}` : ""}${
                      categoryId ? `&category=${categoryId}` : ""
                    }${sort ? `&sort=${sort}` : ""}`}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    1
                  </Link>
                </PaginationItem>
              )}

              {page > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {page > 1 && (
                <PaginationItem>
                  <Link
                    href={`/?page=${page - 1}${
                      search ? `&search=${search}` : ""
                    }${categoryId ? `&category=${categoryId}` : ""}`}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {page - 1}
                  </Link>
                </PaginationItem>
              )}

              <PaginationItem>
                <span className="px-4 py-2 border bg-indigo-100 text-indigo-700 font-medium rounded-md dark:bg-indigo-900 dark:text-indigo-300">
                  {page}
                </span>
              </PaginationItem>

              {hasNextPage && (
                <PaginationItem>
                  <Link
                    href={`/?page=${page + 1}${
                      search ? `&search=${search}` : ""
                    }${categoryId ? `&category=${categoryId}` : ""}`}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {page + 1}
                  </Link>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  href={`/?page=${page + 1}${
                    search ? `&search=${search}` : ""
                  }${categoryId ? `&category=${categoryId}` : ""}${
                    sort ? `&sort=${sort}` : ""
                  }`}
                  className={
                    !hasNextPage ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
