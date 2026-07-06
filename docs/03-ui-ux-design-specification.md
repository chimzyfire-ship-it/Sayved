# Sayved Sharp MVP - UI/UX Design Specification

## 1. Design Goal

Sayved should feel like a calm, premium, native iPhone app for being spiritually walked with. It is not a generic chatbot, sermon app, church directory, or social feed. The central experience is one warm Director-led conversation, with Scripture, Memory, Council voices, followed teachers, Echo, and the Well entering that one room when appropriate.

The inspiration images remain the visual base: ivory backgrounds, devotional photography, translucent white surfaces, large serif type, warm taupe actions, simple line icons, gentle shadows, and iOS-native spacing.

## 2. Product Feeling

### Keywords

- Walked with
- Quiet
- Prayerful
- Premium
- Scripture-grounded
- Memory-aware
- Honest
- Native mobile
- African/global church aware
- Easy to return to

### Avoid

- Persona chat rooms.
- First-person pastor simulation.
- Dark, hyper-AI, sci-fi styling.
- Bright gradients.
- Heavy purple/blue palettes.
- Infinite scroll.
- Red notification dots.
- Streaks, badges, leaderboards, or shame mechanics.
- Public social feed patterns.
- Text-heavy onboarding tours.

## 3. Color Tokens

Derived from the inspiration images.

| Token | Hex | Usage |
| --- | --- | --- |
| `backgroundIvory` | `#F8F5F1` | App background |
| `backgroundWarm` | `#F0ECE8` | Soft panels, page bands |
| `surfaceWhite` | `#FEFDFC` | Cards, tab bar, inputs |
| `surfaceCream` | `#FAF8F6` | Secondary surfaces |
| `textPrimary` | `#201F1F` | Main text |
| `textSecondary` | `#89837B` | Body/helper text |
| `textMuted` | `#B4B2B0` | Inactive icons, placeholders |
| `borderSoft` | `#E6E4E0` | Dividers, card borders |
| `accentTaupe` | `#B79A73` | Primary actions, selected tab |
| `accentTaupeDark` | `#9A7A55` | Pressed/active text |
| `chipBeige` | `#EEE7DE` | Scripture chips, prompt chips |
| `successOlive` | `#7B8266` | Gentle confirmation |
| `warningClay` | `#A76F5B` | Serious but not alarming |
| `shadowWarm` | `#D4D0C9` | Soft shadow tint |

## 4. Typography

Use a serif display face for brand and emotional headers, and a clean sans-serif for body/UI.

Recommended Flutter setup:

- Display: `Cormorant Garamond`, `Fraunces`, or `Playfair Display`.
- Body: `Inter`, `SF Pro`, or `Manrope`.

Rules:

- Do not scale text with viewport width.
- Keep letter spacing at 0.
- Chat answer text: 17-18px equivalent with generous line height.
- Use serif for emotional moments, not dense settings screens.
- Long teacher names must wrap cleanly.

## 5. Primary Navigation

The finished app uses three tabs:

1. Talk - one continuous Director conversation.
2. Follow - teachers, church, sources, Council.
3. My Walk - Memory, Autobiography, Echo, settings.

The older Home / Chats / Devotions / Profile layout should be treated as an early visual sketch, not final IA. The Home energy moves into Talk and the Well.

## 6. Required Screen Inventory

### P0 Screens

1. Onboarding / Privacy Promise
2. Talk / Director Conversation
3. New Message / Source Switcher
4. Teacher Focus / Pastor Profile
5. Follow / Teacher Discovery
6. Scripture / References
7. The Well / Daily Feed That Ends
8. Today's Devotion / Reflection
9. Memory / My Walk
10. Memory Detail / Edit / Forget
11. Crisis Hand-Off
12. Profile / Settings / Legal

### P1 Screens

13. Council Builder
14. Council Session
15. Echo Sermon Capture
16. Echo Seven-Day Rhythm
17. Spiritual Autobiography Preview
18. Library / Official Source Player

### P2 Screens

19. Compare Teachings
20. Disputation
21. Teacher Request Confirmation
22. Recovery Contact Setup
23. Bible Reader / Search
24. Pastor Dashboard Preview

## 7. Core Components

### App Background

Use ivory base with optional low-opacity faith/nature imagery:

- Blurred olive branch/photo texture.
- Gentle mountain/church light background.
- Paper-like calm.
- Never reduce text contrast.

### Bottom Tab Bar

- Three tabs only: Talk, Follow, My Walk.
- Translucent white.
- Rounded top corners.
- No red dots.
- Active state in taupe.

