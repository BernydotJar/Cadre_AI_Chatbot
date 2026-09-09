/** Minimal used Chrome surface; no permission-expanding API is declared. */
interface PreviewSender {
  id?: string;
  url?: string;
  origin?: string;
  frameId?: number;
  documentId?: string;
  tab?: { id?: number };
}
interface PreviewPort {
  name: string;
  sender?: PreviewSender;
  postMessage(message: unknown): void;
  disconnect(): void;
  onMessage: { addListener(listener: (message: unknown) => void): void };
  onDisconnect: { addListener(listener: () => void): void };
}
declare const chrome: {
  runtime: {
    id: string;
    lastError?: { message?: string };
    getURL(path: string): string;
    connect(options: { name: string }): PreviewPort;
    onConnect: { addListener(listener: (port: PreviewPort) => void): void };
  };
};
