import { sendLocationEmail } from "@/actions/location.actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSendLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendLocationEmail,
    onMutate: () => {
      toast.loading("Sending location", {
        id: "send-location",
      });
    },
    onSuccess: () => {
      toast.success("Location sent successfully 🎉", {
        id: "send-location",
      });

      queryClient.invalidateQueries({
        queryKey: ["child"],
      });
    },
    onError: () => {
      toast.error("Something went wrong", {
        id: "send-location",
      });
    },
  });
};
