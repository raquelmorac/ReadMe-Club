# Reader Club

Reader Club is a Netlify-hosted web app for managing a single reading club.

## Local setup

1. Install dependencies: `npm install`
2. Run app: `npm run dev`
3. Run unit tests: `npm test`

## Environment variables

Copy `.env.example` and fill values.

## Google Sheets schema

Required tabs:
- Members
- Books
- Sessions
- Ratings
- Polls
- PollBooks
- Votes

## Deployment

1. Push repository to Git provider connected to Netlify.
2. Set env vars in Netlify site settings.
3. Deploy with build command `npm run build`.
