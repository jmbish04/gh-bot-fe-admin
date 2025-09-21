# GitHub Copilot Instructions for gh-bot-fe-admin

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Project Goal & Architecture

This repository contains a Vue.js admin dashboard for the **`jmbish04/gh-bot`** backend worker. Its primary purpose is to provide a user interface for monitoring the status of long-running jobs (like code analysis and research) in real-time and viewing results.

The core architectural principle is **modularity**. Business logic and state management must be separated from the view components.

---

## Technology Stack

-   **Framework**: **Vue.js 3** using the **Composition API** with `<script setup>`.
-   **UI Library**: **shadcn-vue**. Always prefer using these pre-built components for consistency.
-   **Styling**: **Tailwind CSS**.
-   **Language**: **TypeScript**. Use strong typing and avoid `any`.
-   **Deployment**: This is a static site application deployed on **Cloudflare Pages**.

---

## Key Principles & Patterns

### 1. Composables are the Source of Truth

All business logic, API calls, and state management must be encapsulated in **Composables** (e.g., `composables/useCommands.js`, `composables/useWebSocket.js`). Components should be simple and primarily consume data from these composables.

### 2. Components are for Display Only

Vue components in `src/components/` and `src/views/` should be focused on rendering the UI. They receive data as props or from composables and emit events. They should not contain complex application logic.

### 3. Embrace Reactivity

Use Vue's native reactivity (`ref`, `reactive`, `computed`, `watch`) to manage state.
-   Use `computed` for derived state (e.g., a filtered list).
-   Use `watch` to react to state changes and trigger side effects (like an API call), replacing older patterns like `setTimeout`.

### 4. Real-Time First

The application is designed for real-time monitoring. Assume that data displayed in the UI can be updated at any moment by the WebSocket connection. The UI should be built to reactively display data from the `useWebSocket.js` composable.

---

## Key Files & Directories

-   `src/composables/`: **This is the most important directory.** All new logic for state and data fetching goes here.
-   `src/components/`: Small, reusable UI components.
-   `src/views/`: Top-level page components that assemble the layout and use composables.
-   `src/services/api.js`: The client for interacting with the backend REST API.

## Working Effectively

### Prerequisites and Setup
- **Node.js 18+** is required - use `node --version` to verify
- **npm** or **pnpm** package manager
- Access to GitHub Bot API at `https://gh-bot.hacolby.workers.dev`

### Bootstrap the Repository
Run these commands in exact order:

1. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Build the application**:
   ```bash
   npm run build
   # or
   pnpm run build
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   # or
   pnpm run dev
   ```

### Development Workflow

**Run the development server**:
```bash
npm run dev
```
- Starts Vite development server
- Server typically runs on `http://localhost:5173` or `http://localhost:3000`
- Hot module replacement enabled for fast development

## Validation and Testing

### Manual Functional Testing
**ALWAYS run these validation steps after making changes:**

1. **Navigate to dashboard**: Check main dashboard loads correctly
2. **Test all navigation pages**:
   - Dashboard overview
   - Commands monitoring
   - Research status
   - Operations tracking
3. **Verify UI elements**:
   - Navigation works
   - Real-time updates display
   - WebSocket connection status
   - Theme toggling works

### Code Quality

```bash
# Check TypeScript compilation
npm run type-check
# or
npx tsc --noEmit

# Run linting
npm run lint

# Format code
npm run format
```

### Deployment Validation
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## API Integration

### External Dependencies
- **GitHub Bot API**: `https://gh-bot.hacolby.workers.dev`
- **WebSocket connection**: For real-time updates
- **API Authentication**: Uses environment variables for tokens

### API Error Handling
- Use composables to handle API states (loading, error, success)
- Implement proper error boundaries
- WebSocket reconnection logic should be in `useWebSocket` composable

## Common Tasks

### Adding New Components
1. Create component in `src/components/`
2. Use TypeScript with proper prop definitions
3. Consume data from composables, not direct API calls
4. Follow Vue 3 Composition API patterns

### Adding New Composables
1. Create in `src/composables/`
2. Encapsulate all business logic
3. Return reactive state and methods
4. Handle loading, error, and success states

### WebSocket Integration
- All real-time functionality should use the `useWebSocket` composable
- Components should reactively update when WebSocket data changes
- Handle connection states (connecting, connected, disconnected)

### State Management
- Use composables for component-level state
- Use Pinia for global state if needed
- Leverage Vue's built-in reactivity system

## Troubleshooting

### Common Issues

**Build Errors**:
- Check TypeScript compilation: `npm run type-check`
- Verify all imports are correct
- Ensure proper Vue 3 syntax is used

**Dev Server Issues**:
- Check port availability
- Clear `node_modules` and reinstall if persistent issues
- Verify Node.js version compatibility

**WebSocket Connection Issues**:
- Check network connectivity to backend
- Verify WebSocket URL is correct
- Check browser console for connection errors

**Performance Issues**:
- Use `computed` for derived state
- Avoid unnecessary reactivity with `shallowRef` where appropriate
- Implement proper list virtualization for large datasets