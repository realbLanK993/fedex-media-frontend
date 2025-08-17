import { UserRoundX } from "lucide-react";
import EmptyState from "../ui/empty-state";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Unauthenticated() {
  return (
    <div className="flex flex-col h-[calc(100vh-220px)] justify-center items-center">
      <EmptyState
        icon={UserRoundX}
        title="You are not authenticated"
        description="Login to your account before using this page"
      />
      <Link href={"/login"}>
        <Button>Login</Button>
      </Link>
    </div>
  );
}
