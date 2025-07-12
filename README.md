# LJADS

Introducting LJADS, a awesome easy download system that includes time limits. (And a basic anubis setup to prevent bots, also, you can turn on captchas!)

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

### Pull the anubis config

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
Add-Content -Path ".env" -Value "POSTGRES_USER=u$([System.Convert]::ToHexString([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(5)))"
Add-Content -Path ".env" -Value "POSTGRES_PASSWORD=$([Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(36)))"
Add-Content -Path ".env" -Value "POSTGRES_DB=main"
```

If you want to add captchas, this feature is still in beta, add with caution.

```bash
echo ENABLE_CAPTCHA=true >> ./.env
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
