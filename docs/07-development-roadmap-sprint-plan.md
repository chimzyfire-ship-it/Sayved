# Sayved Sharp MVP - Development Roadmap & Sprint Plan

## 1. MVP Strategy

Build the app in thin vertical slices. The first win is a beautiful mobile shell with mock data. The second win is one real pastor flow end-to-end. The final MVP is all seven screens, three pastors, grounded RAG, scripture references, voice, TTS, and saves.

Target stack:

- Flutter mobile app.
- Supabase backend.
- pgvector retrieval.
- Gemini 2.5 Flash.
- Google Embeddings.
- Google STT/TTS.

Development machine constraint:

- Primary development is on a 2015 MacBook Pro with macOS Monterey, so keep tooling lightweight and incremental.

## 2. Milestones

### Milestone 1 - Mobile App Foundation

Outcome: Sayved looks and feels like the inspiration mockups with local mock data.

Deliverables:

- Flutter project structure.
- Theme tokens.
- Navigation.
- Bottom tab shell.
- Home screen.
- New Conversation screen.
- AI Conversation mock screen.

Acceptance:

- iPhone layout feels native.
- No text overflow.
- Bottom tab and composer respect safe area.

### Milestone 2 - Core Content Screens

Outcome: All seven screens exist and are navigable.

Deliverables:

- Pastor Profile.
- Scripture / References.
- Today's Devotion.
- Profile.
- Shared components for pastor cards, scripture chips, chat cards, icon buttons.

Acceptance:

- Every screen can be opened from the expected flow.
- Pastor Profile builds trust without becoming a biography.
- Scripture page explains why the verse was used.

### Milestone 3 - Supabase Data Layer

Outcome: App reads real seeded data.

Deliverables:

- Supabase project setup.
- Database migrations.
- Seed data for pastors/topics/devotions/scriptures.
- RLS policies.
- Flutter Supabase client.

Acceptance:

- Home reads pastors from Supabase.
- Today's Devotion reads from Supabase.
- RLS blocks private conversation reads across users.

### Milestone 4 - RAG Conversation MVP

Outcome: User asks Pastor Poju a real question and receives a grounded answer.

Deliverables:

- Sermon/source ingestion.
- Chunking and embeddings.
- `send-message` Edge Function.
- Gemini structured answer generation.
- Message/reference storage.
- Chat UI connected to backend.

Acceptance:

- Retrieval limited to selected pastor.
- AI answer includes scripture chips.
- Low-confidence fallback works.

### Milestone 5 - Voice, TTS, Saves

Outcome: MVP feature set is complete.

Deliverables:

- Voice prompt transcription.
- Listen-to-answer TTS.
- Save conversation.
- Prayer history.
- Profile settings.

Acceptance:

- User can dictate prompt, receive answer, listen to answer, save chat.
- Profile shows saved conversations and prayer history.

### Milestone 6 - Beta Polish

Outcome: App is ready for 100 beta users.

Deliverables:

- Performance pass.
- Visual QA on iPhone sizes.
- Prompt safety pass.
- Content scoring review.
- Basic event logging.
- Beta bug fixes.

Acceptance:

- Typical answer near 3 seconds where possible.
- No obvious visual defects.
- Source grounding feels trustworthy.

## 3. Sprint Plan

### Sprint 0 - Setup and Design System

Duration: 2-3 days.

Tasks:

- Create Flutter project.
- Add routing and state management.
- Add theme tokens from UI spec.
- Add image and icon assets.
- Build shared buttons, chips, cards, tab bar.

Definition of done:

- App launches locally.
- Empty tab shell works.
- Theme visually matches inspiration images.

### Sprint 1 - Three Primary Screens

Duration: 4-5 days.

Tasks:

- Build Home / Landing.
- Build New Conversation.
- Build AI Conversation with mock messages.
- Add pastor selection state.
- Add suggested prompt chips.
- Add chat composer.

Definition of done:

- User can move Home -> New Conversation -> Chat with mock answer.
- UI is polished on iPhone viewport.

### Sprint 2 - Trust Screens

Duration: 3-4 days.

Tasks:

- Build Pastor Profile.
- Build Scripture / References.
- Build Today's Devotion.
- Build Profile.
- Wire navigation from chips/cards/tabs.

Definition of done:

- All seven screens implemented.
- Scripture chip opens reference detail.
- Devotion screen is minimal and readable.

### Sprint 3 - Database and Supabase

Duration: 4-5 days.

Tasks:

- Create migrations from database design.
- Enable pgvector.
- Add RLS.
- Seed pastors, topics, sample scriptures, sample devotion.
- Connect Flutter to Supabase.

Definition of done:

- App reads live pastors/devotion.
- Private tables have RLS tests.

### Sprint 4 - AI Backend

Duration: 5-7 days.

Tasks:

- Build ingestion script/process.
- Add content chunking.
- Generate embeddings.
- Implement creator scoring.
- Implement `send-message`.
- Store messages and references.

Definition of done:

- One pastor can answer from real approved chunks.
- Response has scripture and sermon references.
- Low-confidence fallback tested.

### Sprint 5 - Voice and Playback

Duration: 3-5 days.

Tasks:

- Implement `transcribe-audio`.
- Add record UI state.
- Implement `synthesize-answer-audio`.
- Add listen row playback state.
- Cache generated audio URL.

Definition of done:

- User can speak a prompt.
- User can listen to an answer.

### Sprint 6 - Saves, History, Beta Polish

Duration: 4-6 days.

Tasks:

- Save conversations.
- Prayer history.
- Profile settings.
- Event logging.
- Performance pass.
- iPhone QA.
- Copy/content review.

Definition of done:

- MVP feature set complete.
- Ready for limited beta.

## 4. Priority Backlog

P0:

- Seven screens.
- Pastor selection.
- RAG answer generation.
- Scripture references.
- Conversation persistence.
- Mobile visual polish.

P1:

- Voice input.
- TTS playback.
- Saved conversations.
- Prayer history.
- Daily devotion.

P2:

- Feedback buttons.
- Better content ingestion tools.
- More robust analytics.
- Sermon open/deep link.

Not for MVP:

- Subscriptions.
- Events.
- Social/community.
- Compare pastors.
- Multiple AI model picker.

## 5. QA Plan

Functional QA:

- Start a new conversation with each pastor.
- Ask a faith, prayer, anxiety, marriage, business, and leadership question.
- Open every scripture chip.
- Save and reopen a conversation.
- Record voice prompt.
- Play TTS.

Visual QA:

- iPhone SE.
- iPhone 13/14/15 regular.
- iPhone Pro Max.
- Light mode.
- Large text setting sanity check.

AI QA:

- No fabricated citations.
- No unsupported pastor claims.
- Low-confidence fallback works.
- Sensitive topics handled gently.

Performance QA:

- App launch.
- Home load.
- Chat send.
- First answer latency.
- TTS generation.

## 6. Beta Success Metrics

From PRD:

- 100+ active beta users.
- More than 30% returning weekly.
- Average session over 5 minutes.
- Positive feedback on answer relevance and trust.

Additional practical metrics:

- At least 60% of answers receive a scripture chip tap or save/listen action.
- Less than 5% answer failure rate.
- Less than 10% low-confidence fallback rate after content library improves.

## 7. Recommended Build Order

1. Build visual app with mock data.
2. Add Supabase reads for public data.
3. Add conversations and messages.
4. Add one real pastor RAG path.
5. Add scripture detail trust layer.
6. Add remaining pastors.
7. Add voice/TTS.
8. Polish for beta.
