import { UserRoundX } from "lucide-react";
import EmptyState from "../ui/empty-state";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Unauthenticated() {
  return (
    <div>
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
