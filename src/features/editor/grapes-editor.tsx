"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import "grapesjs/dist/css/grapes.min.css";
import type { Editor } from "grapesjs";
import { Button } from "@/components/atoms/button";
import { savePageContentAction } from "@/features/pages/page-actions";

type EditorBlock = {
  name: string;
  html: string;
  css: string;
};

export type GrapesEditorProps = {
  pageId: string;
  initialHtml: string;
  initialCss: string;
  initialProjectData: string;
  blocks: { title: string; items: EditorBlock[] }[];
};

export function GrapesEditor({ blocks, initialCss, initialHtml, initialProjectData, pageId }: GrapesEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Editor | null>(null);
  const initialRef = useRef({ blocks, initialCss, initialHtml, initialProjectData });
  const [isReady, setIsReady] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let disposed = false;
    const { blocks: b, initialCss: css, initialHtml: html, initialProjectData: data } = initialRef.current;

    async function mountEditor() {
      const [{ default: grapes }, { default: presetWebpage }] = await Promise.all([
        import("grapesjs"),
        import("grapesjs-preset-webpage"),
      ]);

      if (!containerRef.current || disposed) return;

      const editor = grapes.init({
        container: containerRef.current,
        height: "100%",
        storageManager: false,
        plugins: [presetWebpage],
        pluginsOpts: {
          [presetWebpage as unknown as string]: {
            blocksBasicOpts: { flexGrid: true },
            formsOpts: false,
            countdownOpts: false,
            exportOpts: false,
            navbarOpts: false,
          },
        },
      });

      for (const group of b) {
        for (const block of group.items) {
          editor.BlockManager.add(`${group.title}-${block.name}`, {
            label: block.name,
            category: group.title,
            content: `${block.html}<style>${block.css}</style>`,
          });
        }
      }

      try {
        const projectData = JSON.parse(data || "{}");
        if (Object.keys(projectData).length > 0) {
          editor.loadProjectData(projectData);
        } else if (html) {
          editor.setComponents(html);
          editor.setStyle(css);
        }
      } catch {
        if (html) {
          editor.setComponents(html);
          editor.setStyle(css);
        }
      }

      editorRef.current = editor;
      setIsReady(true);
    }

    mountEditor();

    return () => {
      disposed = true;
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, []);

  function save() {
    const editor = editorRef.current;
    if (!editor) return;

    setMessage(null);
    startTransition(async () => {
      await savePageContentAction({
        pageId,
        html: editor.getHtml(),
        css: editor.getCss() ?? "",
        grapesJson: JSON.stringify(editor.getProjectData()),
      });
      setMessage("Página salva.");
    });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-canvas">
      <div className="flex h-12 items-center justify-between border-b border-border bg-sidebar px-4">
        <span className="text-sm text-muted-foreground">{isReady ? "Editor pronto" : "Carregando editor..."}</span>
        <div className="flex items-center gap-3">
          {message ? <span className="text-sm text-success">{message}</span> : null}
          <Button className="h-8 px-4 text-[13px]" disabled={isPending || !isReady} onClick={save}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>
      <div className="relative min-h-0 flex-1" ref={containerRef} />
    </div>
  );
}
