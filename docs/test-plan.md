# Choose Your Chaos: user-test plan

A moderated, think-aloud usability study with 5–8 participants, run on the production build. It covers what to do before, during and after each session, the scripts to read, and the sheets to fill in.

> **Before recruiting:** check with your instructor whether this study needs ethics approval. The topics (cab safety, workplace harassment, groping on public transport, invasive relatives) are sensitive, so it probably does.

## 1. Goals and research questions

| # | Question | Evidence |
|---|---|---|
| RQ1 | Can first-time players start a scenario, play it, and find the other endings without help? | Task success, time on task, observation |
| RQ2 | Is the player (auto-advancing scenes, choices on the canvas, Pause menu) understandable? | Think-aloud, hesitation notes, test-mode log (pauses, rewinds, decision times) |
| RQ3 | Does the humour land without punching at the player or the harm? | “Did any joke make you uncomfortable?”, observation of laughs and winces |
| RQ4 | Do players come away with usable ideas? | “Did it feel empowering?”, recall check |
| RQ5 | Overall usability | SUS score (target ≥ 68, the commonly cited average) |

## 2. Participants

- **Number:** 5–8.
- **Who:** adult women (18+) who live, study or work in an Indian city and use cabs, metro, local trains or buses. Aim for a mix of ages and of how comfortable they are with games.
- **Exclude:** under-18s. Anyone who says during screening that the topics would be distressing should not be pushed to take part.
- **Recruiting message** should include the content note in section 4, so people can decide before they agree.
- **Codes, not names:** give each person a code (P1, P2…). Keep the code-to-name list (if any) separately from all session data, or don’t keep one at all.

## 3. Setup

1. Build and serve the game (see README, “Deploy”), or use the hosted link. Use one device per session; a phone at 360–412 px width is the main target, so run at least half the sessions on a phone.
2. Open `#/test-mode` (not linked anywhere), tick **Record play-throughs on this device**, and enter the participant code, for example `P3`. A “Test mode” tag appears in the header.
3. Clear old data between participants: on `#/test-mode`, export first, then **Delete the log and feedback**. Also use **Delete everything this prototype stored** on the privacy page, so the next participant sees a fresh game (no endings found, default text size, sound off).
4. Have ready: the consent form, this script, the observation sheet (section 9), the SUS form (section 7), and the support card (section 10).
5. If you record the screen or audio, say so in the consent form and get a separate yes for it.

### Scenario assignment

Everyone plays **ZoomZoom Rated You 4.9** (the cab) first, since all the tasks are written around it. Each participant then plays **one** of the other three, rotated so each is covered about equally. They can swap or skip if they’d rather not play one.

| Participant | Second scenario |
|---|---|
| P1, P4, P7 | The “Simple Dinner” Invite (late-night messages from a senior colleague) |
| P2, P5, P8 | Rush Hour, Personal Space Not Included (being touched in a crowded train) |
| P3, P6 | The Wedding Uncle Special (invasive questions and a relative who won’t take a hint) |

## 4. Consent and content note (read aloud, then sign)

> Thanks for helping. This is a university project: a comic game about everyday safety situations in India, told with sarcasm. Scenes include a cab that goes off-route at night, a senior colleague's late-night messages, someone touching you in a crowded train, and a pushy relative at a wedding. Nobody is ever hurt, and nothing is graphic.
>
> We're testing the game, not you. There are no right or wrong answers or choices. You can skip any scene, take a break, or stop completely at any time, without giving a reason.
>
> Please don't share personal experiences today. If something comes up for you, just tell me and we'll stop.
>
> The game records your choices and timings on this device, under a code, not your name. We don't record anything that identifies you. [If recording: We'd also like to record the screen and your voice. That's optional.]

## 5. Session outline (about 40 minutes)

| Time | Step |
|---|---|
| 0–5 min | Welcome, consent, content note, think-aloud warm-up |
| 5–25 min | Tasks 1–7 (section 6) |
| 25–30 min | Three game questions (in the app) and SUS (on paper or a form) |
| 30–35 min | Short interview (section 8) |
| 35–40 min | Recall check, support card, thanks |

### Think-aloud warm-up (read aloud)

> As you play, please say whatever you're thinking: what you're looking at, what you expect to happen, what's confusing, what's funny. If you go quiet, I'll just say "What are you thinking?". I can't help with the game during the tasks, because we want to see where it's unclear, but I'll answer everything at the end.

Neutral prompts only: "What are you thinking?", "What did you expect to happen?", "What are you looking for?". Never "Did you see the button?" or "Was that funny?".

## 6. Tasks

Read each task aloud. Don't use the on-screen words (for example, say "play it again to see what else could happen", not "See the other ending").

| # | Task (read aloud) | Success means | What it tests |
|---|---|---|---|
| T1 | “Start the cab story.” (From the home page.) | Reaches stage 1 of the cab scenario | The path from landing to playing |
| T2 | “Play it through to the end, choosing whatever you’d actually do.” | Reaches an ending page | Auto-advancing scenes, choices on the canvas, the reaction pop-up |
| T3 | “You picked something a moment ago. Go back and choose differently.” (Say this during stage 2 or 3.) | Uses Pause / Exit → Back one choice | Discoverability of the Pause menu |
| T4 | “Find out what else could have happened in this story.” | Starts a hint replay or Play again and reaches a different ending | Replay and endings tally |
| T5 | “Make the text bigger.” | Text size set to L | Text-size control (header, or the Menu on a phone) |
| T6 | “Imagine a friend needs help after something like this. Find somewhere she could call.” | Opens On a serious note and finds a relevant helpline | Support is findable, from the ending page or the nav |
| T7 | “Now play [second scenario].” Then: “Turn the sound on.” | Plays to an ending; sound on in the Pause menu or the header | Second scenario, the sound toggle |

