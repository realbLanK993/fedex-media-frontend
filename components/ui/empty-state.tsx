import { LucideIcon } from "lucide-react";
import { Button } from "./button";

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: string;
}) {
  const Icon = icon;
  return (
    <div className="w-full h-[200px] flex flex-col gap-4 justify-center items-center">
      <Button variant={"outline"} disabled size={"lg"}>
        {" "}
        <Icon />
      </Button>
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-xl font-light">{title}</p>
        <small>{description}</small>
      </div>
      {action && <Button>{action}</Button>}
    </div>
  );
}
