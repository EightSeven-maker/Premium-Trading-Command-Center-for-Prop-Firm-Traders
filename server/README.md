# 87Capital Trading OS - Backend Server

This server handles secure Twitter API calls for the Trading OS dashboard.

## Setup

### 1. Get Twitter/X API Credentials

1. Go to https://developer.twitter.com/
2. Sign in with your X account
3. Create a Developer Account if needed
4. Create a new Project and App
5. Under **App Settings**, find **Keys and Tokens**
6. Copy the **Bearer Token**

### 2. Configure Environment

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your Twitter Bearer Token
TWITTER_BEARER_TOKEN=your_actual_bearer_token_here
```

### 3. Start the Server

```bash
# Install dependencies
npm install

# Start server
npm start
```

The server will run on `http://localhost:3001`

### 4. Update Frontend Vite Config

For development, proxy requests to the backend:

```bash
cd ..
npm run dev
```

## API Endpoints

### GET /api/trump-tweets
Returns Trump's recent tweets from @realDonaldTrump

Response:
```json
{
  "tweets": [
    {
      "id": "123456789",
      "text": "Tweet content here...",
      "created_at": "2024-01-15T12:00:00.000Z",
      "timeAgo": "2h ago"
    }
  ]
}
```

## Production Deployment

For production, deploy this server to:
- **Railway** (recommended)
- **Render**
- **Fly.io**
- **Heroku**

Then update the frontend API URL to point to your deployed server.
