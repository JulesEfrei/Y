import Link from "next/link";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import createApolloClient from "../../apollo-client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { GET_POSTS } from "@/lib/queries";

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = 1;
  const limit = 20;

  const client = createApolloClient();
  const { data } = await client.query({
    query: GET_POSTS,
    variables: { page, limit },
  });

  const posts = data?.posts || [];
  const hasNextPage = posts.length === limit;

  return (
    <div
      suppressHydrationWarning
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      <div
        suppressHydrationWarning
        className="bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 dark:from-blue-950 dark:via-purple-950 dark:to-indigo-950 py-24 px-4 relative overflow-hidden"
      >
        <div
          suppressHydrationWarning
          className="container mx-auto max-w-6xl relative z-10"
        >
          <div
            suppressHydrationWarning
            className="flex flex-col items-center text-center max-w-3xl mx-auto"
          >
            <div
              suppressHydrationWarning
              className="bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full mb-6 flex items-center gap-2"
            >
              <span className="inline-block">New</span>
              <span>We've just released a new feature →</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-900 via-purple-600 to-pink-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-300 dark:to-pink-300">
              <span className="block">Boost Your Productivity,</span>
              <span className="block">Simplify Your Life</span>
            </h1>

            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl">
              We're here to simplify the intricacies of your life, providing a
              user-friendly platform that not only manages your tasks
              effortlessly but also enhances your overall efficiency.
            </p>

            <div
              suppressHydrationWarning
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950"
              >
                Preview Platform
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

      <div
        suppressHydrationWarning
        className="container mx-auto max-w-6xl px-4 py-12"
      >
        <h2 className="text-3xl font-bold mb-8">Latest Posts</h2>

        <div
          suppressHydrationWarning
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {posts.length === 0 ? (
            <div
              suppressHydrationWarning
              className="col-span-full text-center py-8"
            >
              <p className="text-gray-500">No posts yet. Be the first</p>
            </div>
          ) : (
            posts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    By {post.author.name} •{" "}
                    {format(new Date(parseInt(post.createdAt)), "MMM dd, yyyy")}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div
                    suppressHydrationWarning
                    className="flex items-center gap-2"
                  >
                    <div
                      suppressHydrationWarning
                      className="flex items-center gap-1"
                    >
                      <Heart size={16} className="text-red-500" />
                      <span className="text-sm">{post.likesCount}</span>
                    </div>
                    {post.category && (
                      <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full dark:bg-indigo-900 dark:text-indigo-200">
                        {post.category.name}
                      </span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/posts/${post.id}`}>Read more</Link>
                  </Button>
                </CardFooter>
              </Card>
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
