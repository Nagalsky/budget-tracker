"use client";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

const SignInWithGoogle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const handleSignInWithGoogle = async () => {
    setIsLoading(true);
    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL: "/wizard",
      },
      {
        onSuccess: async () => {
          setIsLoading(false);
        },
      },
    );
  };
  return (
    <Button
      className="w-full"
      variant="outline"
      onClick={handleSignInWithGoogle}
      disabled={isLoading}
    >
      {isLoading && <Loader2 className="mr-2 animate-spin" />}Login with Google
    </Button>
  );
};

export default SignInWithGoogle;
