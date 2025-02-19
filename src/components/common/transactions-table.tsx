"use client";

import { GetTransactionHistoryResponseType } from "@/actions/transactions.actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTransactionsHistory } from "@/hooks/use-transactions-history";
import { cn } from "@/lib/utils";
import { Transaction } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, TrashIcon } from "lucide-react";
import { FC, useMemo, useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { DataTableColumnHeader } from "./datatable/column-header";
import { DataTableViewOptions } from "./datatable/column-toggle";
import { DataTableFacetedFilter } from "./datatable/faceted-filters";
import DeleteTransactionDialog from "./dialogs/delete-transaction-dialog";
import SkeletonWrapper from "./skeleton-wrapper";

type Props = {
  from: Date;
  to: Date;
};

type TransactionHistoryRow = GetTransactionHistoryResponseType[0];

export const columns: ColumnDef<TransactionHistoryRow>[] = [
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <div className="flex gap-2 capitalize">
        {row.original.categoryIcon}
        <div className="capitalize">{row.original.category}</div>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.original.description}</div>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const formattedDate = format(new Date(row.original.date), "dd/MM/yyyy");
      return <div className="text-muted-foreground">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <div
        className={cn(
          "rounded-lg p-2 text-center capitalize",
          row.original.type === "income"
            ? "bg-emerald-400/10 text-emerald-500"
            : "bg-red-400/10 text-red-500",
        )}
      >
        {row.original.type}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => (
      <p className="text-md rounded-lg bg-gray-400/5 p-2 text-center font-medium">
        {row.original.formatterAmmout}
      </p>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <RowActions transaction={row.original} />
      </div>
    ),
  },
];

const TransactionsTable: FC<Props> = ({ from, to }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilter, setColumnFilter] = useState<ColumnFiltersState>([]);
  const { data, isLoading } = useTransactionsHistory({ from, to });

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { sorting, columnFilters: columnFilter },
    onColumnFiltersChange: setColumnFilter,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const categoriesOptions = useMemo(() => {
    return Array.from(
      new Map(
        data?.map(({ category, categoryIcon }) => [
          category,
          { value: category, label: `${categoryIcon} ${category}` },
        ]),
      ).values(),
    );
  }, [data]);

  return (
    <section className="py-8">
      <div className="container">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-2">
              {table.getColumn("category") && (
                <DataTableFacetedFilter
                  title="Category"
                  column={table.getColumn("category")}
                  options={categoriesOptions}
                />
              )}
              {table.getColumn("type") && (
                <DataTableFacetedFilter
                  title="Type"
                  column={table.getColumn("type")}
                  options={[
                    {
                      label: "Income",
                      value: "income",
                    },
                    {
                      label: "Expense",
                      value: "expense",
                    },
                  ]}
                />
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <DataTableViewOptions table={table} />
            </div>
          </div>

          <SkeletonWrapper isLoading={isLoading}>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </SkeletonWrapper>
        </div>
      </div>
    </section>
  );
};

export default TransactionsTable;

function RowActions({ transaction }: { transaction: Transaction }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <>
      <DeleteTransactionDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        transactionId={transaction.id}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2"
            onSelect={() => setShowDeleteDialog((prev) => !prev)}
          >
            <TrashIcon className="text-muted-foreground" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
