import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { authenticate } from "@/actions/Illuminate/Broadcasting/BroadcastController";

declare global {
  interface Window {
    Echo?: Echo<"reverb">;
    Pusher: typeof Pusher;
  }
}

window.Pusher = Pusher;

const reverbKey = import.meta.env.VITE_REVERB_APP_KEY;
const reverbHost = import.meta.env.VITE_REVERB_HOST ?? window.location.hostname;
const reverbPort = Number(import.meta.env.VITE_REVERB_PORT ?? "8080");
const reverbScheme = import.meta.env.VITE_REVERB_SCHEME ?? "http";

export const echo = reverbKey
  ? new Echo({
      broadcaster: "reverb",
      key: reverbKey,
      authEndpoint: authenticate.url(),
      wsHost: reverbHost,
      wsPort: reverbPort,
      wssPort: reverbPort,
      forceTLS: reverbScheme === "https",
      enabledTransports: ["ws", "wss"],
    })
  : null;

window.Echo = echo ?? undefined;
