# FitDoplnky.sk

Web postavený na Next.js a headless WordPress.

## 🛠️ Technológie

- **Frontend:** Next.js
- **Backend:** WordPress (headless)
- **Boilerplate:** [next-wp](https://github.com/9d8dev/next-wp)

## 📋 Prerekvizity

- Node.js 18+ 
- WordPress inštalácia s REST API
- Povolené CORS na WordPress strane
- npm alebo yarn

## ⚙️ Inštalácia

1. Naklonovať repozitár:
```bash
git clone [url-repositara]
cd fitdoplnky
```

2. Inštalácia závislostí:
```bash
npm install
# alebo
yarn install
```

3. Nastaviť environment premenné:
Vytvorte `.env.local` súbor s nasledujúcimi premennými:
```
WORDPRESS_API_URL=https://[vasa-wp-domena]/wp-json
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🚀 Spustenie

Development server:
```bash
npm run dev
# alebo
yarn dev
```

Build pre produkciu:
```bash
npm run build
npm run start
# alebo
yarn build
yarn start
```

## 🌐 API Endpointy

Hlavné WordPress REST API endpointy:

- `/wp-json/wp/v2/posts` - Články
- `/wp-json/wp/v2/pages` - Stránky
- `/wp-json/wp/v2/products` - Produkty
- `/wp-json/wc/v3/` - WooCommerce API (ak je použitý)

## 📂 Štruktúra Projektu

```
fitdoplnky/
├── components/      # React komponenty
├── lib/            # Utility funkcie
├── pages/          # Next.js stránky
├── public/         # Statické súbory
├── styles/         # CSS štýly
└── types/          # TypeScript definície
```

## 📝 Development Guidelines

- Používať TypeScript pre type safety
- Implementovať SEO best practices
- Používať CSS Modules alebo Tailwind CSS pre štýlovanie
- Implementovať lazy loading pre obrázky
- Optimalizovať WordPress queries

## 📈 Performance Optimalizácia

- Implementovaný ISR (Incremental Static Regeneration)
- Optimalizované obrázky cez next/image
- Caching WordPress API responses
- Minimalizovaný JavaScript bundle

## 🤝 Prispievanie

1. Fork repozitára
2. Vytvoriť feature branch
3. Commit zmeny
4. Push do branchu
5. Vytvoriť Pull Request

## 📜 Licencia

[Typ licencie]

## 🆘 Podpora

Pre podporu kontaktujte: ahoj@andrejsrna.sk