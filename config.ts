import dns from "node:dns";
import net from "node:net";
import { KiteConnect } from "kiteconnect";

// Kite checks the IP of the outgoing request. This machine has both
// IPv4 (whitelisted) and IPv6 (not). Prefer IPv4 so placeOrder matches.
dns.setDefaultResultOrder("ipv4first");
if (typeof net.setDefaultAutoSelectFamily === "function") {
  net.setDefaultAutoSelectFamily(false);
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env and fill it in. Never commit .env.`
    );
  }
  return value;
}

export function getKiteConfig() {
  return {
    apiKey: requireEnv("KITE_API_KEY"),
    apiSecret: process.env["KITE_API_SECRET"] ?? "",
    requestToken: process.env["KITE_REQUEST_TOKEN"] ?? "",
    accessToken: requireEnv("KITE_ACCESS_TOKEN"),
  };
}

export function createKiteClient(): KiteConnect {
  const { apiKey, accessToken } = getKiteConfig();
  const kc = new KiteConnect({ api_key: apiKey });
  kc.setAccessToken(accessToken);
  return kc;
}
