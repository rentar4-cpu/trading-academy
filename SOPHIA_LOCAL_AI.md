# Mentavio Sophia Local AI

Sophia is the educational AI mentor inside Mentavio. In the public alpha she can run through a free local Ollama model on the same computer as the Mentavio backend.

Sophia is never packaged inside the Android APK. Browser and Android clients talk only to the Mentavio backend. The backend talks to Ollama through localhost.

## Recommended Public Alpha Setup

```powershell
ollama pull qwen3:4b
ollama serve
```

Optional stronger model:

```powershell
ollama pull qwen3:8b
```

## Environment Variables

```text
SOPHIA_AI_ENABLED=true
SOPHIA_AI_PROVIDER=ollama
SOPHIA_AI_MODEL=qwen3:4b
OLLAMA_BASE_URL=http://127.0.0.1:11434
SOPHIA_REQUEST_TIMEOUT_MS=60000
SOPHIA_MAX_OUTPUT_TOKENS=600
SOPHIA_RECENT_MESSAGE_LIMIT=10
SOPHIA_RATE_LIMIT_PER_HOUR=20
SOPHIA_MAX_CONCURRENT_REQUESTS=2
SOPHIA_MAX_INPUT_CHARACTERS=4000
SOPHIA_PROMPT_VERSION=1.0
```

To switch to the stronger local model later:

```text
SOPHIA_AI_MODEL=qwen3:8b
```

No APK rebuild is required for changing the local model. Restart the backend after changing server environment variables.

## Health Check

Open:

```text
/ai/sophia/status
```

The response shows whether Sophia is enabled, which provider/model is selected, and whether the provider is available. It does not expose the local Ollama URL.

## Chat Endpoint

```text
POST /ai/sophia/chat
```

Example body:

```json
{
  "player_id": 1,
  "message": "Why did NOVA move today?",
  "context": {
    "page": "market",
    "selected_symbol": "NOVA"
  }
}
```

If Ollama is unavailable, Mentavio returns a safe fallback message and the game continues normally.

## Safety Rules

Sophia explains the simulation. Sophia does not:

- promise profit;
- give real-money investment advice;
- execute trades;
- request passwords or payment-card details;
- access real broker APIs;
- access local files, shell commands, GitHub credentials, Cloudflare credentials or environment variables.

## Kill Switch

To disable Sophia without changing frontend or APK code:

```text
SOPHIA_AI_ENABLED=false
```

The rest of Mentavio remains available.
