import { createProductRegistry, resolveProductProfile } from "./registry";
import { cadreDonna } from "./profiles/cadre-donna";
import type { ChatbotProductProfile } from "./types";

export const DEFAULT_PRODUCT_ID = cadreDonna.id;
export const productRegistry = createProductRegistry([cadreDonna]);

/**
 * Deployment-time selection is allowlisted. An unknown environment value
 * cannot import another module or widen knowledge; it falls back to Donna.
 */
export function activeProduct(env: Record<string, string | undefined> = process.env): ChatbotProductProfile {
  return resolveProductProfile(productRegistry, env.CHATBOT_PRODUCT_PROFILE, DEFAULT_PRODUCT_ID);
}
