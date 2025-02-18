"use client";
import { googleAuthenticate } from "@/actions/auth.actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import Form from "next/form";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const GoogleSign = () => {
  const [state, action] = useActionState(googleAuthenticate, undefined);
  const { pending } = useFormStatus();
  return (
    <Form action={action} className="space-y-6">
      {state?.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      <Button variant="outline" disabled={pending} className="w-full">
        {pending ? (
          <Loader2 className="animate-spin" />
        ) : (
          "Continue with Google"
        )}
      </Button>
    </Form>
  );
};

export default GoogleSign;
