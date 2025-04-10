"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  returnUrl: string;
}

export default function LoginModal({
  isOpen,
  onClose,
  returnUrl,
}: LoginModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    // Encode the return URL to safely include it in the query parameter
    const encodedReturnUrl = encodeURIComponent(returnUrl);
    router.push(`/auth/login?returnUrl=${encodedReturnUrl}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Authentication Required</DialogTitle>
          <DialogDescription>
            You need to be logged in to perform this action.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleLogin}>Log in</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
