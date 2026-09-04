import { createKiteClient } from "./config";
import type { AutosliceOrderResponse, PortfolioHolding } from "kiteconnect";

export async function placeOrder(
  tradingsymbol: string,
  type: "BUY" | "SELL",
  quantity: number
) {
  if (!tradingsymbol.trim()) throw new Error("tradingsymbol is required");
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("quantity must be a positive integer");
  }
  const kc = createKiteClient();
  try {
    const orderId = await kc.placeOrder("regular", {
      exchange: "NSE",
      tradingsymbol,
      transaction_type: type,
      quantity,
      product: "CNC",
      order_type: "MARKET",
    });
    return orderId;
  } catch (err) {
    console.error("placeOrder failed:", err instanceof Error ? err.message : err);
    throw err;
  }
}

// Basic duplicated wrappers around placeOrder (same NSE / CNC / MARKET defaults).
export async function buyStock(tradingsymbol: string, quantity: number) {
  return placeOrder(tradingsymbol, "BUY", quantity);
}

export async function sellStock(tradingsymbol: string, quantity: number) {
  return placeOrder(tradingsymbol, "SELL", quantity);
}

export async function getHoldings(): Promise<PortfolioHolding[]> {
  const kc = createKiteClient();
  try {
    return await kc.getHoldings();
  } catch (err) {
    console.error("getHoldings failed:", err instanceof Error ? err.message : err);
    throw err;
  }
}

export async function sellAll(): Promise<
  { tradingsymbol: string; quantity: number; orderId: AutosliceOrderResponse }[]
> {
  const holdings = await getHoldings();
  const sellable = holdings.filter((h) => h.quantity > 0);
  const results: { tradingsymbol: string; quantity: number; orderId: AutosliceOrderResponse }[] = [];
  for (const h of sellable) {
    const orderId = await sellStock(h.tradingsymbol, h.quantity);
    results.push({ tradingsymbol: h.tradingsymbol, quantity: h.quantity, orderId });
  }
  return results;
}
