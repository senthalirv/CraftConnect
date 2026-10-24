# CraftConnect — Final Frontend Prototype

A clickable, frontend-only prototype for the CraftConnect human-powered creative commission marketplace. The existing Figma visual direction is preserved.

## Run locally

Requirements: Node.js 20.19+ or 22.12+ and npm.

1. Open this folder in VS Code.
2. Open **Terminal → New Terminal**.
3. Run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the localhost URL printed in the terminal (usually `http://localhost:5173`).

## Prototype features

- Landing page and creator discovery with search, category filters, and sorting
- Creator profile pages, portfolio samples, save creator, and commission request form
- Commission requests saved locally, project workspace, and demo status transitions: pending → accepted → in progress → delivered (or declined)
- Job board with search, category/budget filters, human-made filter, job posting, and saved jobs
- Proposal submission, proposal list, proposed price and delivery estimate
- Creator studio with locally saved service packages and portfolio entries
- Messages with locally saved demo conversations
- Reviews with selectable star rating and locally saved review entries
- Editable profile settings
- Notifications and Human-Made Policy pages
- Browser local storage for prototype data; data survives refresh in the same browser profile

## Important limitations

This is a prototype, not a production marketplace. There is no backend, real authentication, cross-device account, real file upload, payment processing, or actual external messaging. Demo data is stored in your browser's local storage and is not shared with another user or device. Use the app's browser storage controls if you want to reset the demo data.
