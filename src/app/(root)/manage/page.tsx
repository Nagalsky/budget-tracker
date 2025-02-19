import CategoryList from "@/components/common/category-list";
import ManageCurrency from "@/components/common/manage-currency";
import ManageHero from "@/components/common/manage-hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage",
};

export default function ManagePage() {
  return (
    <>
      <ManageHero />
      <ManageCurrency />
      <CategoryList type="income" />
      <CategoryList type="expense" />
    </>
  );
}
