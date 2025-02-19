"use client";

import { deleteTransaction } from "@/actions/transactions.actions";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FC } from "react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  transactionId: string;
};

const DeleteTransactionDialog: FC<Props> = ({
  open,
  setOpen,
  transactionId,
}) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: async () => {
      await Promise.all(
        [
          ["history"],
          ["overview", "stats"],
          ["overview", "history"],
          ["transactions"],
        ].map((queryKey) => queryClient.refetchQueries({ queryKey })),
      );

      toast.success("Transaction deleted successfully", {
        id: transactionId,
      });

      setOpen(false);
    },
    onError: () => {
      toast.error("Something went wrong", {
        id: transactionId,
      });
    },
  });

  const handleDelete = () => {
    toast.loading("Deleting transaction...", { id: transactionId });
    deleteMutation.mutate(transactionId);
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutly sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            transaction.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            {deleteMutation.isPending ? "Deliting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTransactionDialog;
