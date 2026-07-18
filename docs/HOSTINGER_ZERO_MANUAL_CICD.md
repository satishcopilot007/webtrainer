# Hostinger Zero-Manual Deployment (GitHub Actions)

This project is configured to auto-deploy to Hostinger whenever code is pushed to `main`.

## What this automation does

- Builds frontend from `frontend/`.
- Uploads build output to `public_html/`.
- Uploads PHP backend from `backend-php/` to `public_html/api/`.

## One-time setup in GitHub

Go to repository settings:

- `Settings` -> `Secrets and variables` -> `Actions` -> `New repository secret`

Create these 3 secrets:

- `HOSTINGER_FTP_HOST` (example: `ftp.yourdomain.com` or Hostinger FTP host)
- `HOSTINGER_FTP_USERNAME`
- `HOSTINGER_FTP_PASSWORD`

## First deployment test

1. Push any commit to `main`.
2. Open `Actions` tab in GitHub.
3. Verify workflow `Hostinger Zero-Manual Deploy` succeeds.
4. Open your website and test:
   - home page
   - one API endpoint under `/api`
   - payment order creation
   - UPI QR flow

## Important notes

- Keep production values in Hostinger `public_html/api/.env`.
- The workflow excludes `.env` from upload, so your live secrets are not overwritten.
- Uploaded user files in `public_html/api/uploads/` are not deleted by workflow.

## Manual rerun

If needed, run from GitHub Actions:

- Open workflow `Hostinger Zero-Manual Deploy`
- Click `Run workflow`
