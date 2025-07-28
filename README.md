# EnChat Application

A real-time encrypted chat application built with Next.js, CryptoJS, and Supabase. This application provides end-to-end encryption for secure messaging with a modern, responsive UI.

## Features

- 🔒 **End-to-End Encryption**: Messages are encrypted using AES-256 encryption
- 💬 **Real-time Messaging**: Instant message delivery using Supabase real-time subscriptions
- 👥 **User Authentication**: Secure user registration and login with Supabase Auth
- 🏠 **Chat Rooms**: Create and join different chat rooms
- 🎨 **Modern UI**: Clean, responsive design built with Tailwind CSS
- 📱 **Mobile Friendly**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend & Backend**: Next.js 15 with App Router
- **Client-Side Encryption**: CryptoJS for AES-256 encryption
- **Backend-as-a-Service**: Supabase (PostgreSQL + Real-time + Auth)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd enchat
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Configure your Supabase project:
   - Create a new Supabase project
   - Get your project URL and anon key from the project settings
   - Update `.env.local` with your Supabase credentials

5. Set up the database:
   - Go to your Supabase dashboard
   - Open the SQL Editor
   - Run the contents of `supabase-schema.sql`

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

The application uses two main tables:

### Rooms Table
- `id`: Unique room identifier
- `name`: Room name
- `created_at`: Timestamp
- `encryption_key`: Optional encryption key for the room

### Messages Table
- `id`: Unique message identifier
- `content`: Message content (encrypted or plain text)
- `sender_id`: User ID of the sender
- `sender_username`: Display name of the sender
- `room_id`: Reference to the room
- `created_at`: Timestamp
- `encrypted`: Boolean flag indicating if the message is encrypted

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Environment Variables on Vercel

Make sure to add the following environment variables in your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Security Features

- **Client-side Encryption**: Messages are encrypted before being sent to the server
- **Room-specific Keys**: Each room can have its own encryption key
- **User Authentication**: Secure login and registration
- **Row Level Security**: Database-level security policies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
