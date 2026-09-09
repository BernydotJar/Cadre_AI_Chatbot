/** Classic isolated-world entry; build injects only the reviewed origin list. */
declare const PREVIEW_SITE_ORIGINS: readonly string[];

type PreviewPageContext =
  | "generic" | "home" | "agents" | "agents-discover" | "strategy"
  | "engineering" | "leadership" | "industries" | "case-studies" | "contact";

function pageContext(): PreviewPageContext {
  const path = location.pathname.replace(/\/+$/u, "") || "/";
  const hash = location.hash.toLowerCase();
  if (path === "/agents" && hash === "#discover-agents") return "agents-discover";
  if (path === "/agents") return "agents";
  if (path === "/strategy") return "strategy";
  if (path === "/ai-engineering") return "engineering";
  if (path === "/leadership-facilitation") return "leadership";
  if (path === "/industries") return "industries";
  if (path === "/case-studies") return "case-studies";
  if (path === "/contact") return "contact";
  if (path === "/") return "home";
  return "generic";
}

function mountPreview() {
  if (window !== window.top || !PREVIEW_SITE_ORIGINS.includes(location.origin)
    || location.protocol !== "https:" || document.getElementById("cadre-integration-preview")) return;
  const host = document.createElement("div");
  host.id = "cadre-integration-preview";
  // The page can remove/occlude this host. Shadow DOM is a style boundary only.
  host.style.cssText = "all:initial!important;position:fixed!important;right:max(16px,env(safe-area-inset-right))!important;bottom:max(16px,env(safe-area-inset-bottom))!important;z-index:2147483000!important;display:block!important;";
  const shadow = host.attachShadow({ mode: "closed" });
  const style = document.createElement("style");
  style.textContent = `
    :host{color-scheme:light}*{box-sizing:border-box}button{font:700 14px/1.2 Inter,Arial,sans-serif;cursor:pointer}
    .launcher{position:relative;width:62px;height:62px;border:1px solid #34282b;border-radius:21px;background:linear-gradient(145deg,#242124,#111114);color:#fff;box-shadow:0 14px 38px #2c17233d,0 0 0 1px #ffffff14 inset;display:grid;place-items:center;overflow:visible}
    .launcher::before{content:"";position:absolute;inset:-5px;border:1px solid #db45454d;border-radius:25px;animation:cadre-pulse 3s ease-in-out infinite}
    .launcher:hover{transform:translateY(-2px);box-shadow:0 18px 45px #2c17234d,0 0 0 1px #ffffff1c inset}.launcher:focus-visible{outline:3px solid #225d51;outline-offset:5px}
    .mark{position:relative;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 35% 25%,#ffae95 0 12%,#ef695d 32%,#db4545 58%,#8d2431 100%);font:800 17px/1 Arial,sans-serif;color:#fff;box-shadow:0 6px 18px #db454559}
    .mark::after{content:"";position:absolute;inset:6px;border:1px solid #ffffff66;border-radius:50%}
    .tip{position:absolute;right:0;bottom:74px;width:max-content;max-width:260px;padding:11px 14px;border:1px solid #3a3432;border-radius:12px;background:#18181b;color:#fff;font:650 12px/1.4 Inter,Arial,sans-serif;box-shadow:0 10px 30px #18181b33;opacity:0;transform:translateY(5px);pointer-events:none}
    .tip::after{content:"Candidate Integration Preview";display:block;margin-top:3px;color:#d3cbc2;font-size:9px;font-weight:550;letter-spacing:.03em}
    .launcher:hover+.tip,.launcher:focus-visible+.tip{opacity:1;transform:translateY(0)}
    iframe{display:block;width:min(420px,calc(100vw - 32px));height:min(650px,calc(100dvh - 104px));min-height:240px;border:1px solid #d7d0c5;border-radius:24px;background:#f7f3eb;box-shadow:0 24px 70px #261d223d;margin-bottom:14px}
    [hidden]{display:none!important}@keyframes cadre-pulse{0%,100%{transform:scale(.98);opacity:.55}50%{transform:scale(1.05);opacity:1}}
    @media(prefers-reduced-motion:no-preference){.launcher,.tip{transition:transform .16s ease,box-shadow .16s ease,opacity .16s ease}}
    @media(prefers-reduced-motion:reduce){.launcher::before{animation:none}}
  `
  const launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "launcher";
  launcher.setAttribute("aria-label", "Open Cadre Assistant");
  launcher.setAttribute("aria-expanded", "false");
  launcher.setAttribute("aria-describedby", "cadre-preview-tooltip");
  const mark = document.createElement("span");
  mark.className = "mark";
  mark.setAttribute("aria-hidden", "true");
  mark.textContent = "C";
  launcher.append(mark);
  const tooltip = document.createElement("span");
  tooltip.id = "cadre-preview-tooltip";
  tooltip.className = "tip";
  tooltip.setAttribute("role", "tooltip");
  tooltip.textContent = "Open Cadre Assistant";
  shadow.append(style, launcher, tooltip);
  let iframe: HTMLIFrameElement | undefined;
  let disposed = false;
  let registered = false;
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const token = [...bytes].map((value) => value.toString(16).padStart(2, "0")).join("");
  let port: PreviewPort | undefined;
  let wantOpen = false;
  let currentContext = pageContext();
  function minimize() {
    if (iframe) iframe.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-label", "Open Cadre Assistant");
    launcher.focus();
  }
  function close() {
    iframe?.remove();
    iframe = undefined;
    minimize();
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    iframe?.remove();
    host.remove();
    window.removeEventListener("pagehide", onPageHide);
    window.removeEventListener("hashchange", onLocationContextChange);
    window.removeEventListener("popstate", onLocationContextChange);
    observer.disconnect();
    try { port?.disconnect(); } catch { /* Extension may have been disabled. */ }
  }
  const observer = new MutationObserver(() => { if (!host.isConnected) dispose(); });
  function onPageHide() { dispose(); }
  function onLocationContextChange() {
    const next = pageContext();
    if (next === currentContext) return;
    currentContext = next;
    try { if (registered) port?.postMessage({ type: "CONTEXT", pageContext: currentContext }); }
    catch { /* A disconnected worker will be recovered on the next explicit open. */ }
  }
  function open() {
    if (!registered || disposed) return;
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.src = chrome.runtime.getURL(`panel.html#${token}`);
      iframe.title = "Cadre AI Assistant — Integration Preview";
      iframe.setAttribute("referrerpolicy", "no-referrer");
      iframe.setAttribute("allow", "");
      shadow.insertBefore(iframe, launcher);
    }
    iframe.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    launcher.setAttribute("aria-label", "Minimize Cadre Assistant");
    iframe.focus();
  }
  function connect() {
    if (port || disposed) return;
    try {
      const current = chrome.runtime.connect({ name: "cadre-preview-host-v1" });
      port = current;
      current.onMessage.addListener((message) => {
        if (!message || typeof message !== "object" || Object.keys(message).length !== 1) return;
        const type = (message as { type?: unknown }).type;
        if (type === "REGISTERED") { registered = true; if (wantOpen) { wantOpen = false; open(); } }
        else if (type === "MINIMIZE") minimize();
        else if (type === "CLOSE") close();
      });
      current.onDisconnect.addListener(() => {
        if (port !== current || disposed) return;
        port = undefined;
        registered = false;
        wantOpen = false;
        close();
        // An idle MV3 worker may disconnect a launcher-only document. Reconnect
        // only after another user click; never keep an unused worker awake.
        try { if (!chrome.runtime.id) dispose(); } catch { dispose(); }
      });
      current.postMessage({ type: "REGISTER", token, pageContext: currentContext });
    } catch { dispose(); }
  }
  launcher.addEventListener("click", (event) => {
    if (!event.isTrusted || disposed) return;
    if (iframe && !iframe.hidden) { minimize(); return; }
    if (!registered) { wantOpen = true; connect(); return; }
    open();
  });
  launcher.addEventListener("keydown", (event) => { if (event.key === "Escape") { event.preventDefault(); minimize(); } });
  window.addEventListener("pagehide", onPageHide, { once: true });
  window.addEventListener("hashchange", onLocationContextChange);
  window.addEventListener("popstate", onLocationContextChange);
  document.documentElement.append(host);
  observer.observe(document.documentElement, { childList: true });
  connect();
}
mountPreview();
export {};
