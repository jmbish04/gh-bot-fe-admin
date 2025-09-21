# GitHub Bot Frontend Admin Dashboard

GitHub Bot Frontend Admin Dashboard is an Astro 5 + React 19 web application that provides an admin interface for managing the Colby GitHub Bot API. The dashboard allows monitoring GitHub workflows, managing research operations, and interacting with AI-powered code analysis features.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Prerequisites and Setup
- **Node.js 18+** is required - use `node --version` to verify
- **npm** package manager - `npm --version` to verify
- Access to GitHub Bot API at `https://gh-bot.hacolby.workers.dev`

### Bootstrap the Repository
Run these commands in exact order:

1. **Install dependencies** (uses React 19 compatibility workaround):
   ```bash
   npm install --legacy-peer-deps
   ```
   - NEVER use `npm install` without `--legacy-peer-deps` - it will fail due to React 19 compatibility issues
   - Takes ~30 seconds to complete

2. **Build the application**:
   ```bash
   npm run build
   ```
   - Build takes ~11 seconds. NEVER CANCEL. Set timeout to 60+ seconds for safety.
   - Produces both server-side (Cloudflare Workers) and client-side bundles
   - Creates `dist/` directory with production assets

3. **Prepare for development**:
   ```bash
   npm run wrangler:wrapper
   ```
   - Copies `src/workflows/wrapper.js` to `dist/index.js` (required for Cloudflare Workers)
   - Takes <1 second

### Development Server
**Run the development server**:
```bash
npx wrangler dev --port 4321
```
- Starts Cloudflare Workers development server with Astro SSR
- Takes ~20 seconds to start. NEVER CANCEL. Set timeout to 60+ seconds.
- Server runs on `http://localhost:4321`
- Warnings about `workers.cloudflare.com` are normal in development environment
- Application redirects from `/` to `/admin` automatically

**Alternative development command** (includes build):
```bash
npm run dev
```
- Runs build + wrangler:wrapper + wrangler dev in sequence
- Use this if you need a fresh build before starting dev server

## Validation and Testing

### Manual Functional Testing
**ALWAYS run these validation steps after making changes:**

1. **Navigate to dashboard**: `http://localhost:4321` → should redirect to `/admin`
2. **Test all navigation pages**:
   - Dashboard: `http://localhost:4321/admin` 
   - Research: `http://localhost:4321/admin/research`
   - Commands: `http://localhost:4321/admin/commands`
   - Best Practices: `http://localhost:4321/admin/practices`
   - Operations: `http://localhost:4321/admin/operations`
3. **Verify UI elements**:
   - Navigation sidebar works
   - Dashboard statistics cards display
   - Page titles update correctly
   - Theme toggling (system/light/dark) works

**Expected behavior with API unavailable**:
- Console errors like "No QueryClient set" and "Minified React error #185" are normal
- Pages load with navigation and layout intact
- Data sections show loading/error states gracefully

### Automated Testing
**No test infrastructure is currently present in this repository.** The application relies on manual functional testing and build validation.

### Linting and Code Quality
**Current state**: The codebase has TypeScript errors and formatting issues that exist in the current working version.

**Available quality tools**:

```bash
# Check TypeScript compilation (currently has ~93 errors - this is expected)
npx tsc --noEmit

# ESLint - no configuration file present, will fail
npx eslint src --ext .ts,.tsx,.js,.jsx --max-warnings 0

# Check Prettier formatting (currently has issues in 21 files - this is expected)
npx prettier --check src --ignore-unknown

# Auto-fix Prettier formatting issues
npx prettier --write src --ignore-unknown
```

**Note**: The current codebase has pre-existing TypeScript errors and formatting issues. These do not prevent the application from building and running correctly. Only fix linting/formatting issues directly related to your changes.

### Deployment Validation
**Test deployment readiness**:
```bash
# Manual dry-run (recommended)
npm run build && npm run wrangler:wrapper && npx wrangler deploy --dry-run
```

**Note**: The `npm run check` script requires `pnpm` which may not be available. Use the manual commands above instead.

## API Integration

### External Dependencies
- **GitHub Bot API**: `https://gh-bot.hacolby.workers.dev`
- **OpenAPI Specification**: Available at `/openapi.json`
- **API Authentication**: Uses `GITHUB_BOT_API_TOKEN` environment variable

### API Error Handling
- Application gracefully handles API unavailability
- React Query provides caching and error boundaries
- Console errors during API failures are expected and do not break functionality

## Key Architecture Components

### Technology Stack
- **Frontend Framework**: Astro 5 with React 19 integration
- **Deployment Platform**: Cloudflare Workers/Pages
- **State Management**: Zustand + React Query
- **Styling**: TailwindCSS + shadcn/ui components
- **API Client**: Axios with interceptors

### Important File Locations
- **API Services**: `src/lib/services/github-bot-api.ts`
- **React Query Hooks**: `src/hooks/useGitHubBotAPI.ts` 
- **Type Definitions**: `src/types/api.ts`
- **Main Layout**: `src/layouts/MainLayout.astro`
- **Page Components**: `src/pages/admin/` directory
- **Cloudflare Config**: `wrangler.jsonc`
- **Build Config**: `astro.config.mjs`

### Build Output Structure
- **Server Bundle**: `dist/_worker.js/` (Cloudflare Workers runtime)
- **Client Assets**: `dist/_astro/` (Static CSS/JS for browsers)
- **Worker Entry**: `dist/index.js` (Generated by wrangler:wrapper script)

## Common Tasks

### Adding New Admin Pages
1. Create new `.astro` file in `src/pages/admin/`
2. Add navigation link in main layout
3. Update API types and hooks if needed
4. Test all pages load correctly

### Modifying API Integration
1. Update types in `src/types/api.ts`
2. Modify service methods in `src/lib/services/github-bot-api.ts`
3. Update React Query hooks in `src/hooks/useGitHubBotAPI.ts`
4. Test with API unavailable to ensure graceful error handling

### Deployment Workflow
1. Build and validate locally: `npm run build && npm run wrangler:wrapper`
2. Run dry-run deployment: `npx wrangler deploy --dry-run`
3. Deploy to production: `npx wrangler deploy`

## Troubleshooting

### Common Issues

**Dependency Installation Fails**:
- Always use `npm install --legacy-peer-deps`
- Clear `node_modules` and try again if persistent

**Build Errors**:
- Check TypeScript compilation: `npx tsc --noEmit`
- Verify all imports are correct
- Check for missing environment variable references

**Dev Server Won't Start**:
- Ensure build completed successfully first
- Run `npm run wrangler:wrapper` before starting wrangler dev
- Check port 4321 is not in use

**API Integration Errors**:
- Console errors about QueryClient/React are normal when API is unavailable
- Verify API token is set if testing with real backend
- Check network connectivity to external API

**Runtime Errors in Browser**:
- React 19 compatibility issues may cause warnings - these are generally safe to ignore
- Check browser console for specific error details
- Verify all required props are passed to components

### Debug Mode
Enable additional logging by setting environment variables:
```bash
DEBUG=true npm run dev
```

## Performance Notes
- Build time: ~11 seconds (normal range 8-15 seconds)
- Dev server startup: ~20 seconds (normal range 15-30 seconds)
- Bundle size: ~1.7MB total / ~340KB gzipped
- Page load time: <2 seconds on localhost

**NEVER CANCEL BUILDS OR DEV SERVER STARTUP** - These processes require full completion time.