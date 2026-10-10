# Flow audit: how every scene follows from your choices

Generated from `src/data/scenarios/*.json` by `node scripts/flow-audit.mjs`. Every one of the 4 × 256 possible paths was also resolved automatically and reaches valid art, gags and an ending.

**Rule:** a scene only describes where you are and what you have; it never makes the next choice for you. If an earlier choice makes a later choice impossible, that later choice is replaced.

## ZoomZoom Rated You 4.9

**Stage 1. Getting in**

- Default: Congratulations. A stranger has volunteered to drive you through the night. The app says he’s lovely. The app also says the Wi-Fi is free.

**Stage 2. The ride begins**

- Default: The trip has begun. So has the small talk.

**Stage 3. The turn that isn’t on the map**

- Default: Ten minutes in, the cab turns onto a road your map doesn’t show. The GPS is making a face. You can’t see it, but you can feel it.

**Stage 4. The moment of truth**

- Default: A lit tea stall ahead. Your phone is at 12%. Plot twist: your battery has joined the story.
- After “Asked for a water stop” (stage 3): new opening. He pulls over at the lit tea stall for your water. Your phone is at 12%. Plot twist: your battery has joined the story.

**Endings**

- *Chai, Upgraded*: after “Got out at the tea stall” (stage 4), with a high enough score.
- *Dispatch Has Joined the Ride*: after “Called the emergency number” (stage 4), with a high enough score.
- *The Most Narrated Ride in History*: after “Messaged the app’s support” (stage 4), with a high enough score.
- *Mummy Has Entered the Chat*: low score. Its opening line changes with stage 4, so it always starts where you actually are.

## The “Simple Dinner” Invite

**Stage 1. The first reply**

- Default: 11:47 pm. Vikram Sir, Senior Manager, has messaged. He has said “growth” four times today. This is the fifth.

**Stage 2. He pushes**

- Default: 11:58 pm. He’s typing. He’s still typing. Nothing good has ever taken this long to type.
- After “Said yes on autopilot” (stage 1): new scene. 
- After “Moved it to office hours” (stage 1): new scene. 
- After “Suggested adding a teammate” (stage 1): new scene. 
- After “Left it on seen” (stage 1): new scene. 

**Stage 3. Documenting vs deleting**

- Default: 8:05 am. The chat is still there. So is the wink. Your thumb hovers over “Delete for me”: the button that has ended many problems, and ze…
- After “Agreed to a “quick” dinner” (stage 2): new scene. 
- After “Repeated: office hours only” (stage 2): new scene. 
- After “Changed the subject” (stage 2): new scene. 
- After “Looped in your manager” (stage 2): new scene. 

**Stage 4. Deciding who to tell**

- Default: 1 pm. The samosas are cold. The chai is hot. Meera leans in: “Did Vikram Sir message you last night?”
- After “Deleted the chat” (stage 3): new opening, new scene, adjusted choices. 1 pm. Cold samosas, hot chai. On your phone: a deleted chat and a feeling. Meera leans in: “Did Vikram Sir message you last night?”
- After “Saved screenshots in a “Growth Archive”” (stage 3): new opening, new scene. 1 pm. Cold samosas, hot chai. In your pocket: a folder called “Growth Archive (6)”. Meera leans in: “Did Vikram Sir message you last night?”
- After “Emailed yourself a dated note” (stage 3): new opening, new scene. 1 pm. Cold samosas, hot chai. In your inbox: a dated email to yourself. Meera leans in: “Did Vikram Sir message you last night?”
- After “Checked with a friend” (stage 3): new opening, new scene. 1 pm. Cold samosas, hot chai. Your friend’s three skulls are still on your screen. Meera leans in: “Did Vikram Sir message you last night?”

**Endings**

- *The Group Chat Awakens*: after “Told a trusted colleague” (stage 4), with a high enough score.
- *Minutes of the Meeting*: after “Asked how the Internal Committee works” (stage 4), with a high enough score.
- *Growth, Discussed (In Daylight)*: after “Showed your manager the chat” (stage 4), with a high enough score.
- *The Calendar Hostage Situation*: low score.

## Rush Hour, Personal Space Not Included

