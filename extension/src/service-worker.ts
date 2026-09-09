import { API_ENDPOINT, SITE_ORIGINS } from "./generated-config";
import { installBridge } from "./shared/bridge";

installBridge(chrome.runtime, API_ENDPOINT, SITE_ORIGINS);
