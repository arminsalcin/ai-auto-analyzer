# AutoAnalyzer

<div align="center">

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)

</div>

## 📝 Opis

AutoAnalyzer je open-source web aplikacija koja omogućava automatsku analizu oglasa automobila sa OLX platforme. Aplikacija koristi napredne algoritme za ekstrakciju i analizu podataka iz oglasa, pružajući korisnicima detaljan uvid u karakteristike i stanje vozila.

## ✨ Funkcionalnosti

- 🔍 Automatska analiza OLX oglasa automobila
- 📊 Detaljna analiza specifikacija vozila
- 🖼️ Pregled i analiza slika vozila
- 📱 Responzivan dizajn za sve uređaje

## 🚀 Tehnologije

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express.js
- **API Integracija**: REST API
- **Sigurnost**: Rate limiting, Input validacija
- **Testing**: Jest, React Testing Library
- **CI/CD**: GitHub Actions

## 🛠️ Instalacija

### Preduslovi

- Node.js (v18 ili noviji)
- pnpm (v8 ili noviji)
- OpenAI API ključ

1. Klonirajte repozitorij:
```bash
git clone https://github.com/your-username/auto-analyzer.git
cd auto-analyzer
```

2. Instalirajte zavisnosti:
```bash
pnpm install
```

3. Podesite environment varijable:

Kreirajte `.env` fajl u `client` direktoriju:
```bash
VITE_API_BASE_URL=http://localhost:4000
```

Kreirajte `.env` fajl u `server` direktoriju:
```bash
OPENAI_API_KEY=your_openai_api_key
```

4. Pokrenite aplikaciju u development modu:
```bash
# Pokrenite oba projekta istovremeno iz root direktorija
pnpm run dev

# ILI pokrenite projekte pojedinačno

# Frontend
cd client
pnpm run dev

# Backend (u novom terminalu)
cd server
pnpm run dev
```

## 🤝 Doprinos projektu

Doprinosi su dobrodošli! Molimo vas da:

1. Forkujete repozitorij
2. Kreirate feature branch (`git checkout -b feature/amazing-feature`)
3. Commitajte vaše promjene (`git commit -m 'Add amazing feature'`)
4. Pushate na branch (`git push origin feature/amazing-feature`)
5. Otvorite Pull Request


## 🔒 Sigurnost

- Aplikacija implementira rate limiting za zaštitu API endpointa
- Sva korisnička input polja su validirana
- API ključevi se čuvaju sigurno u environment varijablama
- Implementiran CORS za dodatnu sigurnost

