# Trae Code Share - Invitation Code & Event Link Sharing System

A secure and reliable sharing system built with React, TypeScript, Tailwind CSS, Vite, and MongoDB. This system allows you to generate and manage invitation codes, plus create trackable event links with view counts.

## Features

### Invitation Code Management

- **Unique Code Generation**: Generate unique 8-character invitation codes
- **Status Tracking**: Track invitation codes as unused, used, expired, or invalid
- **Copy Tracking**: Monitor how many times each invitation link is copied
- **Real-time Updates**: See status changes immediately

### Event Link Tracking

- **Trackable Links**: Create short links for Trae event URLs
- **View Count**: Track how many times each link has been viewed
- **Recent Events**: View list of recently created event links

### Share & Use Flow

- **One-click Copy**: Easily copy shareable invitation links
- **Secure Usage**: Each code can only be used once
- **防误触机制**: Only mark codes as used when they're actually redeemed
- **Real-time Status Sync**: Codes update status immediately when used

### Security & Reliability

- **Data Validation**: Comprehensive input validation
- **Error Handling**: Robust error handling and user feedback
- **Type Safety**: Built with TypeScript for enhanced reliability
- **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Database**: MongoDB (via Prisma ORM)
- **Components**: Custom UI components (shadcn-inspired)
- **Deployment**: Vercel Serverless Functions

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)
- Vercel CLI (for local development with API)

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate
```

### Database Setup (MongoDB Atlas)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (M0 Free tier)
3. Create a database user with read/write access
4. Allow network access from anywhere (0.0.0.0/0) for Vercel
5. Get your connection string

### Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB connection string from MongoDB Atlas
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/trae-code-share?retryWrites=true&w=majority"
```

### Push Database Schema

```bash
# Push schema to MongoDB (no migrations needed for MongoDB)
npx prisma db push
```

### Running Locally

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Run local development server (includes API)
vercel dev
```

> **Note**: Using `npm run dev` only starts the frontend. Use `vercel dev` to run both frontend and API together.

### Project Structure

```
├── api/                 # Vercel Serverless Functions
│   ├── codes/          # Invitation code endpoints
│   │   ├── index.ts    # POST /api/codes - Create codes
│   │   └── [code].ts   # GET /api/codes/:code - Get/use code
│   └── events/         # Event link endpoints
│       ├── create.ts   # POST /api/events/create - Create event link
│       ├── list.ts     # GET /api/events/list - List recent events
│       └── [id].ts     # GET /api/events/:id - Get event & increment view
├── prisma/
│   └── schema.prisma   # Database schema
├── src/
│   ├── components/     # React UI components
│   ├── services/       # API client services
│   ├── types/          # TypeScript type definitions
│   └── App.tsx         # Main application
└── .env                # Environment variables (not committed)
```

## API Endpoints

### Invitation Codes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/codes` | Create new invitation codes |
| GET | `/api/codes/:code` | Get invitation code details |
| PUT | `/api/codes/:code` | Mark code as used |

### Event Links

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events/create` | Create a trackable event link |
| GET | `/api/events/list` | List recent event links |
| GET | `/api/events/:id` | Get original URL & increment view count |

## Deployment

### Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variable in Vercel dashboard:
   - `DATABASE_URL` = Your MongoDB Atlas connection string
4. Deploy!

Vercel will automatically:
- Build the frontend with `npm run build`
- Deploy API routes from the `/api` folder
- Run `prisma generate` via postinstall script

## Security Considerations

- **Environment Variables**: Never commit `.env` files with secrets
- **MongoDB Access**: Use IP allowlist in production if possible
- **HTTPS**: Always use HTTPS in production (Vercel handles this)
- **Input Validation**: All API endpoints validate input

## Development Commands

```bash
# Start frontend only
npm run dev

# Start frontend + API (recommended)
vercel dev

# Build for production
npm run build

# Generate Prisma client
npx prisma generate

# Push schema changes to MongoDB
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License
