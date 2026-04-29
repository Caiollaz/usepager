# Nginx Wildcard Static Sites

Exemplo para servir os sites publicados por subdomínio em produção.

```nginx
server {
  listen 80;
  server_name ~^(?<site>[^.]+)\.seudominio\.com$;

  root /var/www/pro-pages/sites/$site;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html =404;
  }

  location /uploads/ {
    try_files $uri =404;
  }
}
```

Configure no app:

```env
SITE_BASE_DOMAIN="seudominio.com"
STATIC_SITES_DIR="/var/www/pro-pages/sites"
STORAGE_DIR="/var/www/pro-pages/storage"
```

Garanta que o usuário do processo Next tenha permissão de escrita em `STATIC_SITES_DIR` e `STORAGE_DIR`.
