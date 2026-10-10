# Illustration and panel list

**Style for all art:** flat 2D inline SVG; 3–4px ink outlines; flat fills from
palette tokens plus a halftone dot pattern for shade; no gradients or photos;
target ≤ 6 KB per illustration. Each one has an `alt` text in the scenario data
that carries the full meaning.

**The player** is always shown from behind or the side, or face-light: a hair
shape (bun, plait, short crop, dupatta or scarf; the variant rotates per
scenario), shoulders and hands. No facial features, so any woman can project
herself onto her. Skin and hair use a range of tones, also rotated per scenario.

**"Bad actor" characters** are exaggerated and unmistakably cartoonish
(huge sunglasses at night, a moustache that enters the room first, a phone
with 47 unread forwards). Not tied to any region, religion, caste, body type or
accent. They are never shown touching or threatening the player; scenes cut
before anything happens.

## Shared kit (reused everywhere)
| Name | What | Animation |
|---|---|---|
| `phone` | Phone in hand with a swappable screen (map, chat, battery %) | Battery drains; screen slides |
| `sfx-burst` | Starburst behind a word | Pop + slight rotation |
| `narrator-caption` | Yellow caption box (CSS, not SVG) | None |
| `ending-card` | Title-card frame for endings, "Moves unlocked" stamp | Stamp pop |
| `bg-street-night` / `bg-street-day` | Re-usable background strip | Slow parallax (off with reduced motion) |

## 1. Cab: "ZoomZoom Rated You 4.9"
| Stage | Panels |
|---|---|
| 1 Getting in | `cab-arrives` (cab under streetlight, player from behind); `app-card` (ZoomZoom screen: "Ramesh, 4.9★", plate) |
| 2 Ride begins | `cab-interior` (back seat view, driver's back + rear-view mirror with huge sunglasses); `phone-map` (route line, "20 min") |
| 3 Off the map | `map-mismatch` (blue route goes one way, cab icon goes another, GPS with a :/ face); SFX "BEEP" |
| 4 Moment of truth | `tea-stall` (lit chai stall ahead, kettle steam); `phone-battery-12` |
| Endings | Good: `home-door` (phone, five stars + a footnote). Funny-bad: `scenic-route-montage` (flyover, closed fuel pump, wedding band), `phone-battery-1` |

## 2. The "Simple Dinner" invite
| Stage | Panels |
|---|---|
| 1 First reply | `phone-chat-late` (WhatsApp-like chat in a fictional app "ChatChat", 11:47 pm, "Let's discuss your growth 🙂 over dinner") |
| 2 He pushes | `chat-typing-dots` (endless "typing…"); SFX "PING" ×3 |
| 3 Document vs delete | `screenshot-flash` (camera flash on the screen); `folder-receipts` |
| 4 Who to tell | `office-cafeteria` (ally colleague with chai, seen from side); `ic-door` (Internal Committee room door, calm) |
| Endings | Good: `meeting-room-daylight` (meeting in a glass room, other people present). Funny-bad: `calendar-chaos` (seven reschedules) |

## 3. Local train / metro / bus rush
| Stage | Panels |
|---|---|
| 1 Noticing | `crowd-coach` (packed coach, a figure standing too close, drawn as a clumsy cartoon with a giant bag); SFX "SHOVE" |
| 2 Responding | `bag-barrier` (player's bag moves between them); speech bubble |
| 3 Crowd/staff | `aunty-squad` (two passengers turn around, unimpressed); `help-button` (fictional coach help-point) |
| 4 Aftermath | `platform-exit` (player steps off, guard nearby) |
| Endings | Good: `ladies-coach-seat` (a seat, finally). Funny-bad: `missed-stop` (three stations past, the long walk back) |

## 4. Family/home setting (pending your choice: Wedding Uncle or PG Landlord)
| Stage | Panels (Wedding Uncle version) |
|---|---|
| 1 First question | `buffet-line` (uncle with a plate that has its own postcode); bubble "So, when is your good news?" |
| 2 Escalation | `uncle-closer` (hand on chair back, drawn as comic scale shift); SFX "HAW HAW" |
| 3 Ally | `cousin-signal` (cousin across the room gets the look) |
| 4 Reclaim the room | `dance-floor` (player pulled into the sangeet dance, uncle left holding a gulab jamun) |
| Endings | Good: `group-photo` (player centre, uncle cropped). Funny-bad: `stuck-at-table` (two hours of property rates) |
