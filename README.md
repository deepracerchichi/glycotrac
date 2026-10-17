# Glycotrac

Medication reminders, refill alerts and health tracking for people living with diabetes.

> **Glcotrac is a tracking tool, not medical advice.** It records what you enter and sends reminders. It cannot diagnose, interpret symptoms or recommend treatment. Always follow your doctor's instructions.

[Live demo](https://glycotrac.vercel.app) · 



## Why this exists

## Why this exists

While reading about what harms people living with diabetes, I kept finding the same pattern: problems that went unnoticed or untreated, like heart trouble with no pain, numb feet, lost warning signs of low blood sugar, and missed medication. This app focuses on what can be recorded: doses, refills, readings and check-ups. The result is a clear record to bring to a doctor. I'm a developer, not a clinician, so it doesn't interpret anything.

## Features

**Medication**
- Add medications with several dose times per day, search by name using the RxNorm drug database, edit them, delete them, and log refills
- "Today" screen showing each dose as taken, due, missed or later, with one-tap logging
- Refill warnings based on pills left and doses per day
- Reminder push notifications, a follow-up if a dose is still not logged, and a "missed dose" alert
- Optional text message to family contacts who have agreed, if a dose is still missed after about two hours

**Health tracking**
- Blood sugar and blood pressure log with mg/dL or mmol/L, personal target ranges and a 30-day trend chart
- Symptom log with severity and how long after the most recent dose it happened
- Appointments and check-ups, with a reminder the day before
- Optional weekly foot-check reminder

**For doctors and emergencies**
- Printable doctor summary: doses taken and missed, readings and symptoms, day by day
- Emergency card with conditions, allergies, medications and contacts you can call with one tap

**Account**
- Email sign-up, login, forgot-password and reset flow
- Each account's data is private through database row-level security

**Interface**
- Large tap targets and readable text, designed with older users in mind
- Status is never shown by colour alone (icons and words always accompany it)
- Animations respect the "reduce motion" setting
- Collapsible sidebar on desktop and a bottom bar on phones
- Installable as an app (PWA)

## Tech stack

| Area | Tools |
|---|---|
| App | Next.js (App Router), React, TypeScript |
| Styling and motion | Tailwind CSS, GSAP, Lucide icons |
| Data and auth | Supabase (Postgres, Auth, row-level security) |
| Forms and data fetching | React Hook Form, Zod, TanStack Query |
| Notifications | Web Push with a service worker, optional SMS through Termii |
| Drug search | RxNorm API (US National Library of Medicine) |
| Hosting and scheduling | Vercel, Supabase `pg_cron` |

## Design decisions worth knowing

- **Dose logging happens in one database function.** Marking a dose as taken inserts the log and subtracts the pills in a single transaction, so the history and the pill count can't disagree. A unique constraint stops double-taps from logging twice.
- **Creating and editing a medication is also one transaction,** so a medication can never be saved without its dose times.
- **Row-level security on every table.** Users can only read and write their own rows, and the database enforces it, not just the interface.
- **Glucose is stored in mg/dL and converted for display,** so switching units never changes the underlying data.
- **Reminders are scheduled from the database.** `pg_cron` calls a protected API route every minute. The route sends the first reminder, a follow-up, and the missed-dose alert, and stamps each stage so nothing sends twice.
- **The service worker is plain JavaScript in `/public`,** because the browser runs it directly and never compiles TypeScript.
- **The drug search runs through a server route,** which avoids browser cross-origin problems and caches results.

## Getting started

### Requirements
- Node.js 20 or newer
- A free [Supabase](https://supabase.com) project

### Install
```bash
git clone https://github.com/[your-username]/[repo-name].git
cd [repo-name]
npm install
```

### Set up the database
1. In your Supabase project, open **SQL Editor**.
2. Run the contents of [`supabase/schema.sql`](supabase/schema.sql).
3. Under **Authentication → URL Configuration**, set the Site URL and add `http://localhost:3000/auth/callback` to the Redirect URLs.

### Environment variables
Create `.env.local` in the project root. Never commit this file.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Push notifications: generate with `npx web-push generate-vapid-keys`
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:you@example.com

# Protects the reminder route
CRON_SECRET=

# Optional: text messages to family contacts (Termii)
TERMII_API_KEY=
TERMII_SENDER_ID=
TERMII_BASE_URL=
TERMII_CHANNEL=
```

`SUPABASE_SERVICE_ROLE_KEY` bypasses row-level security. Keep it on the server only and never give it a `NEXT_PUBLIC_` prefix.

### Run
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Turn on scheduled reminders
Reminders need the app deployed on a public HTTPS address (Supabase can't reach `localhost`). After deploying, run this in the Supabase SQL Editor with your real URL and secret:

```sql
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'send-reminders',
  '* * * * *',
  $$
  select net.http_post(
    url := 'https://YOUR-APP.vercel.app/api/send-reminders',
    headers := jsonb_build_object('Authorization', 'Bearer YOUR_CRON_SECRET')
  );
  $$
);
```

To test the route by hand:
```bash
curl -X POST https://YOUR-APP.vercel.app/api/send-reminders \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

On iPhone, push notifications only work after you add the site to the Home Screen from Safari (iOS 16.4 or newer).

## Project structure

```
app/
  api/            reminder route and drug search
  auth/           email link callback
  dashboard/      today, medications, readings, symptoms,
                  appointments, summary, emergency, settings
  login/ signup/ forgot-password/ reset-password/
components/       landing, dashboard, meds, readings, symptoms,
                  appointments, emergency, summary, auth, ui
lib/              queries, validation, Supabase clients, helpers
public/           service worker, icons, logo files
supabase/         database schema
```

## Known limits

- **Alert wording and cutoffs have not been reviewed by a clinician.** The "very low" and "very high" thresholds and messages are in `lib/readings.ts` and are placeholders until a doctor signs them off.
- **Drug search covers medicines in the US RxNorm database.** Some local brand names won't appear, so any name can still be typed in by hand.
- **Reminders are timed for Nigeria (Lagos time) only.**
- **Web push on some Android phones needs battery optimisation switched off** for the browser.
- The reminder route reads every schedule each minute, which is fine at small scale but should be filtered in SQL as usage grows.

## Roadmap

- Read-only family view
- Meal log
- Drug label information (warnings and side effects)
- Offline logging that syncs later
- Local language support

## Data and privacy

This app handles health information. Each account's data is separated by row-level security, and text messages to contacts are only sent for contacts the user confirms have agreed. If you deploy your own copy, review the data protection rules that apply to you before inviting real users. [Link to your privacy policy once you have one.]

## License

[Choose one, for example MIT, or state "All rights reserved" if you don't want others reusing it.]