### Director Message Card

- Sayved speaks as Sayved.
- White elevated card.
- Optional small Sayved mark, not a pastor avatar.
- Scripture chips, source cards, memory references, and audio row sit inside/under the card.

### Teacher Cards

Each card must show relationship state:

- `Verified` badge when licensed.
- `Not yet affiliated with Sayved` line for unverified teachers.
- `Estate - official sources only` for T.B. Joshua unless licensed.
- `Catalog building` for thin catalog.

Never use UI that implies the pastor is personally chatting.

### Voice Source Switcher

A compact segmented control beside or above the composer:

- Sayved
- My Council
- My Teachers

Changing the switcher changes who Sayved consults, not who "speaks." The Director remains the speaker.

### Scripture Chip

- Beige rounded chip.
- Opens Scripture / References screen.
- Must be tappable.

### Official Source Card

For unverified/estate teachers:

- Teacher name.
- Relationship label.
- Source title.
- Official route: Play / Watch / Open.
- One brief attributed quote only when safe.
- Optional `Request this teacher` action.

### Memory Thread Card

- Quiet, almost handwritten feeling.
- Shows a small remembered pattern only when useful.
- Must have `Edit` and `Forget` access nearby in My Walk.

### Crisis Hand-Off Overlay

- Immediate full-screen or dominant sheet.
- No pastor, Council, or source cards.
- Plain Director voice.
- One-tap call/text resources.
- Pastoral Recovery Contact if configured.

## 8. Screen Specifications

### 8.1 Onboarding / Privacy Promise

Purpose: Start meaningfully without a tour or account wall.

Required content:

- Sayved wordmark.
- One line: "Sayved. Walked with."
- One question: "What brings you here today?"
- Options:
  - I'm going through something
  - I want to grow
  - I'm curious
  - I honestly don't know
- Privacy promise screen: "Sayved cannot read your prayers. Even we do not have the keys." Phrase precisely if the launch architecture is not fully zero-knowledge yet.
- Consent for Privacy Policy, Terms, AI disclosure, Memory, and notifications where applicable.

Behavior:

- After the first answer, account creation can be offered softly.
- Notifications are rhythm, not engagement bait.

### 8.2 Talk / Director Conversation

Purpose: The heart of Sayved.

Required content:

- Calm header with Sayved mark and optional teacher faces for quick focus.
- Director greeting.
- One continuous thread.
- Composer with source switcher.
- Voice input.
- Audio playback.
- Scripture/source/reference chips.
- Memory moments only when relevant.

Behavior:

- Default is Director alone.
- If user says "no sermon" or rejects teacher input, do not offer teacher voices.
- All pastor/teacher content is framed as sourced teaching, never impersonation.

### 8.3 Teacher Focus / Pastor Profile

Purpose: Build trust and clarify what Sayved can legally do with this teacher.

Required content:

- Portrait.
- Name and ministry.
- Verification label.
- For verified: "Deep catalog available."
- For unverified: "Not yet affiliated with Sayved."
- For estate: "Official sources only until estate/license approval."
- Topics and public source links.
- CTA:
  - Verified: "Ask Sayved with this teacher's catalog"
  - Unverified/estate: "Open official sources"
  - Optional: "Request this teacher"

Important: This is not a biography and not a fake chat invite.

### 8.4 Follow / Teacher Discovery

Purpose: Let users follow teachers and build their bench.

Required content:

- Search.
- Four narrow MVP teacher slots.
- Follow buttons.
- Verification badges.
- Council seat affordance.
- Official source cards.

The initial active set:

- Prophet T.B. Joshua - estate/source-only unless licensed.
- Pastor Chris Oyakhilome - unverified/source-only unless licensed.
- Pastor E.A. Adeboye - unverified/source-only unless licensed.
- Archbishop Benson Idahosa - estate/source-only unless licensed.

### 8.5 Council Builder

Purpose: Let the user seat up to seven voices.

Required content:

- Seven seat layout.
- Add from followed teachers.
- Verification state per seat.
- Explanation by design, not heavy copy: Council voices can weigh in proactively; followed teachers only come when called.

MVP constraint:

- If a seat is unverified/estate, Council contribution is librarian mode only.

### 8.6 Council Session

Purpose: The "wow" moment, still inside one conversation.

Required content:

- Director framing.
- Each seated voice represented by sourced cards.
- Verification-aware depth.
- Final Director gathering question.

Rules:

- No one speaks in first person unless inside a real quote.
- No winner.
- No invented positions.

### 8.7 Scripture / References

Purpose: Make trust tangible.

