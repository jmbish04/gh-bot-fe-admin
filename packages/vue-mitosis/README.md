# ShadCN Vue.js with Mitosis

A complete Vue.js application built using ShadCN design system components, designed to work with Mitosis and deployable to Cloudflare Pages.

![Application Screenshot](https://github.com/user-attachments/assets/927e739c-ef16-4250-b5d3-c02fa75b99f6)

## Features

- 🎨 **ShadCN Design System** - Beautiful, accessible UI components
- ⚡ **Vue.js 3** - Modern reactive framework with Composition API
- 🔄 **Mitosis Compatible** - Component architecture designed for Mitosis compilation
- 🚀 **Cloudflare Pages Ready** - Optimized for Cloudflare deployment
- 🎯 **TypeScript** - Full type safety throughout the application
- 💨 **Tailwind CSS** - Utility-first styling with custom design tokens
- 📱 **Responsive Design** - Mobile-first responsive layout

## Components Included

### UI Components
- **Button** - Multiple variants (default, secondary, outline, destructive, ghost, link)
- **Input** - Styled form input with validation states
- **Card** - Container component with header, title, and content sections
- **Table** - Data display with header, body, rows, and cells

### Demo Sections
- **Interactive Demo** - Text input and counter functionality
- **Button Variants** - Showcase of all button styles
- **Data Table** - Example table with user data
- **GitHub Bot Admin Actions** - Contextual action buttons

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
cd packages/vue-mitosis
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 to view the application.

### Build for Production

```bash
npm run build
```

### Deploy to Cloudflare Pages

```bash
npm run deploy
```

## Project Structure

```
packages/vue-mitosis/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Global styles and assets
│   ├── components/ui/     # ShadCN UI components
│   ├── lib/              # Utility functions
│   ├── mitosis/          # Original Mitosis component definitions
│   ├── App.vue           # Main application component
│   └── main.ts           # Application entry point
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite build configuration
└── wrangler.toml         # Cloudflare Pages configuration
```

## Mitosis Integration

This project is structured to work seamlessly with Mitosis:

- Components follow Mitosis patterns and conventions
- Original Mitosis definitions are preserved in `src/mitosis/`
- Vue.js implementations are in `src/components/ui/`
- Built with compatibility for cross-framework compilation

## Cloudflare Pages Configuration

The application includes optimized configuration for Cloudflare Pages:

- Static asset optimization
- Security headers
- Cache control settings
- Edge-compatible build output

## Technology Stack

- **Vue.js 3** - Progressive JavaScript framework
- **TypeScript** - Static type checking
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN** - Design system and component library
- **Mitosis** - Universal component authoring
- **Cloudflare Pages** - JAMstack deployment platform

## License

MIT License - see LICENSE file for details.