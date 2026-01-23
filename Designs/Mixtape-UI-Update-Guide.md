# Mixtape UI Update - Wireframe Boombox Aesthetic

## Context

Mixtape v1 is functionally complete. This task is **UI only** - transform the visual design to a wireframe/blueprint aesthetic based on the reference images provided.

---

## Visual Reference Images

**Review these before starting:**

1. `mixtape-ref-4-boombox.jpeg` - **PRIMARY REFERENCE** - Boombox with dual cassette decks
2. `mixtape-ref-1-cassette-case.jpeg` - Cassette with case, shows labeling style
3. `mixtape-ref-2-empty-case.jpeg` - Empty case wireframe, for message display
4. `mixtape-ref-3-cassette.jpeg` - Single cassette, clean wireframe

---

## Design Direction

### Core Aesthetic
- **Pure black background** (#000000)
- **White wireframe/line art** - no fills, just outlines
- **Crosshatch patterns** for texture (speaker grilles, tape reels)
- **Pixel-art influences** in small details
- **Blueprint/schematic feel** - like technical drawings

### What This Is NOT
- Not colourful (except maybe red REC light)
- Not glossy or gradient-heavy
- Not "cheap retro" - this is premium, distinctive
- Not filled shapes - wireframes only

---

## Page-by-Page UI Spec

### 1. Create Mixtape Page (Boombox UI)

**Layout:** Full boombox interface (see `mixtape-ref-4-boombox.jpeg`)

**Components:**

```
┌─────────────────────────────────────────────────────────────┐
│  ┌─────┐   ┌──────────────────────────────┐   ┌─────┐      │
│  │█░█░█│   │  FM  22  44  60  85  100 120 │   │█░█░█│      │
│  │░█░█░│   │  AM  60  85  100  120  140   │   │░█░█░│      │
│  └─────┘   └──────────────────────────────┘   └─────┘      │
│                                                             │
│  ┌─────────────────┐           ┌─────────────────┐         │
│  │ SEARCH          │           │ ● REC           │         │
│  │ ┌──┐     ┌──┐  │           │ ┌──┐     ┌──┐  │         │
│  │ │  │     │  │  │           │ │  │     │  │  │         │
│  │ └──┘     └──┘  │           │ └──┘     └──┘  │         │
│  │                 │           │                 │         │
│  │ 1. Song Result  │           │ 1. Added Song   │         │
│  │ 2. Song Result  │           │ 2. Added Song   │         │
│  │ 3. Song Result  │           │ 3. ...          │         │
│  └─────────────────┘           └─────────────────┘         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [SELECT]  [◄◄]  [►►]    │    [●REC]  [▶]  [■]  [⏏] │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌───────┐                                     ┌───────┐   │
│  │█░█░█░█│                                     │█░█░█░█│   │
│  │░█░█░█░│         Speaker Grilles             │░█░█░█░│   │
│  │█░█░█░█│         (crosshatch)                │█░█░█░█│   │
│  └───────┘                                     └───────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Left Cassette Deck - SEARCH:**
- Search input field styled as cassette label area
- Search results appear as track listing (1. Song - Artist, 2. Song - Artist...)
- Tape reels are static or spin subtly on interaction
- Click a result to add to right deck

**Right Cassette Deck - REC (Your Mixtape):**
- Shows tracks being added to mixtape
- "● REC" indicator (could blink red when adding)
- Tape reels spin when tracks are added
- Tracks numbered 1-12 max

**Transport Controls:**
- LEFT SIDE: SELECT (confirm), PREV (◄◄), NEXT (►►)
- RIGHT SIDE: REC (●), PLAY (▶), STOP (■), EJECT (⏏)
- EJECT = Finish/send mixtape

**Radio Dial (top):**
- Could animate during search ("tuning in")
- Decorative but adds to the aesthetic

**Speakers:**
- Crosshatch pattern (see references)
- Left and right of boombox

---

### 2. Personalisation Step

After tracks are selected, user adds:
- **Mixtape name** → Displayed on cassette label
- **Recipient name** → "For: [Name]"
- **Message** → Displayed in cassette case (see `mixtape-ref-2-empty-case.jpeg`)

**UI Option A:** Overlay/modal with cassette case showing message input
**UI Option B:** Slide-out panel styled as cassette case

---

### 3. Recipient Page (Cassette + Case View)

**Layout:** Cassette with open case (see `mixtape-ref-1-cassette-case.jpeg`)

```
┌─────────────────────────────────────────┐
│                                         │
│   ┌─────────────────────────────────┐   │
│   │         MIXTAPE NAME            │   │
│   │         ┌─────────┐             │   │
│   │         │ ┌─┐ ┌─┐ │             │   │
│   │         │ └─┘ └─┘ │             │   │
│   │         └─────────┘             │   │
│   │         For: [Recipient]        │   │
│   │         From: [Sender]          │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  SIDE A        TRACKS 1-6       │   │
│   │  ┌──┐                    ┌──┐   │   │
│   │  │  │   1. Song - Artist │  │   │   │
│   │  └──┘   2. Song - Artist └──┘   │   │
│   │         3. Song - Artist        │   │
│   │         4. Song - Artist        │   │
│   │         5. Song - Artist        │   │
│   │         6. Song - Artist        │   │
│   │                                 │   │
│   │         [▶ PLAY MIXTAPE]        │   │
│   └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘

    "[Personal message goes here]"
    
    ─────────────────────────────────────
    
    Want to make your own?
    [CREATE A MIXTAPE]
    
    From the creator of The AI Cookbook
```

**Cassette Case (top):**
- Shows mixtape name on label
- Small cassette icon
- To/From names

**Cassette (bottom):**
- Track listing (SIDE A / SIDE B if >6 tracks)
- Tape reels
- PLAY button triggers Apple Music playback

**Message:**
- Personal message displayed below cassette
- Wireframe styling

**CTA:**
- "Create a Mixtape" button (viral loop)
- AI Cookbook attribution

---

### 4. Email Template

Match the wireframe aesthetic:

```
┌─────────────────────────────────────────┐
│                                         │
│     [Sender] made you a mixtape         │
│                                         │
│     ┌─────────────────────────┐         │
│     │    [Cassette graphic]   │         │
│     │    MIXTAPE NAME         │         │
│     └─────────────────────────┘         │
│                                         │
│     "[Personal message]"                │
│                                         │
│     1. Song - Artist                    │
│     2. Song - Artist                    │
│     3. Song - Artist                    │
│     + 3 more tracks...                  │
│                                         │
│     ┌─────────────────────────┐         │
│     │    [▶ PLAY MIXTAPE]     │         │
│     └─────────────────────────┘         │
│                                         │
│     ───────────────────────────         │
│     From the creator of                 │
│     The AI Cookbook                     │
│                                         │
└─────────────────────────────────────────┘
```

- Black background, white text/lines
- Cassette graphic as header image (can use static version of `mixtape-ref-3-cassette.jpeg` or SVG)
- Clear CTA button

---

## Implementation Notes

### Approach Options

**Option A: SVG-based**
- Create SVG versions of boombox, cassette, case
- Manipulate with CSS/JS for interactions
- Crisp at all sizes
- Recommended for the wireframe aesthetic

**Option B: CSS Art**
- Build shapes with borders and box-shadows
- More flexible for dynamic content
- Harder to match the exact reference style

**Option C: Hybrid**
- Static SVG for complex elements (speakers, tape reels)
- CSS for containers and text areas
- Probably the most practical

### Animations (Nice to Have)

- Tape reels spin slowly during playback
- REC light blinks when adding tracks
- Radio dial moves during search
- Subtle hover states on buttons

### Typography

- Monospace or pixel-style font for labels (e.g., "SIDE A", "TRACKS 1-6")
- Clean sans-serif for song titles and body text
- All caps for cassette labels

### Responsive

- Boombox scales down for mobile (may need simplified version)
- Cassette/case view works well on mobile as-is

---

## Files Provided

- `mixtape-ref-1-cassette-case.jpeg` - Cassette with case
- `mixtape-ref-2-empty-case.jpeg` - Empty case
- `mixtape-ref-3-cassette.jpeg` - Single cassette
- `mixtape-ref-4-boombox.jpeg` - **Primary UI reference**

---

## Acceptance Criteria

- [ ] Create page uses boombox UI with dual cassette decks
- [ ] Search results appear in left deck
- [ ] Mixtape tracks appear in right deck with REC indicator
- [ ] Transport controls are functional and styled
- [ ] Recipient page shows cassette + case layout
- [ ] Personal message displays in/near case
- [ ] Track listing visible on cassette
- [ ] Play button triggers Apple Music playback
- [ ] "Create a Mixtape" CTA present (viral loop)
- [ ] AI Cookbook attribution in footer
- [ ] Pure black background throughout
- [ ] White wireframe aesthetic matches references
- [ ] Mobile responsive
- [ ] Email template matches aesthetic (if in scope)
