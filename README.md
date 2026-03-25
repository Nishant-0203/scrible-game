# Scribble - Real-Time Multiplayer Drawing Game

A full-stack application where players can join rooms and participate in real-time drawing games together.

## Project Overview

Scribble is a modern web-based multiplayer drawing game featuring:
- Real-time synchronization across multiple players using WebSockets
- Room-based game organization with unique room identifiers
- User authentication with Google OAuth and guest login
- Responsive UI with dark/light mode support
- Scalable backend infrastructure with Redis support

## Tech Stack

### Frontend
- **React** 19 - UI framework
- **TypeScript** - Type safety and better DX
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Pre-built accessible UI components
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time bidirectional communication
- **Zustand** - Lightweight state management
- **Axios** - HTTP client
- **Motion** - Animation library

### Backend
- **Express.js** - Web server framework
- **Socket.IO** - Real-time event-driven communication
- **Redis** - Distributed caching and pub/sub adapter
- **Node.js** (v18+) - Runtime environment
- **UUID** - Unique ID generation
- **dotenv** - Environment configuration

## Project Structure

```
scribble-game/
├── backend/                 # Express + Socket.IO server
│   ├── src/
│   │   ├── server.js       # Main server entry point
│   │   ├── config/
│   │   │   └── socket.js   # Socket.IO configuration
│   │   ├── rooms/          # Game room management
│   │   ├── sockets/        # Socket event handlers
│   │   └── utils/          # Helper utilities
│   ├── public/             # Static files (served by Express)
│   └── package.json
│
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/       # Authentication components
│   │   │   │   ├── GoogleButton.tsx
│   │   │   │   ├── GuestLogin.tsx
│   │   │   │   ├── LoginCard.tsx
│   │   │   │   └── LoginPage.tsx
│   │   │   ├── lobby/      # Lobby components
│   │   │   ├── Navbar.tsx
│   │   │   └── ui/         # shadcn/ui components
│   │   ├── pages/          # Page components
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── JoinRoomPage.tsx
│   │   │   ├── Lobby.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── services/       # API and Socket.IO service
│   │   ├── store/          # Zustand state stores
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript type definitions
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
└── package.json            # Monorepo root (npm workspaces)
```

## Getting Started

### Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```sh
   git clone <repository-url>
   cd scribble-game
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Setup environment variables**

   Create a `.env` file in the `backend` directory:
   ```
   PORT=3000
   NODE_ENV=development
   REDIS_URL=redis://localhost:6379
   ```

### Running the Application

#### Development Mode (Both Backend & Frontend)
```sh
npm run dev
```
This runs the backend on `http://localhost:3000` and frontend on `http://localhost:5173` (Vite default).

#### Backend Only
```sh
npm run dev --workspace backend
```

#### Frontend Only
```sh
npm run dev --workspace frontend
```

#### Production Build
```sh
npm run build
```

#### Start Production Server
```sh
npm start
```

## Available Scripts

### Root Commands
- `npm run dev` - Start both backend and frontend in development mode
- `npm run start-dev` - Alias for `npm run dev`
- `npm run build` - Build frontend for production
- `npm start` - Start backend production server
- `npm run start-prod` - Build frontend and start backend
- `npm run seed` - Seed backend database/cache
- `npm run lint` - Run linters for both backend and frontend

### Backend
- `npm run dev --workspace backend` - Start with auto-reload
- `npm run test --workspace backend` - Run tests
- `npm start --workspace backend` - Start production server

### Frontend
- `npm run dev --workspace frontend` - Start Vite dev server
- `npm run build --workspace frontend` - Build for production
- `npm run lint --workspace frontend` - Run ESLint
- `npm run preview --workspace frontend` - Preview production build locally

## Features

### User Authentication
- Google OAuth integration
- Guest login support
- Session management

### Game Features
- Create or join game rooms
- Real-time game state synchronization
- Multi-player drawing canvas
- Room management and player tracking

### UI/UX
- Responsive design for desktop and tablet
- Dark/light mode support
- Accessible component library
- Smooth animations and transitions

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Format code with Prettier (npm run format)
- Use component-based architecture

### Socket.IO Events
Socket events are organized by features:
- **Room management**: Create, join, leave, delete room
- **Game state**: Start game, update drawing, submit answer
- **Player management**: Player join, player leave, player update
- **Chat/Messages**: Real-time messaging between players

### State Management
- Use Zustand for global state (auth, room, player info)
- Component-level state with React hooks for local UI state
- Socket events for real-time state synchronization

## Deployment

The application can be deployed to various platforms:
- **Backend**: Heroku, Railway, DigitalOcean, AWS (Node.js)
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Full Stack**: Docker containers with orchestration

### Pre-deployment Checklist
1. Set appropriate environment variables
2. Build frontend for production: `npm run build`
3. Ensure Redis is available in production
4. Configure CORS settings for different domains
5. Set up SSL/TLS certificates for HTTPS

## Troubleshooting

### Port Already in Use
```sh
# Kill process on port 3000 (backend)
lsof -ti:3000 | xargs kill -9

# Frontend uses 5173 by default with Vite
```

### Redis Connection Issues
Ensure Redis is running:
```sh
redis-cli ping  # Should return PONG
```

### Build Errors
Clear cache and reinstall:
```sh
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## License

ISC License - see LICENSE file for details

## Support

For issues and questions, please open a GitHub issue or contact the development team.
