# Sayved Sharp MVP - UI/UX Design Specification

## 1. Design Goal

Sayved should feel like a calm, premium, native iPhone app for faith guidance. The visual language is soft, editorial, spiritual, and trustworthy. It should not feel like a generic chatbot, SaaS dashboard, church website, or marketing landing page.

The inspiration images define the style: ivory backgrounds, subtle devotional photography, translucent white surfaces, large serif type, warm taupe actions, simple line icons, gentle shadows, and iOS-native spacing.

## 2. Visual Direction

### Keywords

- Quiet
- Prayerful
- Premium
- Warm
- Scripture-grounded
- Native mobile
- Minimal
- Trustworthy

### Avoid

- Bright gradients.
- Heavy saturated purple/blue palettes.
- Dense cards everywhere.
- Web landing page sections.
- Cartoon illustration.
- Dark mode for MVP unless specifically added later.
- Text explaining how the app works inside the UI.

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
| `shadowWarm` | `#D4D0C9` | Soft shadow tint |

Opacity rules:

- Card backgrounds: 88-96% white.
- Decorative image overlays: 35-65% ivory.
- Disabled controls: 40% opacity.
- Shadows: very soft, never harsh black.

## 4. Typography

Use a serif display face for brand and emotional headers, and a clean sans-serif for body/UI.

Recommended Flutter setup:

- Display: `Cormorant Garamond`, `Fraunces`, or `Playfair Display`.
- Body: `Inter`, `SF Pro`, or `Manrope`.

Type scale:

| Role | Size | Weight | Notes |
| --- | --- | --- | --- |
| Hero title | 56-68 | Regular | Serif, large line-height |
| Screen title | 26-34 | Regular | Serif |
| Section title | 18-22 | SemiBold | Sans or serif depending screen |
| Body | 16-18 | Regular | Sans, high readability |
| Caption | 13-14 | Regular | Muted |
| Button | 16-17 | Medium | Sans |
| Tab label | 12-13 | Medium | Sans |

Rules:

- Do not scale text with viewport width.
- Keep letter spacing at 0.
- Chat answer text should be 17-18px equivalent with generous line height.
- Long scripture chips may wrap or truncate gracefully.

## 5. Layout System

### Safe Areas

- Respect top safe area and dynamic island.
- Minimum horizontal margin: 24px.
- Card radius: 8-24px depending component. Major app surfaces can be pill-like where seen in mockups.
- Bottom input areas must clear home indicator and tab bar.

### Spacing

Use a 4px base scale:

- Tiny: 4
- Small: 8
- Medium: 16
- Large: 24
- XL: 32
- XXL: 48

### Surfaces

- Floating circular icon buttons: 56x56.
- Search/input pill: 72-88px high on Home, 56-64px in Chat.
- Pastor card: fixed width in horizontal scroll, no layout jump on selection.
- Bottom tab bar: rounded top corners, translucent, elevated.

## 6. Core Components

### App Background

Use ivory base with optional low-opacity faith/nature imagery:

- Blurred olive branch/photo texture.
- Gentle mountain/church light background.
- Never reduce text contrast.

### Icon Buttons

- Circular white/translucent surface.
- 44-56px tap target.
- Taupe or muted gray icon.
- Use lucide-style line icons if matching in Flutter icon set.

### Pastor Card

States:

- Default: white/cream card, soft shadow, portrait, name, subtitle, select button.
- Selected: taupe border, checkmark badge, selected pill.
- Pressed: slight scale down, haptic.

### Scripture Chip

- Beige rounded chip.
- Opens Scripture / References screen.
- Must be tappable, not just decorative.

### Chat Bubble

User:

- Right aligned.
- Warm cream/taupe-tinted bubble.
- Rounded with small tail or asymmetrical corner.

Assistant:

- Left aligned.
- White elevated card.
- Pastor avatar outside or attached.
- Includes answer, divider, scripture references, actions.

### Bottom Composer

Fixed to bottom above tab bar or home indicator.

Contains:

- Add button.
- Text input.
- Microphone.
- Send button.

Send button:

- Circular taupe gradient or solid taupe.
- Paper-plane icon.

## 7. Screen Specifications

### 7.1 Home / Landing

Purpose: Immediate trust and entry into asking a question.

Required content:

