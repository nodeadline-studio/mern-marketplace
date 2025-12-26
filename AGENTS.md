# AGENTS.md — Service Marketplace

> Standardized instructions for AI coding agents working on this project.

## Dev Environment

- **Package manager**: npm
- **Install**: `npm install`
- **Build**: `npm run build`
- **Start dev server**: `npm run development`

## Testing

- **Command**: `npm test`
- **Coverage required**: 0% (Build first, then improve)
- **Pre-commit**: Always run `npm run lint` before committing

## QA Gates (Required Before "Done")

```bash
# Security + quality scan
npx ubon@latest scan --max-issues 10

# Must exit 0, no critical issues
```

## Current Focus

**DO**:
- **Fix Critical Dependencies**: [X] Resolved High/Critical vulnerabilities in `body-parser`, `express`, `mongoose`, `formidable`, and `vite`.
- **Verify Build**: [X] Ensured `npm run build` works after updates.
- **Maintain Compatibility**: [X] Updated `service.controller.js` for `formidable` 3.x support.
- **Accessibility**: [ ] Fix remaining 40+ accessibility issues (alt tags, etc.).

**DON'T**:
- Make claims without evidence (exit codes, screenshots, curl responses).
- Bundle unrequested "improvements".
- Modify files outside `asset-projects/service-marketplace` scope.

## Project-Specific Rules

- **MERN Stack**: Follow established patterns in `server/` (controllers/models) and `client/` (components).
- **Environment**: Use `.env` for all secrets and configuration.

## Known Issues / Tech Debt

- [x] **CRITICAL**: 10 High-severity dependency vulnerabilities.
- [ ] **WARNING**: 81 total security/accessibility issues.
- [ ] **ARCHITECTURE**: Lack of real unit/integration tests.

## Canonical Docs

- **Status**: `asset-projects/service-marketplace/docs/STATUS.md`
- **Plan**: `asset-projects/service-marketplace/docs/PLAN.md`
- **Context**: `asset-projects/service-marketplace/PROJECT_CONTEXT.md`

