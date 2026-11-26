"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type Dispatch } from "react";
import { Keyboard, Mic, MicOff, RotateCcw, ScrollText, Square, Volume2, VolumeX, X } from "lucide-react";
import { voiceSample } from "@/lib/ai/mockConsultant";
import type { VoiceEvent, VoiceModel, VoiceState } from "@/lib/ai/voiceMachine";
import { OUTLINE, PRIMARY } from "./Cards";
import type { Consultation, Reply } from "./useConsultation";
import styles from "./ai.module.css";

/**
 * The voice screen, SIMULATED: no microphone is opened, no sound is played or sent. Each state is
 * stepped through on timers and buttons. A real version keeps this screen and the states, and drives
 * the rings from the real input and output level instead of a loop.
 */
const COPY: Record<VoiceState, { title: string; hint: string }> = {
  ready: { title: "Ready when you are", hint: "Press the button, then say what you want to build." },
  permission: { title: "Microphone permission", hint: "The real version asks your browser for the microphone here. This prototype does not." },
  listening: { title: "Listening (simulated)", hint: "Press stop when you have finished." },
  stopped: { title: "Recording stopped", hint: "Preparing your words." },
  transcribing: { title: "Writing down what you said", hint: "Simulated transcription." },
  review: { title: "Check your words", hint: "Nothing is used until you send it. Edit anything that is wrong." },
  thinking: { title: "Preparing a reply", hint: "" },
  speaking: { title: "Replying (no sound in this prototype)", hint: "" },
  muted: { title: "Sound off", hint: "The reply continues as text." },
  error: { title: "", hint: "" },
  ended: { title: "Voice consultation ended", hint: "The conversation is still there in text." },
};
const ERRORS = {
  mic_denied: { title: "The microphone is blocked", hint: "Allow it in your browser settings, or continue by typing." },
  transcription: { title: "We could not make out the words", hint: "Try again, or type your message instead." },
  reply: { title: "The reply did not arrive", hint: "Switch to text to see what happened and try again." },
};
const CONTROL = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 font-urbanist text-[14px] font-semibold";

type Props = {
  voice: VoiceModel;
  dispatch: Dispatch<VoiceEvent>;
  chat: Consultation;
  failTranscription: boolean;
  denyMicrophone: boolean;
  onText: (draft?: string) => void;
};

