# FitDoplnky: lokálny experiment critical CSS

## Rozsah
- Produkcia sa nemenila. NPM závislosti experimentu sú iba v scratch adresári.
- `npm run build:static` prešiel vrátane lint/type kontroly.
- Beasties 0.5.4 spracovalo 748 HTML súborov v samostatnej kópii exportu.
- Pôvodné zdieľané CSS súbory zostali nedotknuté; vložené pravidlá pokrývajú celý dokument, nie iba prvý viewport.

## Posledné meranie
Chromium/Playwright, mobil 390 × 900, tri behy na variant, 150 ms latencia, 200000 B/s download, CPU 4× slowdown. CDN obrázky a ostatné HTTPS požiadavky boli blokované rovnako pre oba varianty. Route interception vypína cache. Ide o syntetický lokálny test, nie PageSpeed skóre ani meranie reálnej produkcie.

| Metrika, medián | Pôvodný export | Critical CSS |
|---|---:|---:|
| FCP | 1452 ms | 736 ms |
| LCP | 1504 ms | 736 ms |
| CLS | 0.0813346 | 0.0815509 |

Meranie LCP zahŕňa aktuálny cookie dialóg; nejde o izolované meranie hero obsahu.

Domovská HTML odpoveď gzip: 6464 → 12238 bajtov. Inline CSS: 35287 bajtov pred kompresiou.

## Funkčné a vizuálne kontroly
- Mobilné menu sa otvorilo na oboch variantoch po odmietnutí cookies.
- Kontrola vypnutého JavaScriptu vrátila očakávanú Inter font-family; úplný vizuálny test bez JS nebol vykonaný.
- 16 screenshot porovnaní: 4 šablóny × 2 šírky × 2 farebné schémy.
- Posledný beh: 15 porovnaní bez rozdielu nad toleranciou 10 RGB; mobilný článok v dark režime mal 344683 odlišných pixelov.
- Predchádzajúce behy mali iné rozdiely (mobilné články/kontakt). Výsledok vizuálneho testu teda nie je stabilný.
- React hydration error #423 sa objavuje pri článku a kontakte aj v pôvodnom exporte, aj v optimalizovanom.

## Záver
Prvý paint má v tomto teste výrazný potenciál zrýchlenia, no kandidát NIE JE overený na nasadenie. Najprv treba stabilizovať baseline hydratáciu/tému a opakovať vizuálne kontroly. Žiadny commit, push ani nasadenie experimentu sa nevykonali.
