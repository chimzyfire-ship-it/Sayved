# Sayved Sharp MVP - API Specification

## 1. API Style

Use Supabase Edge Functions as the public backend API. The Flutter client calls Edge Functions over HTTPS and reads safe public tables directly when appropriate.

All AI, embedding, speech, and citation validation work happens server-side.

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

## 2. Error Shape

```json
{
  "error": {
    "code": "LOW_RETRIEVAL_CONFIDENCE",
    "message": "I could not find enough trusted source material to answer that directly.",
    "request_id": "req_123"
  }
}
```

## 3. Public Read Data

The Flutter app may read these Supabase tables directly:

- `pastors`
- `topics`
- `pastor_topics`
- `scripture_passages` only when opened by known id/reference
- `daily_devotions`

Do not expose `content_chunks` directly to the client.

## 4. Endpoints

### `GET /pastors`

Implementation option: direct Supabase query.

Returns active pastors.

```json
{
  "pastors": [
    {
      "id": "uuid",
      "slug": "pastor-poju",
      "display_name": "Pastor Poju",
      "subtitle": "Faith & Grace",
      "portrait_url": "https://...",
      "topics": ["Faith", "Purpose", "Prayer"]
    }
  ]
}
```

### `POST /create-conversation`

Creates a conversation before first answer generation.

Request:

```json
{
  "pastor_id": "uuid",
  "initial_prompt": "I am anxious about my future. What does God say?",
  "source": "text"
}
```

Response:

```json
{
  "conversation_id": "uuid",
  "message_id": "uuid",
  "title": "Anxiety About The Future"
}
```

### `POST /send-message`

Generates a grounded assistant answer.

Request:

```json
{
  "conversation_id": "uuid",
  "pastor_id": "uuid",
  "content": "I am anxious about my future. What does God say?",
  "source": "text"
}
```

Response:

```json
{
  "conversation_id": "uuid",
  "user_message": {
    "id": "uuid",
    "content": "I am anxious about my future. What does God say?",
    "created_at": "2026-07-03T16:30:00Z"
  },
  "assistant_message": {
    "id": "uuid",
    "content": "God is not the author of fear...",
    "created_at": "2026-07-03T16:30:02Z",
    "latency_ms": 2100
  },
  "references": [
    {
      "type": "scripture",
      "id": "uuid",
      "label": "Philippians 4:6-7",
      "reason": "Referenced because the answer discusses prayer and peace."
    },
    {
      "type": "sermon",
      "id": "uuid",
      "label": "Walking Through Anxiety",
      "timestamp": "45:12"
    }
  ],
  "retrieval": {
    "confidence": 0.82,
    "chunks_used": 5
  }
}
```

Behavior:

- Restrict retrieval to selected pastor.
- Store both user and assistant messages.
- Store references in `message_references`.
- Return low-confidence fallback instead of hallucinated content.

### `POST /transcribe-audio`

Transcribes user voice prompt.

Request:

```json
{
  "audio_base64": "<base64>",
  "mime_type": "audio/m4a",
  "language_code": "en-US"
}
```

Response:

```json
{
  "text": "How can I overcome fear?",
  "confidence": 0.91
}
```

### `POST /synthesize-answer-audio`

Creates TTS playback for assistant response.

Request:

```json
{
  "message_id": "uuid",
  "voice": "calm-female"
}
```

Response:

```json
{
  "audio_url": "https://...",
  "duration_seconds": 92
}
```

Behavior:

- Cache audio URL on `messages.audio_url`.
- Reuse existing audio if already generated.

### `GET /resolve-scripture-reference?id=<uuid>`

Returns the Scripture / References screen data.

Response:

```json
{
  "reference": "Philippians 4:6-7",
  "passage": "Do not be anxious about anything...",
  "why_this_verse": "This passage was referenced because the answer focused on anxiety, prayer, and peace.",
  "related_sermon": {
    "id": "uuid",
    "title": "Walking Through Anxiety",
    "timestamp": "45:12",
    "source_url": "https://..."
  }
}
```

### `GET /today-devotion`

Can be direct Supabase query or Edge Function.

Response:

```json
{
  "date": "2026-07-03",
  "title": "Peace For Today",
  "reading_time_minutes": 3,
  "scripture": {
    "id": "uuid",
    "reference": "Philippians 4:6-7"
  },
  "reflection": "...",
  "prayer": "..."
}
```

### `POST /save-item`

Request:

```json
{
  "item_type": "conversation",
  "item_id": "uuid"
}
```

Response:

```json
{
  "saved": true
}
```

### `POST /feedback`

Request:

```json
{
  "message_id": "uuid",
  "rating": "helpful",
  "comment": "This felt grounded and clear."
}
```

Response:

```json
{
  "ok": true
}
```

## 5. Retrieval Contract

The app receives only the final answer and approved citation metadata. Retrieval internals remain server-side.

Minimum retrieval rules:

- `pastor_id` is mandatory.
- Use top 8-12 candidate chunks.
- Filter `is_approved = true`.
- Prefer chunks with higher `quality_score`.
- Include scripture citations if explicitly present in source chunks or generated answer.
- Block answer if all retrieval scores are weak.

## 6. Latency Strategy

For MVP, non-streaming responses are acceptable if typical latency stays near 3 seconds.

If latency becomes too high:

- Return immediate message placeholder.
- Use streaming Edge Function response.
- Render answer progressively in Flutter.

## 7. Rate Limits

Recommended beta limits:

- Anonymous user: 20 messages per day.
- Authenticated beta user: 50 messages per day.
- TTS: 15 generated audio files per day.
- Audio transcription: 10 minutes per day.

Return:

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "You have reached today's beta limit."
  }
}
```
