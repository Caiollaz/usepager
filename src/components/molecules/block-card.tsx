import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Badge } from "@/components/atoms/badge";
import { Card } from "@/components/atoms/card";
import { PlaceholderImage } from "@/components/atoms/placeholder-image";
import { cn } from "@/lib/cn";

type BlockCardItem = {
  name: string;
  category: string;
  status: "active" | "review";
  usageCount: number;
};

export type BlockCardProps = ComponentPropsWithoutRef<typeof Card> & {
  item: BlockCardItem;
  actions?: ReactNode;
};

/** Admin library card for reusable GrapesJS blocks/components. */
export function BlockCard({ actions, className, item, ...props }: BlockCardProps) {
  return (
    <Card className={cn("overflow-hidden border-border-strong", className)} {...props}>
      <PlaceholderImage className="h-35 w-full" />
      <div className="grid gap-2 p-4">
        <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{item.category}</Badge>
          <Badge tone={item.status === "active" ? "success" : "warning"}>{item.status === "active" ? "Ativo" : "Revisão"}</Badge>
          <span className="text-xs text-muted-foreground">{item.usageCount} usos</span>
        </div>
        {actions ? <div className="pt-2">{actions}</div> : null}
      </div>
    </Card>
  );
}
