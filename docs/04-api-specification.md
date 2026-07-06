# Sayved Sharp MVP - API Specification

## 1. API Style

Use Supabase Edge Functions as the public backend API. Flutter may read safe public catalog tables directly, but every AI, speech, crisis, Memory, source-routing, and verification-sensitive action must go through an Edge Function.

Base function URL:

```text
https://<project-ref>.supabase.co/functions/v1
```

Headers:

```http
Authorization: Bearer <supabase-jwt-or-anon-key>
Content-Type: application/json
x-sayved-install-id: <anonymous-install-id>
```

## 2. Core API Rules

- The Director is the only generated speaker.
- No API may return content that speaks as a pastor, historic figure, or estate voice.
- Deep RAG is allowed only when `teachers.deep_rag_allowed=true`.
- Unverified and estate teachers return official routes, public facts, brief attributed quotes, and request actions only.
- Disputation is allowed only for public-domain or verified teachers.
- Crisis checks run before ordinary generation.
- Raw crisis content must not be stored.
- Memory plaintext must not be stored in normal server tables.

## 3. Error Shape

```json
{
  "error": {
    "code": "TEACHER_NOT_VERIFIED_FOR_DEEP_RAG",
    "message": "This teacher is not yet affiliated with Sayved, so I can route you to official sources but I will not guess at their teaching.",
    "request_id": "req_123"
  }
}
```

## 4. Public Read Data

The Flutter app may read these tables directly:

- `teachers`
- `topics`
- `teacher_topics`
- `teacher_sources` where public/approved
- `scripture_passages` when opened by id/reference
- `well_items`
- `daily_devotions`

Never expose `content_chunks` directly to the client.

## 5. Catalog Endpoints

### `GET /teachers`

Returns active teacher slots and verification state.

```json
{
  "teachers": [
    {
      "id": "uuid",
      "slug": "pastor-chris-oyakhilome",
      "display_name": "Pastor Chris Oyakhilome",
      "subtitle": "Christ Embassy",
      "verification_status": "unverified",
      "affiliation_label": "Not yet affiliated with Sayved",
      "deep_rag_allowed": false,
      "portrait_url": "https://...",
      "topics": ["Faith", "Confession", "Prayer"]
    }
  ]
}
```

### `GET /teachers/:id/sources`

Returns official source routes and licensed source metadata.

```json
{
  "teacher": {
    "id": "uuid",
    "display_name": "Prophet T.B. Joshua",
    "verification_status": "estate"
  },
  "sources": [
    {
      "id": "uuid",
      "title": "Official SCOAN Message",
      "source_type": "youtube",
      "source_url": "https://...",
      "rights_status": "official_public_route",
      "playback_mode": "official_embed"
    }
  ]
}
```

### `POST /request-teacher`

Creates the demand signal for licensing.

```json
{
  "teacher_id": "uuid",
  "context": "User wanted deeper answers on anxiety and faith."
}
```

Response:

```json
{
  "ok": true,
  "message": "We logged your request."
}
```

## 6. Conversation Endpoints

### `POST /start-conversation`

Creates a Director thread.

Request:

```json
{
  "initial_prompt": "I feel like I am falling behind.",
  "mode": "director",
  "source": "text",
  "active_teacher_id": null
}
```

Response:

```json
{
  "conversation_id": "uuid",
  "title": "Fear Of Falling Behind"
}
```

### `POST /send-message`

Generates the Director's answer.

Request:

```json
{
  "conversation_id": "uuid",
  "content": "What would Pastor Chris say about speaking faith over fear?",
  "source": "text",
  "mode": "teacher_focus",
  "active_teacher_id": "uuid",
  "source_scope": "my_teachers",
  "client_memory_context": [
    {
      "id": "local-memory-id",
      "type": "theme",
      "content": "recurring fear of being behind",
      "salience": 0.84
    }
  ]
}
```

Response:

```json
{
  "conversation_id": "uuid",
  "user_message": {
    "id": "uuid",
    "content": "What would Pastor Chris say about speaking faith over fear?",
    "created_at": "2026-07-05T20:30:00Z"
  },
  "director_message": {
    "id": "uuid",
    "content": "Pastor Chris is not yet affiliated with Sayved, so I will not pretend to speak from a licensed catalog. One public theme of his ministry is the importance of words and confession. Here is an official message to press play on...",
    "rendered_mode": "teacher_route",
    "created_at": "2026-07-05T20:30:02Z",
    "latency_ms": 2100
  },
  "references": [
    {
      "type": "official_route",
      "teacher_id": "uuid",
      "source_id": "uuid",
      "label": "Official Christ Embassy message",
      "verification_status": "unverified",
      "action": "play"
    },
    {
      "type": "scripture",
      "id": "uuid",
      "label": "Psalm 119:105",
      "reason": "Used as comfort, not correction."
    }
  ],
  "teacher_gate": {
    "verification_status": "unverified",
    "deep_rag_used": false,
    "request_teacher_available": true
  },
  "memory": {
    "used": true,
    "ids": ["local-memory-id"]
  }
}
```

Server behavior:

- Run `crisis-check` first.
- Validate conversation ownership.
- Validate teacher verification state.
- Retrieve licensed chunks only when allowed.
- Route unverified/estate teachers to official sources.
- Validate every citation.
- Store messages and non-sensitive references.
- Return Memory ids only if supplied by client; do not store plaintext memory.

### `POST /route-teacher-source`

Returns safe official content recommendations for unverified/estate teachers.

```json
{
  "teacher_id": "uuid",
  "topic": "anxiety",
  "user_prompt": "I feel afraid of the future."
}
```

Response:

