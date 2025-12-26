Plan (tasks → subtasks), optimized for agent execution with human QA checkpoints noted
1) Service search & core backend correctness (P0) — DONE (backend); remaining: pagination + manual QA
✅ Search now uses text index on title/description/tags and /api/services/search is routed to the same controller.
✅ Filters honor category/status/featured using correct fields; non-specified featured is ignored.
⚠️ Pagination still pending; needs manual QA in UI (varied terms/categories).
2) Order model + service order flow (P0) — DONE (backend + frontend API); remaining: manual QA
✅ Order model redesigned: single service ref, requirements, deliveryDeadline, revisionsUsed, status enum (pending|in_progress|delivered|completed|cancelled).
✅ Order controller/routes updated: create/listByBuyer/listBySeller/updateStatus endpoints, removed product/shop dependencies.
✅ Frontend API updated: api-order.js uses new service-centric endpoints.
⚠️ Manual QA needed: create order from service detail, confirm stored fields and status transitions.
3) Remove product/cart remnants from service UI (P0/P1) — DONE; remaining: manual QA
✅ Service detail: replaced AddToCart with OrderService component (dialog with requirements/deadline).
✅ Services.js grid: removed cart button from tiles.
✅ Service forms already capture requirements/tags/status/featured (verified in NewService.js).
⚠️ Manual QA needed: create/edit service with image + tags; verify list/detail render; test order flow.
4) Config and env alignment (P0) — DONE; remaining: manual QA
✅ config/config.js: port 5000, DB service-marketplace, FRONTEND_URL, JWT/Stripe envs from process.env.
✅ Created server/.env.example and client/.env.example with correct defaults.
✅ Created config/index.js to export API base URL (uses REACT_APP_API_URL or defaults to localhost:5000/api).
⚠️ Manual QA needed: spin backend/frontend with matching envs; verify no 3000/mernproject drift.
5) Dependency/stack modernization to promised 1.0 (P1)
Plan and apply upgrades: React 18, React Router 6, Stripe @stripe/react-stripe-js, Node 18 engines, Webpack→Vite (or modern Webpack 5), ESLint/Prettier config.
Replace Material-UI v4 with Tailwind (or stage MUI→Tailwind migration in slices).
Run lint/build/test after each upgrade step; fix breaking router changes (Switch→Routes, etc.).
Manual QA: smoke UI after router upgrade; verify styling parity post-Tailwind.
6) Stripe/payment path refresh (P1/P2)
Migrate to modern Stripe SDK on client and server; add PaymentIntent + webhook stubs; ensure secret/public keys from env.
Define escrow/payout placeholders aligned to services (no quantities).
Manual QA: test with Stripe test keys via dashboard; validate webhook receipt and status updates.
7) Seller profile & ACL tightening (P1)
Enforce seller ownership on service update/delete and list-by-seller routes; add role check if available.
Ensure seller link in UI routes to seller profile; add placeholder page if missing.
Manual QA: attempt cross-user edit/delete to confirm 403s.
8) Search/filter UX polish (P2)
Add category/price/delivery-time filters to UI; connect to updated API query params.
Add empty-state and loading states; ensure tags displayed.
Manual QA: multi-filter searches across breakpoints (375/768/1024/1440).
9) QA automation + smoke tests (P2)
Add minimal API integration tests for service CRUD/search and order creation.
Add lint/type/test scripts to root/package as needed; wire CI (GitHub Actions) to run.
Agent-run: execute lint/test in CI; capture exit codes.
10) Docs & assets (P2)
Update docs: setup, env, API endpoints, service order flow, Stripe setup, migration notes, FAQ.
Add Week2 QA/Progress docs and checklist updates.
Manual QA: review docs for accuracy; prepare marketplace screenshots list.
11) Release packaging (P3)
Production build scripts (client/server); Dockerfile refresh with Node 18.
Verify dist SSR path still works or switch to SPA serve via Vite build + Express API.
Manual QA: full end-to-end run in production mode; capture final screenshots/video.
If you want, I can start with P0 fixes (search query + order model refactor) and deliver a minimal PR plus a short QA script to validate in the browser.