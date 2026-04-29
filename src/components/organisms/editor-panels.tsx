import type { ComponentPropsWithoutRef } from "react";
import { Icon, type IconProps } from "@/components/atoms/icon";
import { Input } from "@/components/atoms/input";
import { cn } from "@/lib/cn";

const blockIcons: Record<string, IconProps["name"]> = {
  "Nav Dark": "navigation",
  "Nav Transparent": "navigation",
  "Hero com Imagem": "image",
  "Hero Texto Central": "type",
  "Features Grid": "columns",
  "Pricing Table": "credit-card",
};

export type EditorBlockGroup = {
  title: string;
  items: string[];
};

export type BlocksPanelProps = ComponentPropsWithoutRef<"aside"> & {
  groups: EditorBlockGroup[];
};

/** GrapesJS-style blocks panel using plain HTML and local SVG icons. */
export function BlocksPanel({ className, groups, ...props }: BlocksPanelProps) {
  return (
    <aside className={cn("w-full shrink-0 border-b border-border bg-sidebar p-4 md:h-full md:w-65 md:border-b-0 md:border-r", className)} {...props}>
      <div className="grid gap-4">
        <div className="relative">
          <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" name="search" />
          <Input className="h-9.5 pl-9 text-[13px]" placeholder="Buscar blocos..." />
        </div>
        {groups.length === 0 ? (
          <p className="rounded-md border border-border bg-card p-3 text-sm text-muted-foreground">
            Nenhum bloco ativo cadastrado.
          </p>
        ) : null}
        {groups.map((group) => (
          <div className="grid gap-2" key={group.title}>
            <h3 className="font-mono text-[11px] font-semibold tracking-[0.15em] text-muted-foreground">{group.title}</h3>
            <div className="grid gap-2">
              {group.items.map((item) => (
                <button
                  className="flex h-9 items-center gap-2.5 rounded-md border border-border bg-card px-3 text-left text-[13px] text-foreground transition-colors hover:bg-muted"
                  key={item}
                  type="button"
                >
                  <Icon className="text-primary" name={blockIcons[item] ?? "blocks"} />
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export type PropertiesPanelProps = ComponentPropsWithoutRef<"aside">;

/** Editor right panel. Values mirror the selected hero from the Pencil mock. */
export function PropertiesPanel({ className, ...props }: PropertiesPanelProps) {
  return (
    <aside className={cn("w-full shrink-0 border-t border-border bg-sidebar p-4 md:h-full md:w-70 md:border-l md:border-t-0", className)} {...props}>
      <div className="grid gap-5">
        <h2 className="text-sm font-semibold text-foreground">Propriedades</h2>
        <PropertyGroup title="DIMENSÕES">
          <div className="grid grid-cols-2 gap-2">
            <PropertyInput label="W" value="900" />
            <PropertyInput label="H" value="600" />
          </div>
        </PropertyGroup>
        <PropertyGroup title="TIPOGRAFIA">
          <div className="flex h-8 items-center justify-between rounded-sm border border-border bg-card px-2.5 text-xs">
            <span>Geist</span>
            <Icon className="text-muted-foreground" name="chevron-down" size={14} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <PropertyInput label="Tamanho" value="40" />
            <PropertyInput label="Peso" value="800" />
          </div>
        </PropertyGroup>
        <PropertyGroup title="CORES">
          <ColorRow label="Fundo" value="#F9FAFB" swatch="bg-secondary" />
          <ColorRow label="Texto" value="#0A0A0A" swatch="bg-foreground" />
        </PropertyGroup>
        <PropertyGroup title="ESPAÇAMENTO">
          <div className="grid grid-cols-2 gap-2">
            <PropertyInput label="Padding" value="60" />
            <PropertyInput label="Gap" value="20" />
          </div>
        </PropertyGroup>
      </div>
    </aside>
  );
}

function PropertyGroup({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section className="grid gap-2">
      <h3 className="font-mono text-[10px] font-semibold tracking-[0.15em] text-muted-foreground">{title}</h3>
      {children}
    </section>
  );
}

function PropertyInput({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex h-8 items-center gap-1 rounded-sm border border-border bg-card px-2.5 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono text-foreground">{value}</span>
    </div>
  );
}

function ColorRow({ label, swatch, value }: { label: string; swatch: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-11 text-muted-foreground">{label}</span>
      <span className={cn("size-6 rounded-sm border border-border", swatch)} />
      <span className="font-mono text-foreground">{value}</span>
    </div>
  );
}