Required content:

- Reference title.
- Full passage if licensed.
- "Why this verse?"
- Related source or answer context.
- Open Bible / copy / save.

### 8.8 The Well / Daily Feed That Ends

Purpose: A calm daily front porch.

Required content:

- Today's scripture.
- Short reflection.
- One teacher/source item if relevant.
- Memory thread only if timing is right.
- Clear end state.

Rules:

- No infinite scroll.
- Sunday silence where configured.
- No engagement-maximizing algorithm.

### 8.9 Today's Devotion / Reflection

Purpose: Minimal daily devotional reading.

Required content:

- "Good Morning."
- Title.
- Reading time.
- Today's scripture.
- Reflection.
- Prayer.
- Share.
- Save.
- Listen.

### 8.10 Memory / My Walk

Purpose: Give the user ownership and confidence.

Required content:

- Memory themes.
- Strengths/evidence.
- Commitments/follow-ups.
- Spiritual markers.
- Autobiography preview.
- Export.
- Delete.
- Recovery contact setup later.

Rules:

- Memory is not presented as surveillance.
- Every memory can be corrected or forgotten.
- Use language of ownership: "Your walk belongs to you."

### 8.11 Memory Detail / Edit / Forget

Purpose: User control.

Required content:

- Memory type.
- Content.
- Source moment link if safe.
- Emotional weight/salience hidden unless needed for debugging.
- Edit.
- Forget.

### 8.12 Echo Sermon Capture

Purpose: Carry Sunday through the week.

Required content:

- Face-down capture state.
- On-device transcription reassurance.
- End capture.
- Summary generated locally where possible.

Rules:

- Audio should not upload for MVP unless explicit consent and legal church context exist.
- Sunday itself should remain quiet.

### 8.13 Echo Seven-Day Rhythm

Purpose: Monday-Saturday embodiment of the user's own church sermon.

Required content:

- Monday anchor verse.
- Tuesday memory thread.
- Wednesday practice.
- Thursday deeper reflection.
- Friday examen.
- Saturday preparation.

### 8.14 Library / Official Source Player

Purpose: Let unverified/estate teachers provide value safely.

Required content:

- Official YouTube embed or public RSS/podcast route.
- Book/library links.
- Attribution.
- "Not yet affiliated with Sayved."
- Request teacher action.

### 8.15 Compare Teachings

Purpose: Side-by-side sourced comparison.

Rules:

- Verified + verified: deeper catalog comparison.
- Any unverified/estate party: brief public quotes + official links only.
- Name the difference honestly.

### 8.16 Disputation

Purpose: Director-narrated debate for contested questions.

Rules:

- Public-domain and verified living teachers only.
- No unverified living teachers.
- No estate-owned deceased figures.
- No first person except real quotes.
- No winner; close with a question.
- Core creedal truths are never staged as two-sided.

### 8.17 Crisis Hand-Off

Purpose: Safety before product.

Required content:

- Plain message.
- Call/text emergency support.
- Regional crisis resources.
- Pastoral Recovery Contact if configured.

Rules:

- No source cards.
- No spiritual debate.
- No probing method details.
- No crisis content saved to Memory.

### 8.18 Profile / Settings / Legal

Required content:

- Account.
- Preferred teacher.
- Notification rhythm.
- Privacy controls.
- Export data.
- Delete data.
- AI disclosure.
- Terms and Privacy Policy.
- Takedown / teacher objection policy.
- About Sayved.

## 9. Motion And Interaction

- Source switcher: 180ms pill slide + haptic.
- Send message: composer compresses slightly, message animates upward.
- Director answer: fade/slide in with skeleton.
- Memory surfacing: soft reveal, never flashy.
- Follow/seat teacher: slight scale + haptic.
- Crisis overlay: immediate, no playful animation.
- TTS playback: progress bar inside listen row.

## 10. Accessibility

- Minimum tap target: 44x44.
- Body contrast: WCAG AA.
- Voice controls require visible recording state.
- Support Dynamic Type, especially in Talk and Scripture.
- Do not rely on color alone for verification state.
- Crisis resources must be readable and reachable under stress.

## 11. Visual QA Checklist

- Looks polished on iPhone SE.
- Looks polished on iPhone 15 Pro / Pro Max.
- Bottom composer never overlaps tab bar or home indicator.
- Source switcher does not crowd the composer.
- Long pastor names do not overflow.
- Verification labels are visible but quiet.
- Scripture chips remain tappable.
- The Well visibly ends.
- Memory controls are easy to find.
- Crisis screen is unmistakable and calm.
