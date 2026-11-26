"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import { sessionClock, type ClockState } from "@/lib/ai/live";
import { GHOST, META, PRIMARY, TITLE } from "./ui";
import type { Live } from "./useConsultation";

const minutes = (ms: number) => {
  const s = Math.ceil(ms / 1000);
  return s >= 60 ? `${Math.ceil(s / 60)} minutes` : `${s} seconds`;
};

/**
 * Says in time that the session is about to end, and lets the visitor keep it where that is possible.
 * Not a dialog: it never takes the focus away from what is being written. Screen readers hear it once
 * when it appears; the count beside it is not read out each second.
 */
export default function SessionNotice({ live }: { live: Live }) {
  const [now, setNow] = useState<ClockState | null>(null);
  const [working, setWorking] = useState(false);
  const { clock } = live;

  useEffect(() => {
    if (!clock) return setNow(null);
    let confirming = false;
    const tick = () => {
      const state = sessionClock(clock, Date.now());
      // another tab may have kept it alive: ask before saying it is over
      if (state.state === "expired" && !confirming) {
        confirming = true;
        live.check().then((alive) => !alive && setNow(state));
        return;
      }
      if (!confirming) setNow(state);
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
    // a new clock restarts the watch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clock]);

  if (!now || now.state === "ok") return null;
  const act = (run: () => Promise<boolean>) => async () => {
    setWorking(true);
    await run();
    setWorking(false);
  };
  const words = {
    idle_warning: { title: "Your session is about to end", text: "It ends after 30 minutes without activity, and the server then erases this conversation." },
    lifetime_warning: { title: "This session is reaching its 24-hour limit", text: "It cannot be extended. Copy anything you want to keep." },
    expired: { title: "Your session has ended", text: "The server no longer holds this conversation. What is on screen stays until you start again or leave." },
  }[now.state];

  return (
    <div data-session-notice={now.state} className="mx-auto w-full max-w-[800px] px-3 pb-2 sm:px-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-[12px] border border-warning/40 bg-surface/95 px-3.5 py-2.5">
        <Clock3 size={16} aria-hidden className="shrink-0 text-warning" />
        <div className="min-w-0 flex-1 basis-56">
          <div role="alert">
            <p className={TITLE}>{words.title}</p>
            <p className={META}>{words.text}</p>
          </div>
          {now.state !== "expired" && (
            <p aria-hidden className={`tabular-nums ${META}`}>
              About {minutes(now.msLeft)} left
            </p>
          )}
        </div>
        {now.state === "idle_warning" && (
          <button type="button" className={PRIMARY} disabled={working} onClick={act(live.renew)}>
            Keep this conversation
          </button>
        )}
        {now.state === "expired" && (
          <button type="button" className={GHOST} disabled={working} onClick={act(live.startOver)}>
            Start a new session
          </button>
        )}
      </div>
    </div>
  );
}
