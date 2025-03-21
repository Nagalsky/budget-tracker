"use client";

import { deleteCategory } from "@/actions/categories.actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TransactionType } from "@/types/transaction.type";
import { Category } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FC } from "react";
import { toast } from "sonner";

type Props = {
  category: Category;
  trigger?: React.ReactNode;
};

const DeleteCategoryDialog: FC<Props> = ({ category, trigger }) => {
  const categoryIdentifier = `${category.name}-${category.type}`;
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: async () => {
      toast.success("Category deleted successfully", {
        id: categoryIdentifier,
      });

      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: () => {
      toast.error("Something went wrong", {
        id: categoryIdentifier,
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutly sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            category.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading("Deleting category...", { id: categoryIdentifier });
              deleteMutation.mutate({
                name: category.name,
                type: category.type as TransactionType,
              });
            }}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCategoryDialog;
