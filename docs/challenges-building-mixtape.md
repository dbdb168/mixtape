# Challenges Building Mixtape: What Went Wrong (And How We Fixed It)

*Every build has its battles. Here's what I learned the hard way.*

## Challenge 1: Apple Music Integration

### The Problem
Apple Music requires MusicKit JS for playback, which needs user authorization. But I wanted the experience to be frictionless—no login required to view a mixtape.

### The Solution
Two-tier playback:
- **Without Apple Music**: 30-second previews via Apple's preview URLs
- **With Apple Music**: Full playback for subscribers who authorize

The key insight: show value immediately (previews work for everyone), then upgrade the experience for Apple Music subscribers.

### Code Pattern
```typescript
// Check if MusicKit is authorized
if (music.isAuthorized) {
  await music.play({ id: trackId });
} else {
  // Fall back to preview
  const audio = new Audio(previewUrl);
  audio.play();
}
```

---

## Challenge 2: The Security Audit Wake-Up Call

### The Problem
After building all the features, I ran a security audit. Found 14 vulnerabilities including:
- **Critical**: An API endpoint that let anyone modify any mixtape
- **High**: Admin dashboard API was completely unprotected
- **Medium**: Email header injection possible through user input

### The Solution
Systematic fixes in priority order:

| Issue | Fix |
|-------|-----|
| Unauthorized mixtape modification | Removed the PATCH endpoint entirely |
| Unprotected admin API | Added auth middleware to `/api/admin/*` |
| Email injection | Added `sanitizeForEmail()` function |
| Event type injection | Validate against allowed list |
| Weak admin password | Generated 24-char random password |
| Short share tokens | Increased from 8 to 12 characters |

### Lesson Learned
Security isn't something to add at the end. These issues were baked into the initial design. Next time: threat model before building.

---

## Challenge 3: Social Preview Images

### The Problem
When sharing links to WhatsApp, LinkedIn, or Twitter, the previews looked terrible—no image, generic text.

### The Solution
Dynamic OG image generation using Next.js:

```typescript
// src/app/m/[token]/opengraph-image.tsx
export default async function Image({ params }) {
  const mixtape = await getMixtape(params.token);

  return new ImageResponse(
    <div style={cassetteStyles}>
      <div>From {mixtape.sender_name}</div>
      <div>{mixtape.title}</div>
      <div>{trackCount} tracks</div>
    </div>
  );
}
```

Now every shared link shows a custom cassette image with the sender's name and track count.

### Gotcha
LinkedIn requires `og:url` explicitly—Next.js doesn't add it by default. Spent an hour debugging why LinkedIn showed warnings.

---

## Challenge 4: Viral Coefficient Wasn't Tracking

### The Problem
Built a "Make your own mixtape" CTA on every shared mixtape. Wanted to measure viral coefficient (how many new mixtapes each shared mixtape generates).

Checked the analytics: viral coefficient was 0.

### The Root Cause
The `cta_clicked` event wasn't being tracked. The button existed, but nobody wired up the analytics call.

### The Fix
```typescript
<Link
  href="/create"
  onClick={() => trackEvent('cta_clicked', {}, mixtape.id)}
>
  Make your own mixtape
</Link>
```

### Lesson Learned
Test your analytics pipeline end-to-end. Just because the dashboard shows the metric doesn't mean the events are firing.

---

## Challenge 5: The Admin Dashboard Wouldn't Load

### The Problem
Built an admin dashboard to see analytics. Deployed it. Opened it. White screen.

### The Investigation
1. Checked browser console: no errors
2. Checked Vercel logs: no errors
3. Checked network tab: 401 Unauthorized

### The Root Cause
The `ADMIN_PASSWORD` environment variable was set to the placeholder `your_admin_password` in local development. Forgot to set a real value.

### The Fix
```bash
# .env.local
ADMIN_PASSWORD=sp7LbRHKWotYVEmOXJgz9pHG
```

Also updated in Vercel's environment variables.

### Lesson Learned
Environment variables are the source of 90% of "it works locally but not in production" issues.

---

## Challenge 6: Unused Code Everywhere

### The Problem
The codebase had artifacts from abandoned features:
- A `users` table that was never populated
- A newsletter opt-in component that was never rendered
- An "Emails Captured" metric that always showed 0
- A cookie-based auth system for users that didn't exist

### The Solution
Ruthless cleanup:
- Removed the newsletter endpoint
- Removed the "Emails Captured" metric
- Removed the cookie-based user ID system
- Updated privacy policy to reflect actual data practices

### Lesson Learned
Technical debt accumulates fast when iterating quickly. Schedule regular cleanup passes.

---

## Challenge 7: Form UX on the Share Step

### The Problem
Original flow:
1. Add tracks → 2. Click "Send" → 3. Enter recipient details → 4. Actually send

But the form fields updated the database on every blur event via a PATCH endpoint. This was both a security risk AND confusing UX.

### The Solution
Consolidated the flow:
1. Add tracks → 2. Click "Send Tape" → 3. Enter details → 4. Click "Send Email"

All data now saves in one atomic operation when sending the email. Cleaner, safer, more intuitive.

---

## Challenge 8: Mobile Responsiveness

### The Problem
The boombox interface looked great on desktop. On mobile, it was a mess—panels overflowing, text too small, reels cropped.

### The Solution
Tailwind's responsive utilities + complete layout restructure for mobile:

```jsx
<div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
  {/* Left panel - full width on mobile, 3 cols on desktop */}
  <div className="lg:col-span-3 max-h-[350px] lg:max-h-[500px]">
```

Also added touch-friendly drag handles and larger tap targets.

---

## The Meta-Challenge: Working with AI

Building with Claude Code has its own learning curve:

### What Works
- Describing UI with analogies ("like a jewel case with the cassette inside")
- Iterating in small steps
- Providing context about the tech stack
- Asking it to explain what it's doing

### What Doesn't Work
- Vague requests ("make it better")
- Assuming it remembers previous sessions
- Skipping testing between iterations
- Not reading the code it generates

### My Workflow Now
1. Describe the feature in detail
2. Let Claude implement
3. **Read the code** (even if I don't understand it all)
4. Test thoroughly
5. Report specific issues with line numbers
6. Iterate

---

## Final Thoughts

Building Mixtape taught me that the hard parts of software aren't always the code. They're:
- Security (easy to overlook, painful to fix)
- UX details (the difference between "works" and "feels good")
- Operations (env vars, deployments, monitoring)
- Analytics (measuring what matters)

The code is just the medium. The craft is in everything else.

---

*More challenges and solutions at [The AI Cookbook](https://theaicookbook.substack.com)*