```json
{
  "teacher": {
    "display_name": "Prophet T.B. Joshua",
    "verification_status": "estate",
    "affiliation_label": "Official sources only"
  },
  "routes": [
    {
      "source_id": "uuid",
      "title": "Official SCOAN message",
      "source_url": "https://...",
      "playback_mode": "official_embed",
      "reason": "This official recording is related to peace in difficulty."
    }
  ],
  "brief_attributed_quote": {
    "text": "The battle of life is a battle of faith.",
    "source_label": "Publicly attributed teaching",
    "source_url": "https://..."
  },
  "request_teacher_available": true
}
```

## 7. Council And Compare

### `GET /council`

Returns the user's current seats.

### `POST /council/seats`

Adds or replaces a Council seat.

```json
{
  "teacher_id": "uuid",
  "seat_index": 3
}
```

### `POST /council/session`

Generates a Director-gathered Council response.

Rules:

- Verified/public-domain voices may contribute deep sourced content.
- Unverified/estate seats contribute librarian-mode source routes.
- The Director gathers; no voice speaks as itself.

### `POST /compare-teachings`

```json
{
  "teacher_ids": ["uuid", "uuid"],
  "question": "How do they approach fear?"
}
```

Rules:

- Verified + verified: deeper sourced comparison.
- Any unverified/estate teacher: brief public quotes and official links only.

### `POST /generate-disputation`

Rules:

- Reject any unverified or estate teacher.
- No winner.
- No first person except real quotes.
- Theological Council allowlist required for topics.

## 8. Scripture And Well

### `GET /resolve-scripture-reference?id=<uuid>`

```json
{
  "reference": "Philippians 4:6-7",
  "passage": "Do not be anxious about anything...",
  "why_this_verse": "This passage was referenced because the answer focused on prayer and peace.",
  "related_source": {
    "id": "uuid",
    "title": "Official source title",
    "source_url": "https://..."
  }
}
```

### `GET /today-well`

Returns a finite daily feed.

```json
{
  "date": "2026-07-05",
  "is_sunday_silent": false,
  "items": [
    {
      "type": "scripture",
      "title": "Today's Scripture",
      "reference": "Psalm 119:105"
    },
    {
      "type": "reflection",
      "title": "A quiet word for today",
      "body": "..."
    }
  ],
  "end_message": "That is enough for today."
}
```

### `GET /today-devotion`

Returns the minimal devotion view.

## 9. Memory And My Walk

### `POST /extract-memory`

Preferred launch implementation: client-side extraction with local encrypted storage. Use this endpoint only if server extraction is explicitly enabled and privacy mode allows it.

Request:

```json
{
  "conversation_id": "uuid",
  "messages": [
    {
      "role": "user",
      "content": "I keep feeling behind."
    }
  ],
  "privacy_mode": "local_only"
}
```

Response:

```json
{
  "memories": [
    {
      "type": "theme",
      "content": "recurring fear of being behind",
      "emotional_weight": 0.82,
      "salience": 0.76
    }
  ],
  "storage_instruction": "store_locally_encrypted"
}
```

### `POST /save-memory-correction`

Records an encrypted correction envelope or local-only acknowledgement.

### `POST /forget-memory`

Deletes synced encrypted envelope if present and returns instruction to delete local plaintext.

### `POST /generate-autobiography`

Uses client-provided selected Memory excerpts or future confidential compute. Must not read server plaintext memory.

## 10. Echo

### `POST /process-echo-sermon`

Launch preference: on-device transcription and summary.

Request:

```json
{
  "mode": "local_summary_upload",
  "church_name": "Optional Church",
  "captured_on": "2026-07-05",
  "encrypted_summary": "<ciphertext>"
}
```

Response:

```json
{
  "echo_sermon_id": "uuid",
  "rhythm_created": true
}
```

## 11. Speech

### `POST /transcribe-audio`

Transcribes user voice prompt when on-device transcription is unavailable.

### `POST /synthesize-director-audio`

Creates TTS playback only in the Director's voice.

Request:

```json
{
  "message_id": "uuid",
  "voice": "director-calm"
}
```

Response:

```json
{
  "audio_url": "https://...",
  "duration_seconds": 92
}
```

## 12. Safety And Compliance

### `POST /crisis-check`

```json
{
  "content": "I do not want to be here anymore.",
  "region": "US"
}
```

Response:

```json
{
  "crisis_detected": true,
  "level": "imminent",
  "handoff": {
    "message": "I am really glad you said this. Please contact immediate help now.",
    "resources": [
      {
        "label": "988 Suicide & Crisis Lifeline",
        "action": "call",
        "value": "988"
      }
    ]
  },
  "log_policy": "event_only_no_content"
}
```

### `POST /record-consent`

```json
{
  "consent_type": "privacy",
  "version": "2026-07-05",
  "accepted": true
}
```

### `POST /feedback`

Stores non-sensitive feedback on message quality.

## 13. Retrieval Contract

- `teacher_id` is optional for Director-only answers.
- If `teacher_id` is present, server must inspect verification state.
- `deep_rag_allowed=false` means no transcript retrieval and no generated teaching synthesis from that teacher.
- Use approved chunks only.
- Include source references for every teacher claim.
- Admit honest gaps.
- Strip unsupported claims before returning.

## 14. Rate Limits

Recommended beta limits:

- Anonymous user: 20 Director messages per day.
- Authenticated beta user: 50 Director messages per day.
- TTS: 15 generated audio files per day.
- Audio transcription: 10 minutes per day.
- Teacher requests: 20 per day.
- Council sessions: 5 per day.

Return:

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "You have reached today's beta limit."
  }
}
```
