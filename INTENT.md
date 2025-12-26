# Intent Specification: Service Marketplace

> Sober, evidence-based project assessment as of 2025-12-26.

## What We're Building

A modern Service Marketplace template (MERN stack) for building freelance and professional service platforms.

## Success Criteria

- [ ] **Zero Critical/High Vulnerabilities**: Pass `ubon scan` with 0 OSV/High severity issues.
- [ ] **Functional Build**: `npm run build` exits 0 for both client and server.
- [ ] **Clean Prototyping**: No mock data leaks or hardcoded secrets in production-ready files.
- [ ] **Test Coverage**: Real unit/integration tests for auth and payment logic (Stripe).

## Explicitly Out of Scope

- Not building custom auth (using JWT/Bcrypt).
- Not integrating alternative payment providers yet (Stripe only).
- Not optimizing for SEO until core marketplace flow is secure.

## Current Status Assessment

| Aspect | Objective Reality | Evidence |
|--------|-------------------|----------|
| Core functionality | Partial (Base MERN setup) | Files present in `server/` and `client/` |
| Revenue path | Blocked (Stripe logic incomplete) | Code audit of `server/controllers/order.controller.js` |
| Technical debt | **EXCEPTIONAL (High Risk)** | **Ubon scan: 150+ issues (10 Critical/High)** |
| Test coverage | 0% | `npm test` passes with no tests |

## Assumptions That Need Verification

1. Assumption: Dependency vulnerabilities can be fixed with simple upgrades.
   Verification: Run `npm audit fix` and `ubon scan` again.

2. Assumption: Stripe integration is "drop-in" ready.
   Verification: Test E2E payment flow with Stripe CLI.

## Evidence Log

| Date | Claim | Evidence | Verified By |
|------|-------|----------|-------------|
| 2025-12-26 | **High Security Risk Found** | `ubon scan` exit code 1 (150 issues) | Antigravity AI |
| 2025-12-26 | MERN boilerplate present | `package.json` + `server`/`client` dirs | Antigravity AI |

