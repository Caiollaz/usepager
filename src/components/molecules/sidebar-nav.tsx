import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Icon, type IconProps } from "@/components/atoms/icon";
import { Logo } from "@/components/atoms/logo";

export type NavItem = {
  label: string;
  icon: IconProps["name"];
  href: string;
  active?: boolean;
};

export type SidebarNavProps = ComponentPropsWithoutRef<"aside"> & {
  items: NavItem[];
};

/** Fixed desktop sidebar from Pencil; collapses into a horizontal rail on mobile. */
export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  return (
    <aside
      className={cn(
        "flex w-full shrink-0 flex-row items-center gap-3 border-b border-border bg-sidebar px-4 py-3 md:h-dvh md:w-65 md:flex-col md:items-stretch md:gap-8 md:border-b-0 md:border-r md:px-4 md:py-6",
        className,
      )}
      {...props}
    >
      <Logo className="shrink-0 md:w-full" />
      <nav aria-label="Navegação principal" className="flex min-w-0 flex-1 gap-1 overflow-x-auto md:flex-col md:overflow-visible">
        {items.map((item) => (
          <Link
            className={cn(
              "flex h-9.5 shrink-0 items-center gap-2.5 rounded-md px-3 text-sm transition-colors hover:bg-muted md:w-full",
              item.active ? "bg-accent-muted font-medium text-foreground" : "text-muted-foreground",
            )}
            href={item.href}
            key={item.label}
          >
            <Icon className={cn(item.active ? "text-primary" : "text-muted-foreground")} name={item.icon} size={18} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
