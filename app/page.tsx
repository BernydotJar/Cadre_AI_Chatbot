import { cadre } from "@/config/cadre";
import { getProviderMode, liveConfiguration } from "@/provider/config";
import { SupportChat } from "@/ui/support-chat";

// Derive the safe label for each request, never from a build-time snapshot.
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
  const approvedLinks = [...new Map([
    cadre.contact,
    ...cadre.knowledge.flatMap((entry) => entry.approvedLinks),
  ].map((link) => [link.url, link])).values()];
  return <SupportChat clientName={cadre.clientName} botName={cadre.botName}
    contact={cadre.contact} approvedLinks={approvedLinks} modeLabel={modeLabel}
    topics={cadre.knowledge.map((entry) => ({ id: entry.id, label: entry.label }))} />;
}
