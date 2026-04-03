# FitDoplnky static deploy v Coolify

Projekt je pripravený na čistý static export cez `next build`.

## Build

Použi:

```bash
npm install
npm run build:static
```

Výstup vznikne v adresári `out/`.

## Coolify app nastavenie

- Build Pack: `nixpacks`
- Install Command: `npm install`
- Build Command: `npm run build:static`
- Publish Directory: `out`
- Is it a static site?: `yes`

## Dôležité

Legacy WordPress URL už nerieši Next middleware. Pri statickom deployi ich musí riešiť webserver.

- Pre hlavnú doménu použi pravidlá z `deploy/static-main-nginx.conf`
- Pre `admin.fitdoplnky.sk` redirector použi `deploy/static-admin-redirect.conf`

## Čo tieto pravidlá robia

- staré `/wp-content/uploads/...` presmerujú na CDN
- staré `/obchod/...`, `/produkt/...`, `/kategoria-produktu/...`, `/tag/...`, `/author/...`, `/znacka/...` pošlú na statické fallback stránky
- staré single-segment článkové URL typu `/<slug>` presmerujú na `/clanky/<slug>/`
