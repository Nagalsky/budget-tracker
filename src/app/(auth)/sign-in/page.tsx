import SignInForm from "@/components/common/auth/sign-in-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignInPage() {
  return <SignInForm />;
}