Record for each task: success (yes / with help / no), time, and observations.

**What the test-mode log captures automatically:** each stage's choice and how long it took to decide, skipped scenes, Back one choice, pauses, Fast-forward, the ending reached, and total time. Export it as CSV from `#/test-mode` after each session.

## 7. Questionnaires

### a) The three game questions (in the app)

At the end of T7, ask the participant to tap **How was it? Three quick questions about the game** on the ending page (or footer → Feedback on the game). It asks:

1. Did it feel realistic? (1–5)
2. Did it feel empowering? (1–5)
3. Did any joke make you uncomfortable? (No / Yes / Not sure, plus which one)

The answers are saved under the participant code and included in the test-mode JSON export.

### b) System Usability Scale (SUS)

Each statement is rated from 1 (strongly disagree) to 5 (strongly agree). It's standard to replace "system" with "game".

1. I think that I would like to use this game frequently.
2. I found the game unnecessarily complex.
3. I thought the game was easy to use.
4. I think that I would need the support of a technical person to be able to use this game.
5. I found the various functions in this game were well integrated.
6. I thought there was too much inconsistency in this game.
7. I would imagine that most people would learn to use this game very quickly.
8. I found the game very cumbersome to use.
9. I felt very confident using the game.
10. I needed to learn a lot of things before I could get going with this game.

**Scoring:** for odd items, the score is (rating − 1). For even items, it's (5 − rating). Add them up and multiply by 2.5, which gives a score from 0 to 100. A score of 68 is roughly average, and above 80 is good.

## 8. Short interview

1. In your own words, what is this game for?
2. Which moment stuck with you, and why?
3. Was there a moment you didn't know what to do, or what was happening?
4. How did the narrator's jokes feel? Was anyone made fun of who shouldn't have been?
5. Did any choice feel like it was blaming you?
6. Would you share this with a friend? What would you say about it?
7. What would you change first?

**Recall check (about 10 minutes after the cab ending):** "If you were in a cab that went off-route at night, name one thing you could do." Note whether the answer matches a move from the game (check the plate, share the trip, ask about the route, ask to stop somewhere lit, call someone, use the app's safety or support options). Don't prompt.

## 9. Observation sheet (one per participant)

Participant: ____ Date: ____ Device / width: ____ Second scenario: ____

| Time | Task | What happened (quote, action) | Type | Severity (0–3) |
|---|---|---|---|---|
| | | | Hesitation / Error / Confusion / Laugh / Wince / Skip / Comment | |
| | | | | |
| | | | | |

**Severity scale:**
- 0: not a problem.
- 1: cosmetic.
- 2: slowed them down, but they recovered.
- 3: blocked them, or caused distress.

**Watch especially for:**
- Waiting for scenes, or trying to tap the scene before the choices appear.
- Reading the reaction before it auto-advances. Are they able to? Do they turn auto-advance off?
- Finding the Pause menu.
- Reactions to the debrief ("Your route", "Another move here"). Does it read as advice or as blame?
- Any joke that gets a wince rather than a laugh. Note which line.
- Signs of distress. If you see any, stop and check in: "Shall we take a break or stop here?"

### Task summary

| Task | Success | Time | Notes |
|---|---|---|---|
| T1 | Y / Help / N | | |
| T2 | Y / Help / N | | |
| T3 | Y / Help / N | | |
| T4 | Y / Help / N | | |
| T5 | Y / Help / N | | |
| T6 | Y / Help / N | | |
| T7 | Y / Help / N | | |

## 10. Aftercare (every participant, whatever happened)

- Thank them, and remind them that their choices in the game said nothing about them.
- Give them the support card: point them to **On a serious note** (`#/serious`) on their own phone, or give them a printout of that page. Don't copy the numbers by hand; print the page so the numbers stay accurate.
- If they became distressed: stop the session, don't collect any more data unless they want to continue, and make sure they know where support is.

## 11. Analysis

- **Task success rates and times:** a table per task. Any task under 80% success is a priority fix.
- **Test-mode log (CSV):** median decision time per stage, and stages most often skipped or rewound. Long decision times on a stage can mean the choices are unclear, or that the stage is emotionally heavy. Use the think-aloud notes to tell which.
- **SUS:** each participant's score, plus the mean and range.
- **The three game questions:** distribution of 1–5 ratings, and every joke named as uncomfortable. A joke named by two or more participants gets rewritten. Log it in `docs/content-review.md`.
- **Recall:** the share of participants naming a move from the game.
- **Issues list:** combine the observation sheets. Group by problem, then sort by severity × how many participants hit it.

## 12. Data handling

- No names, phone numbers or contact details in the game, the log or the notes. Use participant codes only.
- After each session, the facilitator exports the JSON and CSV from `#/test-mode` and stores them with the course's data-handling rules, then deletes them from the device.
- The in-app “Tell us your experience” form is **not** part of this study. Real submissions there wait for instructor approval.
