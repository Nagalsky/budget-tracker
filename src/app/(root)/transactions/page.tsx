import TransactionsContainer from "@/components/common/transactions-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions",
};

export default function TransactionsPage() {
  return <TransactionsContainer />;
}
