import { validateProductProfile, type ChatbotProductProfile } from "./types";

export type ProductRegistry = Readonly<{
  ids: readonly string[];
  get(id: string): ChatbotProductProfile | undefined;
  require(id: string): ChatbotProductProfile;
}>;

/**
 * Build a closed registry from explicitly imported product profiles. Runtime
 * selection can only choose an ID already present here; it never turns user or
 * environment input into a module path, URL, or arbitrary configuration.
 */
export function createProductRegistry(profiles: readonly ChatbotProductProfile[]): ProductRegistry {
  const index = new Map<string, ChatbotProductProfile>();
  for (const candidate of profiles) {
    const profile = validateProductProfile(candidate);
    if (index.has(profile.id)) throw new Error(`duplicate product profile id ${profile.id}`);
    index.set(profile.id, profile);
  }
  if (index.size === 0) throw new Error("product registry requires at least one profile");

  const ids = Object.freeze([...index.keys()]);
  return Object.freeze({
    ids,
    get(id: string) {
      return index.get(id);
    },
    require(id: string) {
      const profile = index.get(id);
      if (!profile) throw new Error(`unknown product profile ${id}`);
      return profile;
    },
  });
}

/**
 * Resolve a configured profile without widening the allowlist. Unknown or
 * blank requested IDs fail closed to the explicit default product.
 */
export function resolveProductProfile(
  registry: ProductRegistry,
  requestedId: string | undefined,
  defaultId: string,
): ChatbotProductProfile {
  const fallback = registry.require(defaultId);
  const requested = requestedId?.trim();
  return requested ? registry.get(requested) ?? fallback : fallback;
}
