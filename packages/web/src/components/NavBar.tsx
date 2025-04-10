"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NavBar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Don't show navbar on auth pages
  if (pathname.startsWith("/auth/")) {
    return null;
  }

  return (
    <div suppressHydrationWarning className="sticky top-0 left-0 right-0 border-b bg-background z-50">
      <div suppressHydrationWarning className="flex h-16 items-center justify-between p-4 max-w-7xl mx-auto">
        <div suppressHydrationWarning>
          <Link href="/" className="text-xl font-bold">
            Y
          </Link>
        </div>

        <div suppressHydrationWarning className="flex items-center gap-4">
          {user && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/posts/new" className="flex items-center gap-2">
                <PlusCircle size={16} />
                <span>Create Post</span>
              </Link>
            </Button>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User size={16} />
                  <span>{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div suppressHydrationWarning className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
