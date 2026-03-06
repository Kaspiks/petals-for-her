# Finish setup – petalsforher.com live

DNS for **petalsforher.com** is set in Namecheap. Complete these steps to go live.

---

## 1. On the server (one-time)

SSH in (use your actual host if not `petals`):

```bash
ssh petals
```

Then:

```bash
# If not done yet: clone and enter app
git clone https://github.com/Kaspiks/petals-for-her.git /opt/petals-for-her
cd /opt/petals-for-her

# Create .env.production with generated secrets
bash deploy/setup-server.sh

# Edit and add RAILS_MASTER_KEY (from your local config/master.key)
nano .env.production
# Set: RAILS_MASTER_KEY=<paste from config/master.key>
# Optional: SMTP_ADDRESS, SMTP_USER_NAME, SMTP_PASSWORD for email
# Save and exit (Ctrl+O, Enter, Ctrl+X)
```

Ensure Docker and Docker Compose are installed. If not:

```bash
apt-get update && apt-get install -y docker.io docker-compose-plugin
```

---

## 2. From your local machine

In the **petals-for-her** repo on your Mac:

```bash
cd /Users/kaspars.minajevs/Documents/personal_proj/petals-for-her
chmod +x deploy/release.sh
./deploy/release.sh petals
```

This will:

- Build the frontend and sync it to the server  
- Sync the Caddyfile  
- Build and start the stack on the server (db, web, caddy)  
- Run migrations  

---

## 3. Check

- **https://petalsforher.com** — site and API should load; Caddy will get a Let’s Encrypt cert automatically.
- If the domain doesn’t resolve yet, wait a few minutes for DNS.

**Useful on the server:**

```bash
cd /opt/petals-for-her
docker compose -f docker-compose.prod.yml --env-file .env.production logs -f
```

---

## If the repo is already cloned on the server

Pull latest and run release from local:

```bash
# On server
cd /opt/petals-for-her && git pull

# On local
./deploy/release.sh petals
```

If `.env.production` is missing on the server, run there:

```bash
cd /opt/petals-for-her && bash deploy/setup-server.sh
```

Then add `RAILS_MASTER_KEY` (and optional SMTP) and run `./deploy/release.sh petals` from local again.
