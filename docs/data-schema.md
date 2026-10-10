# Content data schema

All content lives in `src/data/`. You can edit it without touching UI code.
JSON files are used so non-developers can edit them; a missing optional field
never breaks the app.

```
src/data/
  scenarios/
    index.json          list of scenarios + order + status
    cab.json            one file per scenario
    dinner.json  ...
  helplines.json        "On a serious note" resources (Stage 3)
```

---

## 1. Scenario index — `scenarios/index.json`

```json
{
  "version": 1,
  "scenarios": [
    { "id": "cab", "title": "…", "tagline": "…", "minutes": 4, "setting": "cab", "status": "ready", "file": "cab.json" },
    { "id": "dinner", "title": "…", "tagline": "…", "minutes": 4, "setting": "workplace", "status": "coming-soon" }
  ]
}
```

| Field | Type | Notes |
|---|---|---|
| `id` | string | Used in URLs (`#/play/cab`) and saved progress. Never rename once shipped. |
| `status` | `"ready"` \| `"preview"` \| `"coming-soon"` | Coming-soon shows a "Coming soon" card; preview plays a short stub. |
| `title`, `tagline`, `minutes` | | Shown on the scenario card, so the card list needs no extra file loads. |

## 2. Scenario — `scenarios/<id>.json`

```json
{
  "id": "cab",
  "version": 1,
  "title": "ZoomZoom Rated You 4.9",
  "tagline": "A stranger, a car, a 4.9 rating. What could go wrong?",
  "minutes": 4,
  "setting": "cab",
  "contentNote": "A cab ride takes an unexpected route. Nothing graphic.",
  "threshold": 3,
  "stages": [ /* Stage, exactly 4 */ ],
  "endings": {
    "good":     { /* Ending */ },
    "funnyBad": { /* Ending */ }
  }
}
```

| Field | Type | Notes |
|---|---|---|
| `threshold` | number | **Good ending if total weight ≥ threshold**, otherwise Funny-Bad. Cab uses 3. |
| `setting` | enum | Same list as submission `setting` (below). Later used for profile filtering. |
| `minutes` | number | Shown as "about 4 min" on the card. |

### Stage

```json
{
  "id": "boarding",
  "title": "Getting in",
  "scene": "10:40 pm. Your cab arrives. The app says \"Ramesh, 4.9 star.\"",
  "narrator": "Congratulations. A stranger has volunteered to drive you through the night...",
  "panel": { /* Panel */ },
  "choices": [ /* Choice, 3-4 */ ]
}
```

### Panel

```json
{
  "art": "cab-arrives",
  "alt": "A yellow ZoomZoom cab pulls up under a streetlight. You stand on the kerb, phone in hand.",
  "sfx": "SCREECH",
  "bubble": { "speaker": "Driver", "text": "Madam, Lakeview Colony?" }
}
```

| Field | Type | Notes |
|---|---|---|
| `art` | string | Key in `src/art/index.js` (see `illustrations.md`). Each art entry has an SVG and a `play()` entrance animation. |
| `alt` | string | **Required.** Must carry the full meaning of the picture. |
| `sfx` | string? | Optional sound-effect burst word. Also read out as "Sound effect: SCREECH". |
| `bubble` | object? | Optional speech bubble; `speaker` is announced to screen readers. |

### Choice

```json
{
  "id": "b",
  "text": "Check the plate and driver photo against the app, then get in.",
  "reaction": "Look at you, running a background check at 10:40 pm.",
  "label": "Checked the plate and photo",
  "weight": 1
}
```

| Field | Type | Notes |
|---|---|---|
| `weight` | `1` \| `0` \| `-1` | Hidden. smart = +1, neutral = 0, unhelpful = -1. Never shown to the player. |
| `reaction` | string | Narrator one-liner shown immediately after choosing. Must not blame the player. |
| `label` | string | Short past-tense summary used in the "Your route" debrief. |
| `move` | string? | Name of the move, for +1 choices. Listed under "Moves unlocked" on the good ending. |

Each stage also has an optional `another` object, shown in the debrief when
the player picked a neutral/unhelpful choice or skipped the stage. Phrase it as
an option, never "you should":

