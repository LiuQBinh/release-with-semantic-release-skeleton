# Seconder Web App & Chrome Extension

A modern single-page application built with React and Vite, serving both as a web application and Chrome extension. The project uses a monorepo structure and is part of the Seconder ecosystem.

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Routing**: React Router 7
- **Internationalization**: use-intl
- **UI Components**: Custom components with class-variance-authority and clsx
- **Icons**: Lucide React

## Project Structure

```
seconder-webapp-extension/
├── src/
│   ├── extension/          # Chrome extension specific code
│   │   ├── modules/
│   │   │   ├── background/ # Extension background scripts
│   │   │   └── content/    # Content scripts
│   └── ...                 # Web app source code
├── public/                 # Static assets
├── dist/                   # Build output
└── config files           # Various configuration files
```

## Prerequisites

- Node.js (Latest LTS version recommended)
- pnpm (Package manager)
- Chrome browser (for extension development)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd seconder-webapp-extension
```

2. Install dependencies:
```bash
pnpm install
```

## Development

### Running the Web App

```bash
pnpm run start:webapp
```

### Running the Chrome Extension

```bash
pnpm run start:extension
```

### Running Both Simultaneously

```bash
pnpm run start
```

## Building for Production

### Building Web App

```bash
pnpm run aws:build:webapp
```

### Building Chrome Extension

```bash
pnpm run aws:build:extension
```

### Building Both

```bash
pnpm run aws:build
```

## Development Features

- Hot Module Replacement (HMR)
- TypeScript support
- ESLint and Stylelint for code quality
- Tailwind CSS for styling
- Chrome extension development support
- Concurrent development of web app and extension

## Project Configuration

The project uses several configuration files:
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration
- `stylelint.config.js` - Stylelint configuration
- `components.json` - Component configuration

## Dependencies

### Main Dependencies
- React 19
- React DOM 19
- React Router 7.5.3
- Tailwind CSS 4
- use-intl 4.0.3
- class-variance-authority
- clsx
- lucide-react

### Development Dependencies
- TypeScript 5.7.2
- Vite 6.3.1
- ESLint 9.22.0
- Various TypeScript types and development tools

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the development team.
