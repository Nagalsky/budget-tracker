import SendGeolocationForm from "@/components/common/forms/send-geolocation-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function ChildPage() {
  return <SendGeolocationForm />;
}
