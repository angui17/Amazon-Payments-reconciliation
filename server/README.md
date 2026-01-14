# Backend (Server) - Amazon Payments Reconciliation

This folder contains a boilerplate backend server intended to connect to an SAP HANA database (hdbstudio).

Setup:
- Copy `.env.example` to `.env` and fill with real credentials (do NOT commit `.env`).
- Install dependencies: `npm ci` inside `/server`.
- Start dev server: `npm run dev`.

Notes on SAP HANA:
- This scaffold uses `@sap/hana-client` as an example. Configure `server/src/db/client.js` according to your environment and credentials.
- HANA instance is external; docker-compose included only config for backend + redis (HANA not included).
