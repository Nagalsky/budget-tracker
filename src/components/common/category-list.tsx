"use client";
import { useGetCategories } from "@/hooks/use-get-categories";
import { cn } from "@/lib/utils";
import { TransactionType } from "@/types/transaction.type";
import { PlusSquare, TrendingDown, TrendingUp } from "lucide-react";
import { FC } from "react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import CategoryCard from "./category-card";
import CreateCategoryDialog from "./dialogs/create-category-dialog";
import SkeletonWrapper from "./skeleton-wrapper";

type Props = {
  type: TransactionType;
};

const CategoryList: FC<Props> = ({ type }) => {
  const { data, refetch, isLoading } = useGetCategories(type);

  const availableData = data && data.length > 0;

  return (
    <section className="py-4">
      <div className="container">
        <SkeletonWrapper isLoading={isLoading}>
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {type === "expense" ? (
                    <TrendingDown className="size-12 items-center rounded-lg bg-red-400/10 p-2 text-red-500" />
                  ) : (
                    <TrendingUp className="size-12 items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500" />
                  )}
                  <div className="text-lg">
                    {type === "income" ? "Incomes" : "Expense"} categories{" "}
                    <p className="text-muted-foreground text-sm">
                      Sorted by name
                    </p>
                  </div>
                </div>

                <CreateCategoryDialog
                  type={type}
                  onSuccessCallback={() => refetch()}
                  trigger={
                    <Button className="gap-2 text-sm">
                      <PlusSquare />
                      Create category
                    </Button>
                  }
                />
              </CardTitle>
            </CardHeader>
            <Separator />
            {!availableData && (
              <div className="flex h-40 w-full flex-col items-center justify-center px-4 text-center">
                <p>
                  No
                  <span
                    className={cn(
                      "m1",
                      type === "income" ? "text-emerald-500" : "text-red-500",
                    )}
                  ></span>
                  categoires yet
                </p>
                <div className="text-muted-foreground text-sm">
                  Create one to get started
                </div>
              </div>
            )}
            {availableData && (
              <div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {data.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            )}
          </Card>
        </SkeletonWrapper>
      </div>
    </section>
  );
};

export default CategoryList;
