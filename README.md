# Encrypted Chat Application

A real-time encrypted chat application built with Next.js, CryptoJS, and Supabase. This application provides end-to-end encryption for secure messaging with a modern, responsive UI.

## Features

- 🔒 **End-to-End Encryption**: Messages are encrypted client-side using AES-256
- 💬 **Real-time Messaging**: Instant message delivery using Supabase real-time subscriptions
- 🏠 **Chat Rooms**: Create and manage multiple chat rooms
- 🎨 **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- 🔐 **Optional Encryption**: Choose which rooms to encrypt
- 📱 **Mobile Responsive**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend & Backend**: Next.js 15 with App Router
- **Client-Side Encryption**: CryptoJS (AES-256)
- **Backend-as-a-Service**: Supabase (PostgreSQL + Real-time)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (recommended)

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd encrypted-chat
npm install
```

### 2. Set up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Navigate to the SQL Editor in your Supabase dashboard
3. Copy and paste the contents of `supabase-schema.sql` into the editor
4. Run the SQL commands to create the database schema

### 3. Configure Environment Variables

1. Copy `env.example` to `.env.local`:
```bash
cp env.example .env.local
```

2. Get your Supabase credentials:
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Copy the "Project URL" and "anon public" key

3. Update `.env.local` with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

### Creating a Chat Room

1. Click "Create New Room" in the sidebar
2. Enter a room name
3. Optionally check "Enable encryption" for end-to-end encryption
4. Click "Create Room"

### Sending Messages

1. Select a room from the sidebar
2. Type your message in the input field
3. Press Enter or click "Send"

### Encryption

- **Encrypted Rooms**: Messages are encrypted client-side before being sent to the server
- **Non-Encrypted Rooms**: Messages are sent as plain text
- **Toggle Encryption**: Use the encryption toggle button in encrypted rooms to enable/disable encryption for your messages

## Security Features

- **Client-Side Encryption**: Messages are encrypted before leaving the browser
- **AES-256**: Industry-standard encryption algorithm
- **Unique Room Keys**: Each encrypted room has its own encryption key
- **No Key Storage**: Encryption keys are not stored on the server

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set these environment variables in your production environment:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── ChatApp.tsx     # Main application component
│   ├── ChatRoom.tsx    # Chat room component
│   ├── MessageBubble.tsx # Individual message component
│   ├── RoomHeader.tsx  # Room header with encryption toggle
│   └── RoomList.tsx    # Room list sidebar
└── lib/               # Utility libraries
    ├── crypto.ts      # Encryption utilities
    ├── supabase.ts    # Supabase client configuration
    └── types.ts       # TypeScript type definitions
```

## API Endpoints

The application uses Supabase's auto-generated REST API:

- `GET /rooms` - Fetch all chat rooms
- `POST /rooms` - Create a new chat room
- `DELETE /rooms/{id}` - Delete a chat room
- `GET /messages?room_id={id}` - Fetch messages for a room
- `POST /messages` - Send a new message

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository.
