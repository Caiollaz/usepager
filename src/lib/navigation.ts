import type { IconProps } from "@/components/atoms/icon";

export type AppNavItem = {
  label: string;
  icon: IconProps["name"];
  href: string;
  active?: boolean;
};

export function createNavItems(active: "projects" | "blocks" | "templates" | "settings", projectId?: string): AppNavItem[] {
  return [
    { label: "Projetos", icon: "layout-grid", href: "/dashboard", active: active === "projects" },
    { label: "Blocos", icon: "blocks", href: "/admin/blocks", active: active === "blocks" },
    { label: "Templates", icon: "layout-template", href: "/templates", active: active === "templates" },
    { label: "Configurações", icon: "settings", href: projectId ? `/projects/${projectId}/settings` : "/dashboard", active: active === "settings" },
  ];
}