**Stage 1. Noticing**

- Default: 6:10 pm, Line 4. The coach is at 300% capacity. The announcer is an optimist. There is no “inside”. There is only him.

**Stage 2. Responding**

- Default: The train lurches. His elbow “accidentally” finds you. Physics has never been this targeted.
- After “Moved towards other women” (stage 1): new opening. You moved. He moved. Past four people and a bicycle. Commitment. Then the train lurches, and his elbow “accidentally” finds you.

**Stage 3. Getting help**

- Default: Two aunties have noticed. They have the energy of women who have seen this before, and have opinions about it.
- After “Said it out loud” (stage 2): new opening. Two aunties turned around at “Don’t touch me”. They have not turned back. They have opinions.

**Stage 4. The aftermath**

- Default: He’s still there. Now he’s humming. Your stop is approaching. So is a headache.
- After “Told the aunties” (stage 3): new opening, new scene, adjusted choices. At Kamal Nagar, the aunties escort him out mid-lecture. His sunglasses don’t make it. They lie on the floor of coach 3, abandoned. Your h…
- After “Told the station staff” (stage 3): new opening, new scene, adjusted choices. Platform 2, Kamal Nagar. The staff member is filling in a form with the handwriting of a doctor. The chai stall is open. Your heart is do…
- After “Called 112 with details” (stage 3): new opening, new scene, adjusted choices. At Kamal Nagar, two officers are waiting exactly at coach 3. He takes his sunglasses off for the first time all evening. It does not help.

**Endings**

- *The Committee Has Ruled*: after “Told the aunties” (stage 3), with a high enough score.
- *Platform Justice*: after “Told the station staff” (stage 3), with a high enough score.
- *Coach 3, Over*: after “Called 112 with details” (stage 3), with a high enough score.
- *Three Stations Too Far*: low score. Its opening line changes with stage 3, so it always starts where you actually are.

## The Wedding Uncle Special

**Stage 1. The first question**

- Default: Your cousin’s sangeet. The dhol is loud. The buffet is louder. Bunty Uncle has located you between the paneer and the pulao. He is holdin…

**Stage 2. Escalation**

- Default: Bunty Uncle has followed you to your table. His plate now has seven puris. His chair is so close that the chair is uncomfortable.
- After “The Mummy’s-calling exit” (stage 1): new opening. You said Mummy was calling. Bunty Uncle has followed you to look for Mummy. Mummy is not here. He sits down anyway, with seven puris.

**Stage 3. Asking an ally**

- Default: Bunty Uncle is explaining land rates. Across the hall, cousin Pinky makes eye contact over a mehendi cone. She knows. Every cousin knows.
- After “Stood up and moved” (stage 2): new opening, new scene. You’re by the dance floor now. Bunty Uncle has arrived too, plate first. Twelve puris. Across the floor, cousin Pinky makes eye contact. …
- After “Said it plainly” (stage 2): new opening. The chair retreated two inches. Bunty Uncle did not. Across the hall, cousin Pinky makes eye contact over a mehendi cone. She knows. Ever…

**Stage 4. Reclaiming the room**

- Default: Bunty Uncle is back. Phone in one hand. The plate balanced on the other, somehow. His arm is already out.
- After “Sent the cousin signal” (stage 3): new opening, new scene. You and Pinky are deep in “mehendi business”. Bunty Uncle appears anyway, phone first, plate second.
- After “Told a trusted elder” (stage 3): new opening, new scene. Mummy is watching from across the room. Bunty Uncle hasn’t noticed. Yet. His phone is out, his arm is out, the plate is somehow still bal…
- After “Joined the dance crew” (stage 3): new opening, new scene, adjusted choices. DJ Bablu pauses the song. Bunty Uncle steps onto the dance floor, phone first, plate second.

**Endings**

- *Uncle, Cropped*: after “Called a group photo” (stage 4), with a high enough score.
- *Dance-Off Champion*: after “Said no and walked away” (stage 4), with a high enough score.
- *Mummy Took the Photo*: after “Brought Mummy in” (stage 4), with a high enough score.
- *Two Hours of Property Rates*: low score. Its opening line changes with stage 4, so it always starts where you actually are.
