# Deploy com Dokploy

## Pre-requisitos

- VPS com Dokploy instalado.
- PostgreSQL acessivel pela VPS (externo ou na mesma rede).
- Dominio principal apontando para a VPS (ex: `app.seudominio.com`).

## 1. Criar aplicacao no Dokploy

1. No painel Dokploy, crie uma nova aplicacao do tipo **Docker**.
2. Aponte para o repositorio `Caiollaz/usepager`, branch `main`.
3. O Dokploy vai detectar o `Dockerfile` na raiz e fazer o build automaticamente.

## 2. Configurar variaveis de ambiente

No painel da aplicacao, adicione as variaveis baseadas no `.env.example`:

```env
NODE_ENV=production
DATABASE_URL=postgres://user:password@host:5432/pro_pages
BETTER_AUTH_SECRET=gere-um-valor-aleatorio-de-32-chars-minimo
BETTER_AUTH_URL=https://app.seudominio.com
NEXT_PUBLIC_APP_URL=https://app.seudominio.com
SITE_BASE_DOMAIN=seudominio.com
STATIC_SITES_DIR=./storage/sites
STORAGE_DIR=./storage
MAX_ASSET_SIZE_BYTES=5242880
```

- `DATABASE_URL`: string de conexao do seu PostgreSQL externo.
- `BETTER_AUTH_SECRET`: gere com `openssl rand -base64 32`.
- `BETTER_AUTH_URL` e `NEXT_PUBLIC_APP_URL`: URL publica da aplicacao com HTTPS.
- `SITE_BASE_DOMAIN`: dominio base para subdomínios dos sites publicados.

## 3. Configurar volume persistente

O container precisa de um volume montado em `/app/storage` para persistir:

- Assets enviados pelos usuarios (`/app/storage/assets/`)
- Sites estaticos publicados (`/app/storage/sites/`)

No Dokploy, configure o volume:

- **Container path**: `/app/storage`
- **Host path** ou **Named volume**: conforme sua preferencia

## 4. Configurar dominio e SSL

No painel do Dokploy:

1. Adicione o dominio `app.seudominio.com` na aplicacao.
2. Habilite SSL (Let's Encrypt).
3. O Dokploy configura o proxy automaticamente.

## 5. Deploy

Clique em **Deploy**. O Dokploy vai:

1. Clonar o repo.
2. Buildar o Dockerfile (multi-stage, ~2-3 min).
3. Subir o container.
4. No startup, o container aplica migrations pendentes automaticamente.
5. Inicia o servidor Next.js na porta 3000.

## 6. Primeiro acesso admin

Apos o primeiro deploy:

1. Acesse `https://app.seudominio.com/register` e crie uma conta.
2. Promova o usuario para admin no banco:

```sql
UPDATE "user" SET role = 'admin' WHERE email = 'seu@email.com';
```

3. Agora voce pode acessar `/admin/blocks` para gerenciar blocos do editor.

## 7. Sites publicados por subdominio

Para que sites publicados fiquem acessiveis via `{subdomain}.seudominio.com`:

### Opcao A: Nginx na VPS (recomendado)

O projeto inclui um `nginx.conf` pronto na raiz do repositorio. Veja `docs/nginx.md` para o passo a passo completo.

Resumo:

1. Configure wildcard DNS `*.seudominio.com` e `app.seudominio.com` apontando para a VPS.
2. Copie `nginx.conf` para `/etc/nginx/sites-available/usepager.conf`.
3. Substitua `seudominio.com` pelo dominio real.
4. Ajuste o path do volume (`/data/usepager/storage/sites`) para o mount point real no host.
5. Ative, teste e reload: `ln -s ... && nginx -t && systemctl reload nginx`.
6. Configure SSL wildcard com Certbot + DNS challenge.

### Opcao B: Via aplicacao (dev/teste)

Sem configurar Nginx, os sites publicados ficam acessiveis pelo path:

```
https://app.seudominio.com/sites/{subdomain}
```

Isso passa pelo Next.js e funciona sem configuracao extra. Para producao com trafego, prefira a Opcao A.

## Verificacao

Apos o deploy, verifique:

- `https://app.seudominio.com` — landing page publica
- `https://app.seudominio.com/login` — tela de login
- `https://app.seudominio.com/dashboard` — dashboard (requer login)
- Crie um projeto, edite no GrapesJS, publique e acesse via `/sites/{subdomain}`

## Rebuild

Para atualizar apos push no GitHub:

1. No Dokploy, clique **Redeploy** ou configure webhook automatico.
2. O build roda novamente e migrations pendentes sao aplicadas no startup.
