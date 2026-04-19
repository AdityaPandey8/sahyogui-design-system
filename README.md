# SahyogAI Design System

A disaster relief and volunteer coordination platform built with React, TypeScript, and Supabase.

## Features

- AI-powered issue analysis using Google Gemini
- Real-time chat assistant
- Dashboard for admins, NGOs, volunteers, and public users
- Issue reporting and management
- Volunteer matching and NGO coordination

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env.local` file with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```

3. Set up Supabase:
   - Link your Supabase project: `npx supabase link --project-ref your-project-ref`
   - Set the Google Gemini API key secret: `npx supabase secrets set GOOGLE_GEMINI_API_KEY=your_gemini_api_key`
   - Deploy edge functions: `npx supabase functions deploy`

4. Get your Google Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```
