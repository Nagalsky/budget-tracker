import SignUpChildForm from "@/components/common/auth/sign-up-child-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function ParentPage() {
  return <SignUpChildForm />;
}
