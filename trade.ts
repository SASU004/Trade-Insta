import { createKiteClient } from "./config";

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
