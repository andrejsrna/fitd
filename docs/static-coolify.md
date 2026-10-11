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

## Produkčná cache v Coolify

Aktuálna produkčná aplikácia používa Nginx konfiguráciu z
`deploy/static-coolify-nginx.conf`. Jej obsah nastav v Coolify ako
**Custom Nginx Configuration**; samotný súbor v repozitári Coolify automaticky
nenačíta. Po zmene konfigurácie aplikáciu znovu nasaď.

- `/_next/static/`: `Cache-Control: public, max-age=31536000, immutable`.
- HTML a neverzované súbory nedostávajú ročnú cache.
- Neexistujúce build súbory vracajú 404 bez ročnej cache.
- Cloudflare Browser Cache TTL musí rešpektovať hlavičky originu, prípadne
  používať ročnú cache pravidlo obmedzené na `/_next/static/`.

Táto konfigurácia zachováva aktuálne produkčné routovanie; nižšie uvedený
`static-main-nginx.conf` je samostatný návrh legacy presmerovaní.

## Dôležité

Legacy WordPress URL už nerieši Next middleware. Pri statickom deployi ich musí riešiť webserver.

- Pre hlavnú doménu použi pravidlá z `deploy/static-main-nginx.conf`
- Pre `admin.fitdoplnky.sk` redirector použi `deploy/static-admin-redirect.conf`

## Čo tieto pravidlá robia

- staré `/wp-content/uploads/...` presmerujú na CDN
- staré `/obchod/...`, `/produkt/...`, `/kategoria-produktu/...`, `/tag/...`, `/author/...`, `/znacka/...` pošlú na statické fallback stránky
- staré single-segment článkové URL typu `/<slug>` presmerujú na `/clanky/<slug>/`
