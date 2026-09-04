# trade-insta — learning playground (trial, not for real trading)

> I'm learning MCP + the Zerodha Kite Connect API with Bun. This repo is trial code.
> **Not financial advice. Do not use with real money.** Prefer paper/dry-run first.

## What this is

- Small Bun + TypeScript playground wiring [Kite Connect](https://developers.kite.trade) (`kiteconnect@5`) and an MCP server stub (`@modelcontextprotocol/server`).
- Credentials are loaded from env (`.env`, never committed). See `.env.example`.
- Created with `bun init` (bun v1.4.0). [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## Setup

```bash
bun install
cp .env.example .env   # then fill in real values from https://developers.kite.trade
```

Required env (`config.ts` validates on startup):

| Var | Needed for |
| --- | --- |
| `KITE_API_KEY` | everything |
| `KITE_ACCESS_TOKEN` | everything (expires daily) |
| `KITE_API_SECRET` | only `--generate-session` |
| `KITE_REQUEST_TOKEN` | only `--generate-session` |

Run:

```bash
bun run index.ts                      # reads your Kite profile
bun run index.ts --generate-session   # one-time: exchanges request token -> prints a new access token
bunx tsc --noEmit                     # typecheck
```

## What works

- `config.ts` — central env loading + `createKiteClient()`, IPv4-first workaround for Kite IP whitelisting.
- `index.ts` — `getProfile()` via env client; runs only when executed directly (`import.meta.main`), so importing it has no side effects.
- `trade.ts` — `placeOrder(symbol, "BUY" | "SELL", qty)` helper with basic validation (non-empty symbol, positive-int qty), hardcoded to `NSE` / `CNC` / `MARKET`.

## What doesn't work / known limitations

- `mcp-server.ts` is a **stub, not wired to trading**. Tools `buy-stock` / `sell-stock` just return `"Bought X!"` / `"Sold X!"` text — they never call `trade.ts` or Kite. Connecting them is the actual MCP learning TODO.
- No dry-run / paper mode — `placeOrder` hits the live API when called.
- `NSE` / `CNC` / `MARKET` are hardcoded; no stop-loss, GTT, margins, or error retry.
- Kite `access_token` expires daily (~morning IST); you must regenerate via `--generate-session`.
- Machine has IPv4 (whitelisted) + IPv6 (not) — `config.ts` forces IPv4; breaks on networks without IPv4.
- No tests, no CI, no logging beyond `console`.
- History note: an earlier public version of this repo briefly contained hardcoded keys. Those keys must be treated as leaked — regenerate in the Kite dashboard before use. Current code has no secrets; `.env` and `*.log` are gitignored.

## Security

- Never commit `.env`. Only `.env.example` (placeholders) is tracked.
- If you fork/clone, regenerate your Kite `apiSecret` + `access_token` first.
