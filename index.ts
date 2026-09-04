import { createKiteClient, getKiteConfig } from "./config";

async function generateSession() {
  const { apiSecret, requestToken } = getKiteConfig();
  if (!apiSecret || !requestToken) {
    throw new Error("Set KITE_API_SECRET and KITE_REQUEST_TOKEN in .env to generate a session.");
  }
  const { KiteConnect } = await import("kiteconnect");
  const kc = new KiteConnect({ api_key: getKiteConfig().apiKey });
  const response = await kc.generateSession(requestToken, apiSecret);
  // Copy this into .env as KITE_ACCESS_TOKEN. It expires daily.
  console.log("New access token generated. Store it in .env as KITE_ACCESS_TOKEN.");
  console.log(response.access_token);
}

async function getProfile() {
  const kc = createKiteClient();
  const profile = await kc.getProfile();
  console.log("Profile:", profile);
}

async function init() {
  // One-time session bootstrap: bun run index.ts --generate-session
  if (process.argv.includes("--generate-session")) {
    await generateSession();
    return;
  }
  await getProfile();
}

// Don't run side effects (especially orders) on import.
// Only run when executed directly: `bun run index.ts`
if (import.meta.main) {
  init().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}
