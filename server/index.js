const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Twitter Bearer Token - Set via environment variable
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

// Trump's user ID (you can look this up or use the handle)
const TRUMP_USER_ID = '25073877'; // @realDonaldTrump

app.use(cors());
app.use(express.json());

// Fetch Trump's recent tweets
app.get('/api/trump-tweets', async (req, res) => {
  try {
    if (!TWITTER_BEARER_TOKEN) {
      return res.status(500).json({ 
        error: 'Twitter API token not configured',
        message: 'Please set TWITTER_BEARER_TOKEN environment variable'
      });
    }

    const response = await fetch(
      `https://api.twitter.com/2/users/${TRUMP_USER_ID}/tweets?max_results=10&tweet.fields=created_at`,
      {
        headers: {
          'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Twitter API error:', error);
      return res.status(response.status).json(error);
    }

    const data = await response.json();
    
    // Format tweets for frontend
    const tweets = data.data.map(tweet => ({
      id: tweet.id,
      text: tweet.text,
      created_at: tweet.created_at,
      timeAgo: getTimeAgo(new Date(tweet.created_at))
    }));

    res.json({ tweets });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Failed to fetch tweets' });
  }
});

// Helper function to calculate time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Get tweets at: http://localhost:${PORT}/api/trump-tweets`);
});
