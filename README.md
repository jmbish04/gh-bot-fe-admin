# GitHub Bot Frontend Admin Dashboard

A modern, responsive frontend application for managing the Colby GitHub Bot API. This dashboard provides an intuitive interface for monitoring GitHub workflows, managing research operations, and interacting with AI-powered code analysis features.

## Features

### 🏠 Dashboard Overview
- **Real-time Statistics**: Live updates of total commands, active operations, repositories, and best practices
- **Quick Actions**: One-click buttons to trigger research sweeps and view recent activity
- **Status Indicators**: Visual health status and operation progress bars
- **Recent Activity Feed**: Live updates of recent commands and operations

### 🔍 Research & Analysis Module
- **Repository Discovery**: Browse and analyze discovered repositories with AI summaries
- **Advanced Filtering**: Filter by score, category, technology stack, and search terms
- **Research Controls**: Start/stop research sweeps with real-time progress tracking
- **Repository Details**: Deep dive into individual repository analysis with detailed insights

### ⚡ Command Management
- **Command History**: Complete history of executed Colby commands with status tracking
- **Advanced Filtering**: Filter by repository, author, status, and date range
- **Command Details**: View full command execution logs and results
- **Real-time Updates**: Live status updates for running commands

### 📚 Best Practices Management
- **Practice Library**: Browse and search code best practices and suggestions
- **Category Organization**: Group practices by technology, language, or domain
- **Status Management**: Approve, reject, or mark practices as pending
- **Practice Details**: View full descriptions, examples, and implementation guides

### 📊 Operations Monitoring
- **Live Operations**: Real-time view of active operations with progress tracking
- **Operation History**: Historical view of completed operations
- **Error Handling**: Display operation errors and retry options
- **Performance Metrics**: Monitor system performance and health

## Technology Stack

- **Frontend Framework**: Astro with React components
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand for client state, React Query for server state
- **Real-time Updates**: WebSocket connections for live data
- **TypeScript**: Full type safety throughout the application
- **Icons**: Lucide React icon library

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Access to the GitHub Bot API at `https://gh-bot.hacolby.workers.dev`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gh-bot-fe-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   GITHUB_BOT_API_TOKEN=your_api_token_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:4321` to view the dashboard.

### Building for Production

```bash
npm run build
```

### Deployment

The application is configured for deployment on Cloudflare Pages:

```bash
npm run deploy
```

## API Integration

The frontend integrates with the GitHub Bot API through:

- **REST API**: For data fetching and CRUD operations
- **WebSocket**: For real-time updates and live monitoring
- **TypeScript Types**: Auto-generated from OpenAPI specification

### Key API Endpoints

- `GET /health` - System health check
- `GET /research/results` - Repository analysis results
- `GET /colby/commands` - Command execution history
- `GET /colby/best-practices` - Best practices library
- `GET /api/operations` - Live operations monitoring
- `GET /api/stats` - Dashboard statistics

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── dashboard/      # Dashboard-specific components
│   ├── research/       # Research module components
│   ├── commands/       # Command management components
│   ├── practices/      # Best practices components
│   ├── operations/     # Operations monitoring components
│   ├── layout/         # Layout and navigation components
│   └── ui/             # Base UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and services
│   ├── services/       # API service layer
│   └── stores/         # State management stores
├── types/              # TypeScript type definitions
├── pages/              # Astro pages
└── styles/             # Global styles
```

## Features in Detail

### Real-time Updates

The application uses WebSocket connections to provide real-time updates for:
- Dashboard statistics
- Operation progress
- Command status changes
- Research completion notifications
- System health monitoring

### Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Tablet Support**: Responsive layout for tablet screens
- **Desktop**: Full-featured desktop experience
- **Dark Mode**: System preference detection and manual toggle

### Performance Optimization

- **Code Splitting**: Lazy loading of components and routes
- **Memoization**: React.memo and useMemo for expensive operations
- **Query Caching**: React Query for intelligent data caching
- **Virtual Scrolling**: For large data tables (future enhancement)

### Accessibility

- **Keyboard Navigation**: Full keyboard accessibility support
- **Screen Reader**: ARIA labels and semantic HTML
- **Color Contrast**: WCAG 2.1 AA compliant color schemes
- **Focus Management**: Proper focus handling for modals and navigation

## Customization

### Theming

The application supports light, dark, and system themes. Theme preferences are persisted in localStorage.

### Filtering and Search

All data tables support:
- Text search across relevant fields
- Multi-column filtering
- Sorting by any column
- Pagination for large datasets

### Notifications

The notification system provides:
- Real-time alerts for important events
- Categorized notifications (success, error, warning, info)
- Auto-removal after configurable time
- Mark as read functionality

## Development

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Verify the API token is correctly set
   - Check network connectivity
   - Ensure the API endpoint is accessible

2. **WebSocket Connection Issues**
   - Check if WebSocket is supported in your environment
   - Verify the WebSocket URL is correct
   - Check for firewall or proxy restrictions

3. **Build Issues**
   - Clear node_modules and reinstall dependencies
   - Check Node.js version compatibility
   - Verify all environment variables are set

### Debug Mode

Enable debug mode by setting:
```bash
DEBUG=true npm run dev
```

## License

MIT License - see LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API specification at `/openapi.json`

## Roadmap

### Upcoming Features

- [ ] Advanced data visualization and charts
- [ ] Bulk operations for commands and practices
- [ ] Export functionality for data
- [ ] User management and permissions
- [ ] Advanced search and filtering
- [ ] Custom dashboard widgets
- [ ] API rate limiting and usage analytics
- [ ] Integration with external tools (Slack, Discord, etc.)

### Performance Improvements

- [ ] Virtual scrolling for large datasets
- [ ] Image optimization and lazy loading
- [ ] Service worker for offline functionality
- [ ] Advanced caching strategies
- [ ] Bundle size optimization