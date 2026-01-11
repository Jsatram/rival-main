# Rival

Rival is an opt-in Valorant stats tracking website.  
Only players who explicitly connect their Riot account will have their stats displayed.

This project is currently in early development and focuses on building a compliant, scalable foundation before full Riot Sign On (RSO) integration.

---

## Opt-In Policy (Important)

Rival **does not display stats for players who have not opted in**.

A player must:
1. Explicitly connect their Riot account
2. Grant permission via Riot authentication

If a player has not opted in, their stats and match history are **not visible** on Rival.

Players can disconnect their Riot account at any time, after which their data will no longer be displayed.

---

## Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **iron-session** (session management)
- **MongoDB** (planned)
- **Riot Games API** (pending re-approval + RSO)

---

## Getting Started (Local Development)

### Prerequisites
- Node.js 18+ (recommended: latest LTS)
- npm

### Install dependencies
```bash
npm install
