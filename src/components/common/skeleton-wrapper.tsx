import { cn } from "@/lib/utils";
import React, { FC } from "react";
import { Skeleton } from "../ui/skeleton";

type Props = {
  children: React.ReactNode;
  isLoading: boolean;
  fullWidth?: boolean;
};

const SkeletonWrapper: FC<Props> = ({
  children,
  isLoading,
  fullWidth = true,
}) => {
  if (!isLoading) return children;
  return (
    <Skeleton className={cn(fullWidth && "w-full")}>
      <div className="opacity-0">{children}</div>
    </Skeleton>
  );
};

export default SkeletonWrapper;
