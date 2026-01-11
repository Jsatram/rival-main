# Rival

Rival is an opt-in Valorant stats tracking website.
Only players who explicitly connect their Riot account will have their stats displayed.

This project is currently in early development and focuses on building a compliant, scalable foundation before full Riot Sign On (RSO) integration.

---

## Opt-In Policy (Important)

Rival does not display stats for players who have not opted in.

A player must:
1. Explicitly connect their Riot account
2. Grant permission via Riot authentication

If a player has not opted in, their stats and match history are not visible on Rival.

Players can disconnect their Riot account at any time, after which their data will no longer be displayed.

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- iron-session (session management)
- MongoDB (planned)
- Riot Games API (pending re-approval and RSO)

---

## Getting Started (Local Development)

### Prerequisites
- Node.js 18 or newer (latest LTS recommended)
- npm

### Install dependencies

npm install

### Environment variables

Create a file named `.env.local` in the project root with the following contents:

SESSION_SECRET=your-random-32-character-string

### Riot RSO
- `RIOT_CLIENT_ID` — Riot application client ID
- `RIOT_CLIENT_SECRET` — Riot application client secret
- `RIOT_REDIRECT_URI` — OAuth callback URL

### Development
- `MOCK_RIOT` — Enables mocked Riot authentication for local development

Do not commit `.env.local`. It is ignored by git.

### Run the development server

npm run dev

Open the app at:

http://localhost:3000

---

## Available Routes

- / — Home
- /search — Player search (stub)
- /login — Riot account opt-in explanation
- /account — Connected and disconnected account states

---

## Authentication Status

Riot Sign On (RSO) is required before production API access.

Current status:
- Session handling is implemented
- Login flow is stubbed
- No Riot API calls are made yet

The project is intentionally structured to make RSO integration straightforward once access is approved.

---

## Development Notes

- Dev-only API routes live under src/app/api/dev and are ignored by git
- Global styling is handled via Tailwind CSS and CSS variables
- Dark mode is enabled by default

---

## Disclaimer

Rival is not affiliated with or endorsed by Riot Games.
Valorant and Riot Games are trademarks or registered trademarks of Riot Games, Inc.

---

## License

MIT
