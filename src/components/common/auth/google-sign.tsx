"use client";
import { googleAuthenticate } from "@/actions/auth.actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Form from "next/form";
import { useActionState } from "react";
import SubmitButton from "../submit-button";

const GoogleSign = () => {
  const [state, action] = useActionState(googleAuthenticate, undefined);
  return (
    <Form action={action} className="space-y-6">
      {state?.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      <SubmitButton variant="outline" className="w-full">
        Continue with Google
      </SubmitButton>
    </Form>
  );
};

export default GoogleSign;
