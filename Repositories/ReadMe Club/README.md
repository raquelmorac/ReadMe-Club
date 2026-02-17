# Reader Club

Reader Club is a Netlify-hosted web app for managing a single reading club.

## Local setup

1. Install dependencies: `npm install`
2. Run app: `npm run dev`
3. Run unit tests: `npm test`

## Environment variables

Copy `.env.example` and fill values.

## Google Sheets public-read + Apps Script write mode

1. Keep spreadsheet share as "Anyone with the link can view" for read access.
2. In Google Apps Script, create a script project, paste `scripts/google-apps-script/Code.gs`, and deploy as Web App.
3. In Apps Script project settings, set Script Property `APP_SECRET` to the same value used in `GOOGLE_APPS_SCRIPT_SECRET`.
4. Set `GOOGLE_APPS_SCRIPT_URL`, `GOOGLE_APPS_SCRIPT_SECRET`, and `GOOGLE_SHEETS_ID` in Netlify environment variables.

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