```json
"another": { "choice": "b", "move": "The plate check", "why": "Matching the plate and photo takes about ten seconds…" }
```

### Real-life debrief (per scenario)

```json
"realLife": {
  "disclaimer": "This was satire. … nothing that happens to you is your fault. These are ideas, not rules.",
  "tips": ["Before you get in, match the number plate…", "…"]
}
```

Tips must be general. Any specific number or service must also appear in the
verified `helplines.json`.

### Ending

```json
{
  "title": "Five Stars, One Footnote",
  "art": "home-arrival",
  "alt": "You at your door, phone at 30%, typing a review.",
  "narration": "Ramesh found the main road with remarkable speed...",
  "moves": ["Trip sharing", "The polite question", "The strategic water break"],
  "hint": "Try speaking up a little earlier."
}
```

`hint` is shown when the player presses "See the other ending" from this ending.

**Moves unlocked is built from the player's choices:** the good ending lists
the `move` of each +1 choice made; the funny-bad ending lists `another.move`
for each stage that went badly or was skipped, plus `extraMove`. `moves` is
only a fallback if that list is empty.

## 3. Saved progress (localStorage key `cyc:progress`)

```json
{ "version": 1, "seen": { "cab": ["good", "funnyBad"] } }
```

Only which endings were seen. No choices, timings or identifiers.
A skipped stage counts as weight 0 and shows as "Skipped" in the debrief.

## 4. Profile (localStorage key `cyc:profile`) — placeholder only

```json
{
  "version": 1,
  "displayName": "Chai Lover",
  "ageBand": "25-34",
  "gender": "woman",
  "genderSelf": "",
  "work": "full-time",
  "marital": "prefer-not",
  "cityType": "metro",
  "languages": ["en", "hi"],
  "transit": "daily",
  "createdAt": "2026-10-09T18:00:00Z"
}
```

- Every field is optional; a missing field means "not answered". `"prefer-not"` means "Prefer not to say".
- `ageBand` values: `under-18`, `18-24`, `25-34`, `35-44`, `45-54`, `55-plus`, `prefer-not`.
  **If `under-18` is chosen, nothing is saved at all** (no profile object is written).
- No password, email, phone number or exact location is ever stored. The demo log-in stores nothing.
- Read through `getProfile()` (returns the object or `null`).

## 5. Submissions (localStorage key `cyc:submissions`) — "Tell us your experience"

```json
[
  {
    "id": "s_8f3k2",
    "createdAt": "2026-10-09T18:00:00Z",
    "type": "share",
    "setting": "public-transport",
    "text": "…",
    "wish": "…",
    "tone": "funny",
    "permission": false,
    "profile": { "ageBand": "25-34", "cityType": "metro" },
    "sample": false
  }
]
```

| Field | Values |
|---|---|
| `type` | `share` \| `suggest` \| `both` |
| `setting` | `cab`, `public-transport`, `workplace`, `campus`, `street`, `home`, `family-function`, `online`, `other` |
| `text` | ≤ 1500 chars |
| `wish` | ≤ 600 chars, optional |
| `tone` | `funny` \| `serious` \| `not-sure` |
| `permission` | boolean, false by default |
| `profile` | only present if "Use my profile answers" was ticked |
| `sample` | true for fake demo entries on `/admin-demo` |

Drafts are kept under `cyc:submissionDraft` (one object, same shape) and removed on submit or "Take a break".

## 6. Helplines — `helplines.json` (filled in Stage 3)

```json
{
  "version": 1,
  "lastReviewed": "2026-10-09",
  "urgent": ["112", "1091"],
  "sections": [
    {
      "id": "emergency",
      "title": "Emergency now",
      "items": [
        {
          "name": "Emergency Response Support System",
          "what": "Police, fire and ambulance, any time.",
          "phone": "112",
          "url": null,
          "regions": "All India",
          "languages": null,
          "howItWorks": "…",
          "source": "https://…official page…",
          "verified": "2026-10-09"
        }
      ]
    }
  ]
}
```

Every item **must** have a `source` (official or government URL) and a
`verified` date. An item without both is not rendered.

## 7. Display preferences

`cyc:textSize` (`s`/`m`/`l`) and `cyc:palette` (Stage 0 only; removed once a palette is chosen).
