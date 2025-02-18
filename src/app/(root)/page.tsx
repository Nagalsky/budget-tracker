import Header from "@/components/common/header";
import { SignOut } from "@/components/common/SignOut";
import { getSession } from "@/utils/get-session";

export default async function HomePage() {
  const user = await getSession();

  console.log("user!!!: ", user);
  return (
    <div className="container">
      <Header />
      <h1>fwfw</h1>
      <SignOut />
    </div>
  );
}
