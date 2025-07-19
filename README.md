<div align="center">
<img src="./.github/README/heading.jpg" width="100%">
</div>

# LJADS
## Design files:
Figma: https://www.figma.com/design/N18ucQnEI1kCp5AeV1mKwD/Untitled?node-id=0-1&t=atxFRlNvtFrmOR8p-1

Introducting LJADS, a awesome easy download system that includes time limits. (And a basic anubis setup to prevent bots, also, you can turn on captchas!)

## Limitations:
The max monitor count is `26437` on Debian Linux and `10415` on MacOS

## Testing Server:
For demoing, you can use https://ljads-demo.yuanhau.com for testing, before you load it on to your own server. (Although, if you have docker compose installed it only takes 3 minute to set it up with cloudflared and Anubis)

## The stack:

- Bun
- Postgres
- React
- TailwindCSS

## Self host it!

psst, if you are on Windows, please install curl and add .exe to each command, or else Windows will just use Invoke-WebRequest instead of curl.

### Pull the docker compose file

```bash
curl -O  https://raw.githubusercontent.com/hpware/download_dynamic/refs/heads/master/docker-compose.yml
```

### Pull the anubis config (If you enable it)

```bash
curl https://raw.githubusercontent.com/hpware/download_dynamic/refs/heads/master/anubis_botPolicy.yaml --output botPolicy.yaml
```

### Generate .env Values

For Mac/Linux

```bash
echo POSTGRES_USER=u$(openssl rand --hex 5) >> ./.env
echo POSTGRES_PASSWORD=$(openssl rand --base64 48) >> ./.env
echo POSTGRES_DB=main >> ./.env
```

For Windows Users (AI Generated)

```powershell
$bytes = New-Object byte[] 5
(New-Object System.Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes)
$hexString = ($bytes | ForEach-Object { '{0:X2}' -f $_ }) -join ''
Add-Content -Path ".env" -Value "POSTGRES_USER=u$hexString"
$bytes = New-Object byte[] 36
(New-Object System.Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes)
$base64String = [Convert]::ToBase64String($bytes)
Add-Content -Path ".env" -Value "POSTGRES_PASSWORD=$base64String"
Add-Content -Path ".env" -Value "POSTGRES_DB=main"
```

## Add captcha support (Cloudflare Turnstile)

```bash
echo ENABLE_CAPTCHA=true >> ./.env
echo CF_TURNSTILE_SITE_KEY="<<YOUR_SITE_KEY" >> ./.env
echo CF_TURNSTILE_SECRET_KEY="<<YOUR_TURNSTILE_KEY>>" >> ./.env
```

## Other Configs

### Add Copyright Info
```bash
echo COPYRIGHT_OWNER="<<YOUR_COPYRIGHT_INFO>>" >> ./.env
```

### Client (per browser) create download request limit (not working)
```bash
echo CLIENT_DOWNLOAD_LIMIT=5 >> ./.env
```

### Limit every download link can only be used at the client that created it.
```bash
echo LIMIT_TO_PER_CLIENT=true >> ./.env
```

## BYO INDEX
You can bring you own index file :)
```yaml
- "./index.html:/app/html/index.html"
```
an pull
```bash
curl https://raw.githubusercontent.com/hpware/download_dynamic/refs/heads/master/custom_html_template.html --output index.html
```
to get started!
