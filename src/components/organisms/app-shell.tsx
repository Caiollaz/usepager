import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { SidebarNav } from "@/components/molecules/sidebar-nav";
import type { AppNavItem } from "@/lib/navigation";
import { cn } from "@/lib/cn";

export type AppShellProps = ComponentPropsWithoutRef<"div"> & {
  navItems: AppNavItem[];
  children: ReactNode;
};

/** Responsive application shell: mobile nav rail, desktop fixed sidebar. */
export function AppShell({ className, navItems, children, ...props }: AppShellProps) {
  return (
    <div className={cn("min-h-dvh bg-background text-foreground md:flex", className)} {...props}>
      <SidebarNav items={navItems} />
      {children}
    </div>
  );
}
