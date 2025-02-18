"use client";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";

interface Props extends React.ComponentProps<typeof Button> {
  loadingText?: string;
}

const SubmitButton = ({
  className,
  children,
  loadingText = "Submitting",
  ...rest
}: Props) => {
  const { pending } = useFormStatus();

  return (
    <Button
      className={cn("flex items-center gap-2", className)}
      type="submit"
      disabled={pending}
      {...rest}
    >
      {pending ? (
        <>
          {loadingText} <Loader2 className="animate-spin" />
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
