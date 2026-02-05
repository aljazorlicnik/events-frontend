# EventsHUB

EventsHUB is a modern, premium event management platform that allows users to discover, join, and manage events seamlessly.

## Features

- **Event Discovery**: Browse upcoming events in a grid view ("All Events").
- **My Events**: View registered events in a clean, horizontal list layout.
- **QR Codes**: Each registered event generates a unique QR code for easy check-in.
- **Premium UI**: Glassmorphism design with smooth animations and transitions.
- **Registration System**: Single click join/leave functionality with unique registration enforcement.
- **Admin Panel**: Manage events (create, edit, delete).

## Tech Stack

### Frontend
- **Framework**: React + Vite
- **Language**: TypeScript
- **Styling**: Native CSS (Glassmorphism)
- **Utilities**: `qrcode.react`, Axios

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT Strategies

## Setup & Running

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database

### 1. Backend Setup
Navigate to the backend directory:
```bash
cd events-backend
```

Install dependencies:
```bash
npm install
```

Configure Environment:
Create a `.env` file with your database URL and JWT secret:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/events_db"
JWT_SECRET="your_secret_key"
```

Run Database Migrations:
```bash
npx prisma generate
npx prisma db push
```

Start Server:
```bash
npm run start:dev
```
The server will start on `http://localhost:3000`.

### 2. Frontend Setup
Navigate to the frontend directory:
```bash
cd events-frontend
```

Install dependencies:
```bash
npm install
```

Start Development Server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## Usage
- **Admin Login**: `admin@example.com` / `admin123`
- **User Login**: Create a new account or use existing credentials.
