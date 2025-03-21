import { Category } from "@prisma/client";
import { TrashIcon } from "lucide-react";
import { FC } from "react";
import { Button } from "../ui/button";
import DeleteCategoryDialog from "./dialogs/delete-category-dialog";

type Props = {
  category: Category;
};

const CategoryCard: FC<Props> = ({ category }) => {
  return (
    <div className="flex border-separate flex-col justify-between rounded-md border shadow shadow-black/10 dark:shadow-white/10">
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-3xl" role="img">
          {category.icon}
        </span>
        <span className="font-bold">{category.name}</span>
      </div>
      <DeleteCategoryDialog
        trigger={
          <Button
            className="text-muted-foreground flex w-full border-separate items-center gap-2 rounded-t-none hover:bg-red-500 hover:text-white"
            variant={"secondary"}
          >
            <TrashIcon />
            Delete
          </Button>
        }
        category={category}
      />
    </div>
  );
};

export default CategoryCard;
