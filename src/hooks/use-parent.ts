import { getParent } from "@/actions/users.actions";
import { useQuery } from "@tanstack/react-query";

export function useParent() {
  return useQuery({
    queryKey: ["parent"],
    queryFn: () => getParent(),
  });
}
