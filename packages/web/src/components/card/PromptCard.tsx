import { Heart } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Post } from "@/__generated__/graphql";
import { format } from "date-fns";
import Link from "next/link";

export function PromptCard({ post }: { post: Post }) {
  return (
    <Card
      key={post.id}
      className="overflow-hidden hover:shadow-md transition-shadow"
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{post.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          By {post.author.name} •{" "}
          {format(new Date(post.createdAt), "MMM dd, yyyy")}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div
          className="flex items-center gap-2"
          suppressHydrationWarning={true}
        >
          <div
            className="flex items-center gap-1"
            suppressHydrationWarning={true}
          >
            <Heart size={16} className="text-red-500" />
            <span className="text-sm" suppressHydrationWarning={true}>
              {post.likesCount}
            </span>
          </div>
          {post.category && (
            <span
              className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full dark:bg-indigo-900 dark:text-indigo-200"
              suppressHydrationWarning={true}
            >
              {post.category.name}
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/posts/${post.id}`}>Read more</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
