# Publicacao

## Visao geral

A publicacao gera um site estatico a partir das paginas do projeto e serve via subdominio.

## Fluxo

```
publishProjectAction(projectId)
  → requireSession() + requireProjectAccess()
  → Busca projeto, paginas e assets do banco
  → buildStaticSite({ project, pages, assets })
    → Cria diretorio temporario
    → Gera HTML por pagina (renderHtml)
    → Copia assets do storage para o site
    → Move atomicamente (rename) para STATIC_SITES_DIR/{subdomain}
  → Registra publicacao na tabela publications
  → Atualiza status do projeto para "published"
  → revalidatePath()
```

## Estrutura do site gerado

```
STATIC_SITES_DIR/{subdomain}/
  index.html          (pagina com slug "/")
  about/index.html    (pagina com slug "about")
  assets/             (copia dos assets do projeto)
```

## Geracao de HTML

`renderHtml()` em `static-site-builder.ts` gera um documento HTML completo com:

- Meta tags (title, description, viewport, charset)
- Favicon (se configurado)
- CSS inline no `<style>`
- HTML do editor no `<body>`

## Servindo sites

### Producao (Nginx)

Wildcard `*.seudominio.com` serve arquivos direto do filesystem sem passar pelo Next.js. Ver `docs/deploy/nginx.md`.

### Desenvolvimento (Next.js)

Route Handler em `/sites/[subdomain]/[[...path]]` usa `servePublishedFile()` que:

1. Valida subdomain e path segments
2. Resolve para arquivo no filesystem
3. Retorna com content-type correto e headers de cache
4. Protege contra path traversal

## Despublicar

`unpublishProjectAction(projectId)`:

1. Remove diretorio do site com `removeStaticSite(subdomain)`
2. Registra publicacao com status `failed` (historico)
3. Atualiza status do projeto para `draft`

## Storage

| Variavel | Padrao | Descricao |
|----------|--------|-----------|
| `STORAGE_DIR` | `./storage` | Raiz do storage local |
| `STATIC_SITES_DIR` | `./storage/sites` | Sites publicados |

Assets ficam em `STORAGE_DIR/assets/{projectId}/`.
