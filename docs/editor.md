# Editor

## Stack

GrapesJS v0.22 integrado como Client Component em `src/features/editor/grapes-editor.tsx`.

## Rota

`/editor/[project-id]/[page-id]` — carrega dados da pagina no servidor e passa como props para o editor.

## Inicializacao

O editor recebe:

- `html` e `css` da pagina (conteudo salvo)
- `grapesJson` (estado completo do GrapesJS, usado se disponivel)
- `blocks` — blocos ativos agrupados por categoria

Se `grapesJson` contem dados validos, o editor carrega a partir dele. Caso contrario, usa `html` + `css` como fallback.

## Blocos

Blocos sao componentes reutilizaveis gerenciados por admins em `/admin/blocks`. Cada bloco tem:

- `name` — nome exibido no painel
- `category` — agrupamento (ex: "headers", "footers", "content")
- `status` — `active` (visivel no editor) ou `review` (oculto)
- `html` + `css` — conteudo do bloco
- `schemaJson` — schema de configuracao (reservado para uso futuro)

`getEditorBlockGroups()` retorna blocos ativos agrupados por categoria para o BlockManager do GrapesJS.

## Salvamento

O botao de salvar chama `savePageContentAction` via `useTransition`, enviando:

- `html` — HTML gerado pelo GrapesJS
- `css` — CSS gerado pelo GrapesJS
- `grapesJson` — estado completo serializado

## Assets no editor

Assets do projeto sao servidos via `/uploads/[project-id]/[file-name]`, que:

1. Verifica autenticacao
2. Valida project ownership
3. Resolve arquivo no filesystem com protecao contra path traversal
4. Retorna com `x-content-type-options: nosniff`

Upload de assets via `uploadProjectAssetAction`:

- Valida MIME (imagens, fontes, PDF) e tamanho (`MAX_ASSET_SIZE_BYTES`, padrao 5MB)
- Salva em `STORAGE_DIR/assets/{projectId}/`
- Suporta `purpose: "favicon"` para definir favicon do projeto

## Preview

`/preview/[project-id]/[page-id]` renderiza a pagina com o mesmo `renderHtml()` usado na publicacao, permitindo visualizar antes de publicar.
