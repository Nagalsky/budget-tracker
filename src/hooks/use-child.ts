import { getChild } from "@/actions/users.actions";
import { useQuery } from "@tanstack/react-query";

export function useChild() {
  return useQuery({
    queryKey: ["child"],
    queryFn: () => getChild(),
  });
}
