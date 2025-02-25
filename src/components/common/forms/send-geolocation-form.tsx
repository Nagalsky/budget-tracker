"use client";

import { Button } from "@/components/ui/button";
import { useChild } from "@/hooks/use-child";
import { useSendLocation } from "@/hooks/use-send-location";
import { useGeolocation } from "@uidotdev/usehooks";
import { LocateIcon } from "lucide-react";

export default function SendGeolocationForm() {
  const { loading, latitude, longitude } = useGeolocation();

  const { data: child } = useChild();

  const { mutate, isPending } = useSendLocation();

  const handleSendLocation = () => {
    if (!latitude || !longitude) {
      return;
    }
    mutate({
      latitude,
      longitude,
      parentEmail: child?.parent.user.email || "",
      childId: child?.id || "",
    });
  };

  return (
    <div className="container py-8">
      <Button onClick={handleSendLocation} disabled={isPending || loading}>
        <LocateIcon />
        {isPending ? "Sending..." : "Send My Location"}
      </Button>
    </div>
  );
}
