# Nginx

## Arquivo de configuracao

O arquivo `nginx.conf` na raiz do projeto contem a configuracao completa para:

1. **App principal** (`app.seudominio.com`) — reverse proxy para o container Next.js na porta 3000.
2. **Sites publicados** (`*.seudominio.com`) — serve arquivos estaticos direto do volume de storage sem passar pelo Next.js.

## Setup

```bash
# 1. Copie o arquivo para o Nginx
sudo cp nginx.conf /etc/nginx/sites-available/usepager.conf

# 2. Edite e substitua "seudominio.com" pelo dominio real
sudo nano /etc/nginx/sites-available/usepager.conf

# 3. Ajuste o path do volume na secao de sites publicados
#    Troque "/data/usepager/storage/sites" pelo mount point real do volume no host

# 4. Ative o site
sudo ln -s /etc/nginx/sites-available/usepager.conf /etc/nginx/sites-enabled/

# 5. Teste a configuracao
sudo nginx -t

# 6. Reload
sudo systemctl reload nginx
```

## SSL com wildcard

Para HTTPS em `app.seudominio.com` e `*.seudominio.com`:

```bash
# Certbot com DNS challenge (necessario para wildcard)
sudo certbot certonly --dns-cloudflare \
  --dns-cloudflare-credentials /etc/letsencrypt/cloudflare.ini \
  -d app.seudominio.com \
  -d "*.seudominio.com"

# Depois rode novamente para injetar no Nginx
sudo certbot install --nginx -d app.seudominio.com -d "*.seudominio.com"
```

Se nao usar Cloudflare, substitua pelo plugin DNS do seu provedor.

## DNS

Configure no painel do seu provedor de DNS:

| Tipo | Nome | Valor |
|------|------|-------|
| A | `app` | IP da VPS |
| A | `*` | IP da VPS |

## Variaveis de ambiente relacionadas

```env
SITE_BASE_DOMAIN="seudominio.com"
STATIC_SITES_DIR="./storage/sites"
STORAGE_DIR="./storage"
```

O `STATIC_SITES_DIR` dentro do container resolve para `/app/storage/sites`. O Nginx precisa acessar esse mesmo diretorio pelo path do host onde o volume Docker esta montado.
