# GitHub Bot Frontend Admin Dashboard

A modern, responsive frontend application for managing GitHub workflow automation, research operations, and AI-powered code analysis through the Colby GitHub Bot API.

## 🚀 Features

### 📊 Dashboard Overview
- **Real-time Statistics**: Live updates of repositories, commands, operations, and best practices
- **System Health Monitoring**: Visual indicators for system status and performance
- **Quick Actions**: One-click access to start/stop research, view commands, and manage practices
- **Multi-tab Interface**: Overview, Analytics, Operations, and Insights tabs
- **Recent Activity Feed**: Live updates of recent commands and operations

### 🔍 Research & Analysis Module
- **Repository Discovery**: Browse and search analyzed repositories with AI-powered insights
- **Advanced Filtering**: Filter by score, stars, category, and search terms
- **Multiple View Modes**: Grid and list views for different preferences
- **Repository Details**: Deep dive into individual repository analysis with summaries
- **Research Controls**: Start/stop research operations with real-time progress tracking

### ⚡ Command Management
- **Command History**: Complete history of all executed Colby commands
- **Advanced Filtering**: Filter by repository, author, status, and date range
- **Status Tracking**: Real-time status updates (queued, working, completed, failed)
- **Command Details**: View full command execution logs and results
- **Bulk Operations**: Multi-select and bulk actions for command management

### 📚 Best Practices Management
- **Practice Library**: Browse and search code best practices
- **Approval Workflow**: Approve, reject, or mark practices as pending
- **Category Organization**: Group practices by technology, language, or domain
- **Detailed Views**: Full descriptions, examples, and implementation guides
- **Tag System**: Organize practices with custom tags

### 🔧 Operations Monitoring
- **Live Operations**: Real-time view of active operations with progress bars
- **Operation History**: Historical view of completed operations
- **Status Management**: Cancel running operations, view detailed logs
- **Performance Metrics**: Track operation success rates and response times
- **Error Handling**: Display operation errors with retry options

## 🛠 Technology Stack

### Frontend Framework
- **Astro 5.10.1**: Modern static site generator with React integration
- **React 19.0.0**: Component library with hooks and modern patterns
- **TypeScript**: Strict typing and enhanced developer experience

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern, accessible component library
- **Radix UI**: Unstyled, accessible component primitives
- **Lucide React**: Beautiful, customizable icons

### State Management
- **TanStack Query**: Server state management with caching and synchronization
- **Zustand**: Lightweight client state management
- **React Hook Form**: Form state management with validation

### Real-time Features
- **WebSocket Integration**: Live updates for operations and system status
- **Auto-refresh**: Configurable polling for data synchronization
- **Notification System**: Toast notifications for user feedback

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── admin/           # Admin-specific components
│   ├── commands/        # Command management components
│   ├── dashboard/       # Dashboard components
│   ├── layout/          # Layout components
│   ├── operations/      # Operations monitoring components
│   ├── practices/       # Best practices components
│   ├── research/        # Research & analysis components
│   └── ui/              # Base UI components
├── hooks/               # Custom React hooks
│   ├── useGitHubBotAPI.ts    # API integration hooks
│   └── useWebSocket.ts       # WebSocket hooks
├── lib/                 # Utility libraries
│   ├── services/        # API service layer
│   └── stores/          # State management stores
├── pages/               # Astro pages
│   ├── admin/           # Admin pages
│   └── api/             # API routes
├── types/               # TypeScript type definitions
└── styles/              # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Access to the GitHub Bot API

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gh-bot-fe-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   GITHUB_BOT_API_TOKEN=your_api_token_here
   GITHUB_BOT_API_URL=https://gh-bot.hacolby.workers.dev
   ```

4. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:4321`

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview

# Deploy to Cloudflare Pages
npm run deploy
```

## 🔧 Configuration

### API Configuration
The application connects to the GitHub Bot API at `https://gh-bot.hacolby.workers.dev`. All API endpoints are configured in `src/types/api.ts` and `src/lib/services/github-bot-api.ts`.

### WebSocket Configuration
Real-time updates are enabled via WebSocket connection to `wss://gh-bot.hacolby.workers.dev/ws`. The connection is managed in `src/hooks/useWebSocket.ts`.

### State Management
- **Server State**: Managed by TanStack Query with automatic caching and synchronization
- **Client State**: Managed by Zustand with persistence for user preferences
- **Form State**: Managed by React Hook Form with Zod validation

## 📱 Responsive Design

The application is built with a mobile-first approach and includes:
- **Responsive Grid Layouts**: Adapts to different screen sizes
- **Mobile Navigation**: Collapsible sidebar for mobile devices
- **Touch-friendly Interface**: Optimized for touch interactions
- **Progressive Enhancement**: Works on all devices with graceful degradation

## 🎨 Theming

The application supports:
- **Light/Dark Mode**: Automatic theme detection with manual override
- **System Theme**: Follows user's system preference
- **Customizable Colors**: Consistent color palette across all components
- **Accessibility**: WCAG 2.1 AA compliant design

## 🔒 Security

- **API Token Authentication**: Secure API communication
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Built-in protection against cross-site request forgery

## 📊 Performance

- **Code Splitting**: Lazy loading of routes and components
- **Image Optimization**: Optimized images with lazy loading
- **Caching Strategy**: Intelligent caching with TanStack Query
- **Bundle Optimization**: Tree shaking and minification
- **CDN Ready**: Optimized for Cloudflare Pages deployment

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e

# Run all tests
npm run test:all
```

## 📈 Monitoring & Analytics

The application includes:
- **Error Tracking**: Comprehensive error logging and reporting
- **Performance Monitoring**: Real-time performance metrics
- **User Analytics**: Usage patterns and feature adoption
- **System Health**: Live system status and uptime monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Documentation**: Check the inline documentation and comments
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions and ideas

## 🔄 Updates

The application is regularly updated with:
- **New Features**: Based on user feedback and requirements
- **Bug Fixes**: Prompt resolution of reported issues
- **Performance Improvements**: Ongoing optimization efforts
- **Security Updates**: Regular security patches and updates

---

Built with ❤️ using Astro, React, TypeScript, and Tailwind CSS.