export default function VoiceView({ voice, dispatch, chat, failTranscription, denyMicrophone, onText }: Props) {
  const { state } = voice;
  const [seconds, setSeconds] = useState(0);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const main = useRef<HTMLDivElement>(null);
  const reply = chat.messages.findLast((m): m is Reply => m.from === "assistant");
  const copy = state === "error" && voice.error ? ERRORS[voice.error] : COPY[state];

  // keyboard users stay with the controls as these change
  useEffect(() => {
    const box = main.current;
    if (box && (document.activeElement === document.body || !box.closest("[role=dialog]")?.contains(document.activeElement) || box.contains(document.activeElement))) {
      box.querySelector<HTMLElement>("[data-primary]")?.focus({ preventScroll: true });
    }
  }, [state]);

  useEffect(() => {
    if (state !== "listening") return setSeconds(0);
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [state]);

  useEffect(() => {
    if (state === "stopped") {
      const t = window.setTimeout(() => dispatch({ type: "TRANSCRIBE" }), 600);
      return () => clearTimeout(t);
    }
    if (state === "transcribing") {
      const t = window.setTimeout(() => dispatch(failTranscription ? { type: "TRANSCRIPTION_FAILED" } : { type: "TRANSCRIBED", text: voiceSample(chat.session()) }), 1100);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the sample is read once, when this state begins
  }, [state, failTranscription]);

  // follow the shared conversation: reply started, failed, then "spoken" for as long as it would take to say
  useEffect(() => {
    if (state === "thinking") {
      if (reply?.state === "streaming" || reply?.state === "done") dispatch({ type: "REPLY" });
      if (reply?.state === "problem") dispatch({ type: "FAIL" });
      if (reply?.state === "cancelled") dispatch({ type: "CANCEL" });
    }
  }, [state, reply?.state, dispatch]);
  const spoken = state === "speaking" || state === "muted";
  useEffect(() => {
    if (!spoken || reply?.state !== "done") return;
    const t = window.setTimeout(() => dispatch({ type: "DONE" }), Math.min(9000, 1500 + reply.text.split(" ").length * 220));
    return () => clearTimeout(t);
  }, [spoken, reply?.state, reply?.text, dispatch]);

  // only for a reply to something said on this screen, not an older typed one
  const [before] = useState(() => reply?.id ?? 0);
  const cards = reply?.state === "done" && reply.id > before ? (reply.response?.components.length ?? 0) : 0;
  const said = chat.messages.filter((m) => m.from === "visitor" || m.text);

  return (
    <div ref={main} data-voice={state} data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      <div className="mx-auto flex min-h-full w-full max-w-[640px] flex-col items-center justify-center px-5 py-6 text-center">
        <div aria-hidden className={styles.orb} data-state={state}>
          <span className={styles.ring} />
          <span className={styles.ring} />
          <span className={styles.ring} />
          <span className={styles.core}>{state === "muted" ? <VolumeX size={30} /> : state === "error" ? <MicOff size={30} /> : state === "speaking" ? <Volume2 size={30} /> : <Mic size={30} />}</span>
        </div>
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border-strong px-3 py-1 text-[12px] font-medium text-content-muted">
          Simulated voice: your microphone is not used
        </p>

        <div role="status" className="mt-5">
          <h2 className="font-urbanist text-[24px] font-bold leading-tight tracking-[-0.015em] text-content">{copy.title}</h2>
          {copy.hint && <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-content-muted">{copy.hint}</p>}
        </div>
        {state === "listening" && (
          <p className="mt-2 font-mono text-[13px] tabular-nums text-content-muted" aria-hidden>
            {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")} simulated
          </p>
        )}

        {state === "review" && (
          <label className="mt-4 block w-full text-left text-[13px] font-semibold text-content">
            Sample transcript (simulated)
            <textarea rows={3} maxLength={1500} value={voice.transcript} onChange={(e) => dispatch({ type: "EDIT", text: e.target.value })} className="mt-1 w-full rounded-control border border-border-strong bg-surface px-3 py-2.5 text-[16px] font-normal leading-relaxed text-content sm:text-[15px]" />
          </label>
        )}
        {spoken && reply?.text && (
          <p data-caption className="mt-4 max-h-40 w-full overflow-y-auto rounded-panel bg-surface-soft p-4 text-left text-[15px] leading-relaxed text-content" tabIndex={0}>
            {reply.text}
          </p>
        )}
        {cards > 0 && (state === "speaking" || state === "muted" || state === "ready") && (
          <button type="button" onClick={() => onText()} className="mt-3 min-h-10 text-[13.5px] font-semibold text-content underline decoration-border-strong underline-offset-4">
            This reply added details to the conversation. View them
          </button>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          {state === "ready" && (
            <button type="button" data-primary className={`${CONTROL} bg-content text-surface`} onClick={() => dispatch({ type: "START" })}>
              <Mic size={16} aria-hidden /> Start recording
            </button>
          )}
          {state === "permission" && (
            <>
              <button type="button" data-primary className={PRIMARY} onClick={() => dispatch({ type: denyMicrophone ? "DENY" : "ALLOW" })}>
                Simulate allowing it
              </button>
              <button type="button" className={OUTLINE} onClick={() => dispatch({ type: "DENY" })}>
                Simulate blocking it
              </button>
            </>
          )}
          {state === "listening" && (
            <button type="button" data-primary className={`${CONTROL} bg-content text-surface`} onClick={() => dispatch({ type: "STOP" })}>
              <Square size={13} fill="currentColor" aria-hidden /> Stop recording
            </button>
          )}
          {(state === "stopped" || state === "transcribing") && (
            <button type="button" data-primary className={OUTLINE} onClick={() => dispatch({ type: "CANCEL" })}>
              Cancel
            </button>
          )}
          {state === "review" && (
            <>
              <button
                type="button"
                data-primary
                className={PRIMARY}
                disabled={!voice.transcript.trim() || chat.busy}
                onClick={() => {
                  if (chat.send(voice.transcript)) dispatch({ type: "CONFIRM" });
                }}
              >
                Send these words
              </button>
              <button type="button" className={OUTLINE} onClick={() => dispatch({ type: "DISCARD" })}>
                Record again
              </button>
              <button type="button" className={OUTLINE} onClick={() => onText(voice.transcript)}>
                Edit as text
              </button>
            </>
          )}
          {state === "thinking" && (
            <button
              type="button"
              data-primary
              className={OUTLINE}
              onClick={() => {
                chat.stop();
                dispatch({ type: "CANCEL" });
              }}
            >
              Cancel
            </button>
          )}
          {spoken && (
            <>
              <button type="button" data-primary className={PRIMARY} onClick={() => dispatch({ type: "STOP_PLAYBACK" })}>
                <Square size={12} fill="currentColor" aria-hidden /> Stop playback
              </button>
              <button type="button" className={OUTLINE} aria-pressed={state === "muted"} onClick={() => dispatch({ type: state === "muted" ? "UNMUTE" : "MUTE" })}>
                {state === "muted" ? <Volume2 size={15} aria-hidden /> : <VolumeX size={15} aria-hidden />}
                {state === "muted" ? "Sound on" : "Mute"}
              </button>
            </>
          )}
          {state === "error" && (
            <>
              <button type="button" data-primary className={PRIMARY} onClick={() => onText()}>
                <Keyboard size={15} aria-hidden /> Type instead
              </button>
              <button type="button" className={OUTLINE} onClick={() => dispatch({ type: "RETRY" })}>
                <RotateCcw size={14} aria-hidden /> Try again
              </button>
              <Link href="/contact" data-booking className={OUTLINE}>
                Book a consultation
              </Link>
            </>
          )}
          {state === "ended" && (
            <>
              <button type="button" data-primary className={PRIMARY} onClick={() => onText()}>
                Return to the conversation
              </button>
              <button type="button" className={OUTLINE} onClick={() => dispatch({ type: "RESTART" })}>
                Start voice again
              </button>
            </>
          )}
        </div>

        {state !== "ended" && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-1 text-content-muted">
            <button type="button" className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium hover:bg-surface-soft hover:text-content" onClick={() => onText(state === "review" ? voice.transcript : undefined)}>
              <Keyboard size={15} aria-hidden /> Switch to text
            </button>
            <button type="button" aria-expanded={transcriptOpen} className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium hover:bg-surface-soft hover:text-content" onClick={() => setTranscriptOpen((o) => !o)}>
              <ScrollText size={15} aria-hidden /> {transcriptOpen ? "Hide transcript" : "View transcript"}
            </button>
            <button type="button" className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium hover:bg-surface-soft hover:text-content" onClick={() => dispatch({ type: "END" })}>
              <X size={15} aria-hidden /> End voice
            </button>
          </div>
        )}
        {transcriptOpen && (
          <ol aria-label="Transcript" tabIndex={0} className="mt-3 max-h-56 w-full space-y-2 overflow-y-auto rounded-panel border border-border p-4 text-left text-[13.5px] leading-relaxed">
            {said.length === 0 && <li className="text-content-muted">Nothing has been said yet.</li>}
            {said.map((m) => (
              <li key={m.id}>
                <strong className="font-urbanist">{m.from === "visitor" ? "You" : "CodeShaper AI"}:</strong> {m.text}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
