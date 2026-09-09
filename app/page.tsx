import { getProviderMode, liveConfiguration } from "@/provider/config";
import { activeProduct } from "@/product/active";
import { chatExperience } from "@/product/view";
import { SupportChat } from "@/ui/support-chat";

// Derive the safe provider/product labels for each request, never from a
// build-time snapshot. Product selection itself is closed by the registry.
export const dynamic = "force-dynamic";

function currentProviderMode() {
  let mode = getProviderMode();
  if (mode === "openrouter") {
    try { liveConfiguration(process.env, Date.now()); } catch { mode = "unavailable"; }
  }
  return mode;
}

export default function HomePage() {
  const mode = currentProviderMode();
  const modeLabel = mode === "mock" ? "Demo mode"
    : mode === "openrouter" ? "Live model configured" : "Chat unavailable";
  const view = chatExperience(activeProduct());
  return <SupportChat {...view} modeLabel={modeLabel} />;
}
