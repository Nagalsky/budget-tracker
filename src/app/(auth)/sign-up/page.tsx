import SignUpForm from "@/components/common/auth/sign-up-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
