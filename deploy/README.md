# Deploying Petals for Her with Caddy (Hetzner)

Deploy the app to a server (e.g. Hetzner) with **Caddy** as the reverse proxy (HTTPS + static frontend + API proxy).

## Server setup (once)

1. **SSH access**  
   Add the server to `~/.ssh/config`, e.g.:
   ```
   Host petals
     HostName YOUR_SERVER_IP
     User root
     IdentityFile ~/.ssh/your_key
   ```

2. **On the server**
   - Install Docker and Docker Compose.
   - Clone the repo (e.g. to `/opt/petals-for-her`):
     ```bash
     git clone https://github.com/your-org/petals-for-her.git /opt/petals-for-her
     cd /opt/petals-for-her
     ```

3. **Environment**
   - Copy `deploy/.env.production.example` to `.env.production` in the project root.
   - Set real values:
     - `SECRET_KEY_BASE`: `rails secret`
     - `RAILS_MASTER_KEY`: contents of `config/master.key`
     - `DATABASE_PASSWORD`: strong password
     - `DEVISE_JWT_SECRET_KEY`: e.g. `openssl rand -hex 32`
     - `APP_HOST`: your domain (e.g. `petalsforher.com`), no `https://`

4. **Caddyfile**
   - Edit `deploy/Caddyfile` and replace `petalsforher.com www.petalsforher.com` with your domain(s).

5. **DNS**
   - Point your domain’s A (and AAAA) records to the server’s IP.

## Deploy from your machine

From the project root:

```bash
chmod +x deploy/release.sh
./deploy/release.sh petals
```

This will:

- Build the frontend (`frontend/dist`)
- Rsync `frontend/dist` to `petals:/opt/petals-for-her/deploy/frontend-dist/`
- Rsync `deploy/Caddyfile` (and env example) to the server
- On the server: `docker compose -f docker-compose.prod.yml build web && docker compose -f docker-compose.prod.yml up -d`
- Run migrations

Default SSH host is `petals`; override with:

```bash
./deploy/release.sh user@your-server.com
```

Set `APP_DIR` if the app lives elsewhere on the server:

```bash
APP_DIR=/home/app/petals-for-her ./deploy/release.sh petals
```

## First time on the server (without release script)

If you prefer to run everything on the server:

```bash
cd /opt/petals-for-her
cp deploy/.env.production.example .env.production
# edit .env.production with real secrets and APP_HOST

# Build frontend on the server (or copy frontend/dist from your machine)
cd frontend && npm ci && npm run build && cd ..

# Put built files in deploy/frontend-dist (or rsync from local)
mkdir -p deploy/frontend-dist
cp -r frontend/dist/* deploy/frontend-dist/

docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml exec web bundle exec rails db:prepare
```

## Useful commands on the server

```bash
cd /opt/petals-for-her

# Logs
docker compose -f docker-compose.prod.yml logs -f
docker compose -f docker-compose.prod.yml logs -f caddy
docker compose -f docker-compose.prod.yml logs -f web

# Restart after config change
docker compose -f docker-compose.prod.yml restart caddy

# Rails console
docker compose -f docker-compose.prod.yml exec web bundle exec rails console

# Migrations
docker compose -f docker-compose.prod.yml exec web bundle exec rails db:migrate
```

## Stack

- **db**: PostgreSQL 16
- **web**: Rails API (Puma on port 3000)
- **caddy**: Reverse proxy on 80/443; serves static frontend from `deploy/frontend-dist`, proxies `/api` and `/up` to `web:3000`; automatic HTTPS via Let’s Encrypt
