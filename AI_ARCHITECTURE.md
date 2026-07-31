# Mentavio Sophia AI Architecture

Status: MVP foundation

## Role

Sophia is the educational AI mentor inside Mentavio. Sophia explains concepts, simulated events, decision-making, and risk awareness. Sophia must not promise profit, recommend real investments, execute actions, or present herself as a licensed financial adviser.

## Provider Abstraction

The backend exposes a neutral Sophia layer:

- `GET /ai/sophia/status`
- `POST /ai/sophia/chat`
- `GET /ai/sophia/system-instruction`

The first provider is `mock`, which is safe for APK testing and does not require any API key. Future providers can be connected behind this layer without placing secrets in the browser or APK.

## Configuration

- `SOPHIA_ENABLED=false` disables Sophia while the simulation continues.
- `SOPHIA_PROVIDER=mock` selects the current mock provider.

## Safety

- API keys must stay on the server.
- The APK must never contain provider secrets.
- Sophia errors must not block market simulation, trading, portfolio, store, or account flows.
- The system instruction is stored in `src/ai/sophia.constants.ts`.