- Brand row: cross mark + Sayved.
- Profile icon button.
- Hero: "Faith. Answered."
- Subcopy: "Ask, reflect, grow. Get faith-filled answers grounded in Scripture and the wisdom of trusted pastors."
- Search entry: "Ask anything about faith..."
- Three pastor cards.
- Devotion preview card.
- Bottom tab bar.

Behavior:

- Tapping search opens New Conversation.
- Tapping pastor opens Pastor Profile.
- Tapping devotion opens Today's Devotion.

Native feel:

- Hero occupies first viewport but allows pastor row to peek in.
- Background image remains subtle.

### 7.2 New Conversation

Purpose: Select pastor and submit a first prompt.

Required content:

- Back button.
- Title: "New Conversation"
- Optional settings icon.
- Center prompt: "How can we pray for you today?"
- Pastor selector.
- Prompt text area.
- Voice button.
- Suggested prompt chips.
- Send CTA: "Ask Pastor Poju"

Suggested prompts:

- Strength for today
- Overcoming fear
- Purpose in life
- Help me pray
- Wisdom for work

Behavior:

- Pastor selection updates CTA label.
- Voice button records/transcribes into prompt.
- Send creates conversation and navigates to AI Conversation.

### 7.3 AI Conversation

Purpose: Deliver grounded answer and support continued chat.

Required content:

- Header with selected pastor image, name, subtitle, dropdown.
- Back button.
- More menu.
- Assistant intro.
- User message bubble.
- Assistant answer card.
- Scripture references.
- Source/sermon reference where available.
- Copy, save, share actions.
- "Listen to this answer" TTS row.
- Bottom composer.

Behavior:

- Scripture chip opens Scripture / References.
- Listen row starts TTS playback.
- User can continue chatting in same conversation.

Trust requirements:

- Never show an answer without visible grounding when references exist.
- If retrieval confidence is low, use a humble fallback: "I could not find enough from Pastor Poju's teachings to answer that directly..."

### 7.4 Pastor Profile

Purpose: Build trust before chatting. This is not a biography.

Style: More like an Apple product page than a resume.

Required content:

- Pastor portrait.
- Pastor name and subtitle.
- Large trust statement, for example: "Faith & Grace"
- "Answers grounded in:" section:
  - Sermons
  - Bible teachings
  - Conference messages
- Topics:
  - Faith
  - Purpose
  - Prayer
  - Marriage
  - Business
  - Leadership
- Primary CTA: "Start Conversation"

Behavior:

- CTA opens New Conversation with pastor preselected.
- Topic chips can prefill suggested prompt intent in later versions.

### 7.5 Scripture / References

Purpose: Make the AI feel trustworthy by explaining citations beautifully.

Required content:

- Reference title, e.g. "Philippians 4:6-7"
- Full passage.
- Divider.
- "Why this verse?"
- Explanation tied to the AI answer.
- Related sermon:
  - Title, e.g. "Walking Through Anxiety"
  - Timestamp, e.g. "45:12"
  - CTA: "Open sermon"

Behavior:

- Opens from scripture chips.
- Back returns to exact chat scroll position.

### 7.6 Today's Devotion

Purpose: Minimal daily spiritual reflection.

Required content:

- "Good Morning."
- "Today's Devotion"
- Title.
- Reading time.
- Today's scripture.
- Reflection.
- Prayer.
- Share.
- Save.

Rules:

- No distractions.
- No large content carousel.
- No aggressive CTA.

### 7.7 Profile

Purpose: Tiny settings and history hub.

Required content:

- Profile.
- Preferred pastor.
- Saved conversations.
- Prayer history.
- Notifications.
- About Sayved.

Rules:

- Keep simple.
- Avoid account-management complexity unless auth is enabled.

## 8. Motion And Interaction

- Pastor card select: 180ms scale + border fade + haptic.
- Send message: composer compresses slightly, message animates upward.
- AI answer: fade/slide in with skeleton while loading.
- Scripture page: iOS push transition.
- TTS playback: progress bar inside listen row.

## 9. Accessibility

- Minimum tap target: 44x44.
- Body contrast: WCAG AA.
- Do not rely on color alone for selected pastor.
- Voice controls require visible recording state.
- Support Dynamic Type within reason, especially chat body.

## 10. Visual QA Checklist

- Looks polished on iPhone SE.
- Looks polished on iPhone 15 Pro / Pro Max.
- Bottom composer never overlaps tab bar or home indicator.
- Long pastor names do not overflow.
- Scripture chips remain tappable.
- Chat answer text is readable in bright outdoor conditions.
- Background imagery never competes with content.
