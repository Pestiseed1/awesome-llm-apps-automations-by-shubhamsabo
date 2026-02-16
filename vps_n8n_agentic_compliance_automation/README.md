# VPS + n8n Agentic Compliance Automation MVP

Production-ready MVP blueprint for a pest-control compliance system running fully on an Ubuntu 24.04 VPS with Docker + n8n queue mode.

## Included Modules

- `backend/`: Express + Prisma API with JWT-protected routes, product sync endpoint, invoice snapshots, Slack interaction validation, signature ingestion, and PDF generation.
- `frontend/`: Next.js dashboard + invoice editor pages with compliance form sections and signature canvas.
- `infra/nginx/`: Reverse-proxy configuration for frontend/API/existing n8n subdomain.
- `infra/scripts/backup-db.sh`: Daily PostgreSQL backup helper.
- `n8n-workflow-example.json`: Weekly product sync workflow template.

## Security Checklist

1. JWT auth enforced on invoice create/signature and product sync endpoints.
2. Slack request signature verification included at `/api/slack/interactions`.
3. PostgreSQL attached only to internal docker network.
4. HTTPS termination via Nginx + Let's Encrypt certbot sidecar.
5. Apply UFW:
   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw enable
   ```

## Deployment (Ubuntu 24.04)

1. Copy project to VPS.
2. `cp .env.example .env` and fill secrets.
3. Build and start stack:
   ```bash
   docker compose up -d --build
   ```
4. Generate initial certs:
   ```bash
   docker compose run --rm certbot certonly --webroot -w /var/www/certbot -d domain.com -d api.domain.com -d n8n.domain.com --email you@domain.com --agree-tos --no-eff-email
   ```
5. Reload Nginx:
   ```bash
   docker compose restart nginx
   ```
6. Run DB migrations:
   ```bash
   docker compose exec backend-api npx prisma migrate deploy
   ```
7. Configure cron backup:
   ```bash
   crontab -e
   0 2 * * * POSTGRES_USER=compliance_user POSTGRES_DB=compliance /path/to/infra/scripts/backup-db.sh
   ```

## API Endpoints

- `POST /api/invoices` (JWT): creates Draft invoice, snapshots products, transitions to `PendingApproval`, posts Slack summary.
- `POST /api/invoices/actions`: approve/edit/reject workflow transitions.
- `POST /api/invoices/signature` (JWT): stores signature PNG + timestamp + IP.
- `POST /api/products/sync` (JWT): weekly regulatory sync endpoint (for n8n).
- `POST /api/slack/interactions`: validates Slack signing signature.

## Tests

Run inside backend:

```bash
npm test
```

Test coverage includes:

- Invoice snapshot integrity
- Slack interaction block composition
- Product sync comparison logic
- PDF generation output
- Signature capture persistence

## Notes

- Invoice compliance fields are immutable snapshots (`InvoiceProductSnapshot`) and are never re-read from live product rows after invoice creation.
- Slack failures are handled gracefully and do not block invoice creation.
- Product sync errors return 503 and avoid crashing the backend process.
- Product sync should be triggered from n8n schedule only, independent of invoice creation flow.
