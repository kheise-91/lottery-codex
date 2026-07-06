# Lottery Codex

Web application that leverages historical lottery data to calculate optimized number combinations. Built with a PHP backend API and a React single-page frontend, it scrapes previous drawing results from the [Wisconsin Lottery](https://wilottery.com) and analyzes historical drawing data to generate optimized number combinations using pattern-analysis techniques inspired by the [Lottery Codex](https://lotterycodex.com) methodology.

## Supported Games

| Game | Numbers | Range | Draw Days |
|------|---------|-------|-----------|
| **Badger Five** | 5 | 1–31 | Daily |
| **Super Cash** | 6 | 1–39 | Daily |

## Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   React SPA      │────────▶│  PHP API         │────────▶│ wilottery.com   │
│  (frontend/)     │ ◀────── │  (backend/)      │ (CURL)  │  (scraping)     │
│                  │  JSON   │                  │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

- **Frontend** — React 18 + Vite + Tailwind CSS. Served as a PWA with offline caching.
- **Backend** — PHP 8.2+ powered by Slim Framework 4 (PSR-4 autoloading via Composer), REST JSON endpoints, and `simplehtmldom` for HTML parsing.
- **Data flow** — Backend scrapes Wisconsin Lottery draw history via CURL → analyzes odd/even and low/high patterns → generates prediction panels → serves results through a REST API → React renders the UI.

## How It Works

1. **Scrape** — The backend fetches recent drawing results from the Wisconsin Lottery website using CURL and HTML DOM parsing.
2. **Analyze** — Each historical drawing is classified by its odd/even and low/high distribution pattern (e.g., `3-Odd 2-Even / 3-Low 2-High`).
3. **Generate** — Based on selected patterns, the system generates unique number panels. Each ticket contains 5 panels split across 3 sub-patterns (3 + 1 + 1), with numbers drawn from constrained pools (low-odd, low-even, high-odd, high-even) to match the target distribution.

### Pattern System

Each game supports multiple patterns that define odd/even and low/high splits:

| Pattern | Odd/Even | Low/High |
|---------|----------|----------|
| 1 | 3-Odd 2-Even | 3-Low 2-High |
| 2 | 3-Odd 2-Even | 2-Low 3-High |
| 3 | 2-Odd 3-Even | 3-Low 2-High |

Numbers are categorized into four pools:
- **Low-Odd** — odd numbers in the lower half of the range
- **Low-Even** — even numbers in the lower half
- **High-Odd** — odd numbers in the upper half
- **High-Even** — even numbers in the upper half

Each sub-pattern specifies which pool each of the 5 (or 6) positions draws from, ensuring the final panel matches the target distribution.

## Project Structure

```
├── backend/
│   ├── api/                  # REST API router and controllers
│   ├── games/                # Game logic classes
│   │   ├── BadgerFive.php    # Badger Five game implementation
│   │   └── SuperCash.php     # Super Cash game implementation
│   ├── simplehtmldom/        # HTML parser library
│   ├── composer.json         # PHP dependencies
│   ├── composer.lock         # Locked dependency versions
│   └── vendor/               # Composer-installed dependencies (git-ignored)
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API client layer
│   │   ├── App.jsx           # Router and layout
│   │   └── main.jsx          # Entry point
│   ├── public/               # Static assets and PWA manifest
│   ├── vite.config.js        # Vite build config with API proxy
│   └── package.json          # Node.js dependencies
├── docker/                   # Docker configuration
├── docker-compose.yml        # Container orchestration
└── docs/                     # Project documentation
```

## Quick Start

### Prerequisites

- Docker and Docker Compose
- PHP 8.2+ (for local development without Docker)
- Composer (for backend dependency management)
- Node.js 18+ (for frontend development)

### With Docker

```bash
docker compose up --build
```

The application starts at `http://localhost:5959`.

### Local Development

**Backend:**

```bash
cd backend
composer install
php -S localhost:8000
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server proxies API requests to the backend.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/games` | List available games |
| GET | `/api/games/{gameId}` | Get game details and rules |
| GET | `/api/games/{gameId}/history` | Get historical drawing results |
| POST | `/api/generate` | Generate prediction panels |

### Generate Request

```json
{
  "game": "badger-five",
  "pattern": 1,
  "tickets": 3
}
```

### Generate Response

```json
{
  "panels": [
    {"numbers": [3, 8, 15, 22, 29], "subPattern": 1},
    {"numbers": [5, 10, 17, 24, 31], "subPattern": 1},
    {"numbers": [1, 6, 13, 20, 27], "subPattern": 1},
    {"numbers": [7, 12, 19, 26, 30], "subPattern": 2},
    {"numbers": [2, 9, 14, 23, 28], "subPattern": 3}
  ],
  "pattern": 1
}
```

## Frontend Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Game selection |
| `/games/:gameId` | Game Page | Tabbed view: previous drawings and panel generation |
| `/history/:gameId` | History | Full historical drawing browser |

## Technologies

- **Backend**: PHP 8.2+, Slim Framework 4, Composer (PSR-4), nikic/fast-route, CURL, simplehtmldom
- **Frontend**: React 18, Vite, Tailwind CSS v4, React Router v6, Headless UI, Heroicons
- **Infrastructure**: Docker, Nginx

## References

- [Wisconsin Lottery](https://wilottery.com) — Source of drawing data
- [Lottery Codex](https://lotterycodex.com) — Pattern analysis methodology

## License

MIT
