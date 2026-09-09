/** Classic isolated-world entry; build injects only the reviewed origin list. */
declare const PREVIEW_SITE_ORIGINS: readonly string[];

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
    :host{color-scheme:light}*{box-sizing:border-box}button{font:600 14px/1.2 system-ui,sans-serif;cursor:pointer}
    .launcher{width:56px;height:56px;border:1px solid #3d423a;border-radius:20px;background:#20281f;color:#f6f3e9;box-shadow:0 8px 28px #10170f40;display:grid;place-items:center}
    .launcher:hover{background:#33422e}.launcher:focus-visible{outline:3px solid #c4db91;outline-offset:4px}
    .mark{font-size:27px;font-weight:400}.tip{position:absolute;right:0;bottom:66px;width:max-content;max-width:250px;padding:10px 13px;border-radius:9px;background:#20281f;color:#fff;font:500 13px/1.4 system-ui,sans-serif;opacity:0;pointer-events:none}
    .launcher:hover+.tip,.launcher:focus-visible+.tip{opacity:1}
    iframe{display:block;width:min(390px,calc(100vw - 32px));height:min(620px,calc(100dvh - 100px));min-height:200px;border:1px solid #cecdbf;border-radius:22px;background:#f7f5ee;box-shadow:0 16px 56px #18221640;margin-bottom:12px}
    [hidden]{display:none!important}@media(prefers-reduced-motion:no-preference){.launcher{transition:background .15s}}`;
  const launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "launcher";
  launcher.setAttribute("aria-label", "Open Cadre Assistant");
  launcher.setAttribute("aria-expanded", "false");
  launcher.setAttribute("aria-describedby", "cadre-preview-tooltip");
  const mark = document.createElement("span");
  mark.className = "mark";
  mark.setAttribute("aria-hidden", "true");
  mark.textContent = "✳";
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
    observer.disconnect();
    try { port?.disconnect(); } catch { /* Extension may have been disabled. */ }
  }
  const observer = new MutationObserver(() => { if (!host.isConnected) dispose(); });
  function onPageHide() { dispose(); }
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
      current.postMessage({ type: "REGISTER", token });
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
  document.documentElement.append(host);
  observer.observe(document.documentElement, { childList: true });
  connect();
}
mountPreview();
export {};
