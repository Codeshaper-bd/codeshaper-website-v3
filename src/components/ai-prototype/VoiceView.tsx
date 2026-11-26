"use client";

import { useEffect, useRef, useState, type Dispatch } from "react";
import { Keyboard, Mic, RotateCcw, ScrollText, Square, Volume2, VolumeX, X } from "lucide-react";
import { voiceSample } from "@/lib/ai/mockConsultant";
import type { VoiceEvent, VoiceModel, VoiceState } from "@/lib/ai/voiceMachine";
import { AREA, FIELD_LABEL, GHOST, LINK, PRIMARY, SECONDARY } from "./ui";
import type { Consultation, Reply } from "./useConsultation";
import VoiceVisual, { type VoiceStyle } from "./VoiceVisual";

/**
 * The voice screen, SIMULATED: no microphone is opened, no sound is played or sent. Each state is
 * stepped through on timers and buttons. A real version keeps this screen and the states, and drives
 * the visual from the real input and output level instead of a loop.
 */
const COPY: Record<VoiceState, { title: string; hint: string }> = {
  ready: { title: "Ready when you are", hint: "Tap the button and say what you want to build." },
  permission: { title: "Microphone permission", hint: "The real version asks your browser here. This prototype does not." },
  listening: { title: "Listening (simulated)", hint: "Stop when you have finished." },
  stopped: { title: "Recording stopped", hint: "Preparing your words." },
  transcribing: { title: "Writing down what you said", hint: "Simulated transcription." },
  review: { title: "Check your words", hint: "Nothing is used until you send it." },
  thinking: { title: "Thinking", hint: "" },
  speaking: { title: "Replying", hint: "Shown as text: this prototype plays no sound." },
  muted: { title: "Sound off", hint: "The reply continues as text." },
  error: { title: "", hint: "" },
  ended: { title: "Voice consultation ended", hint: "Everything said is still in the conversation." },
};
const ERRORS = {
  mic_denied: { title: "The microphone is blocked", hint: "Allow it in your browser settings, or continue by typing." },
  transcription: { title: "We could not make out the words", hint: "Try again, or type your message instead." },
  reply: { title: "The reply did not arrive", hint: "Switch to text to see what happened and try again." },
};
/** The voice screen's one main action: a size up, as it is often reached for without looking. */
const MAIN = `${PRIMARY} !h-11 px-5`;
const SIDE = `${GHOST} text-content-muted`;

type Props = {
  voice: VoiceModel;
  dispatch: Dispatch<VoiceEvent>;
  chat: Consultation;
  look: VoiceStyle;
  failTranscription: boolean;
  denyMicrophone: boolean;
  /** the first-use note, until it is accepted: nothing can be recorded before */
  notice?: React.ReactNode;
  /** the cards of the latest answer, completed here by touch or keyboard rather than by voice */
  step?: React.ReactNode;
  onBook: () => void;
  onText: (draft?: string) => void;
};

export default function VoiceView({ voice, dispatch, chat, look, failTranscription, denyMicrophone, notice, step, onBook, onText }: Props) {
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

  const said = chat.messages.filter((m) => m.from === "visitor" || m.text);
  // cards appear once the visitor is no longer speaking or checking words
  const showStep = !!step && (spoken || state === "ready");
  const size = state === "review" || transcriptOpen || showStep ? "compact" : spoken ? "medium" : "full";

  return (
    <div ref={main} data-voice={state} data-lenis-prevent className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
      <div data-stacked={showStep} className="mx-auto flex w-full max-w-[720px] flex-1 flex-col items-center justify-center px-5 py-5 text-center [@media(max-height:540px)]:justify-start data-[stacked=true]:justify-start">
        {!notice && <VoiceVisual look={look} state={state} size={size} />}
        <p className="mt-3 inline-flex items-center gap-2 text-[12.5px] font-medium text-content-muted">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full border border-content-muted" />
          Simulated voice: your microphone is not used
        </p>

        {notice ?? (
          <>
            <div role="status" className="mt-4">
              <h2 className="font-urbanist text-[20px] font-bold leading-tight tracking-[-0.01em] text-content sm:text-[22px]">{copy.title}</h2>
              {copy.hint && <p className="mx-auto mt-1 max-w-sm text-[14px] leading-relaxed text-content-muted">{copy.hint}</p>}
            </div>
            {state === "listening" && (
              <p className="mt-2 font-mono text-[13px] tabular-nums text-content-muted" aria-hidden>
                {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")} simulated
              </p>
            )}

            {state === "review" && (
              <label className={`mt-3 w-full max-w-[520px] text-left ${FIELD_LABEL}`}>
                Sample transcript (simulated). Edit anything that is wrong.
                <textarea rows={3} maxLength={1500} value={voice.transcript} onChange={(e) => dispatch({ type: "EDIT", text: e.target.value })} className={`${AREA} !text-[16px]`} />
              </label>
            )}
            {spoken && reply?.text && (
              <p data-caption className="mt-4 max-h-44 w-full max-w-[560px] overflow-y-auto text-balance text-[15.5px] leading-[1.65] text-content" tabIndex={0}>
                {reply.text}
              </p>
            )}
            <div className="mt-6 flex w-full flex-col items-center justify-center gap-2 sm:flex-row">
              {state === "ready" && (
                <button type="button" data-primary className={MAIN} onClick={() => dispatch({ type: "START" })}>
                  <Mic size={16} aria-hidden /> Start recording
                </button>
              )}
              {state === "permission" && (
                <>
                  <button type="button" data-primary className={MAIN} onClick={() => dispatch({ type: denyMicrophone ? "DENY" : "ALLOW" })}>
                    Simulate allowing it
                  </button>
                  <button type="button" className={LINK} onClick={() => dispatch({ type: "DENY" })}>
                    Simulate blocking it
                  </button>
                </>
              )}
              {state === "listening" && (
                <button type="button" data-primary className={MAIN} onClick={() => dispatch({ type: "STOP" })}>
                  <Square size={14} fill="currentColor" aria-hidden /> Stop recording
                </button>
              )}
              {(state === "stopped" || state === "transcribing") && (
                <button type="button" data-primary className={SECONDARY} onClick={() => dispatch({ type: "CANCEL" })}>
                  Cancel
                </button>
              )}
              {state === "review" && (
                <>
                  <button
                    type="button"
                    data-primary
                    className={MAIN}
                    disabled={!voice.transcript.trim() || chat.busy}
                    onClick={() => {
                      if (chat.send(voice.transcript)) dispatch({ type: "CONFIRM" });
                    }}
                  >
                    Send these words
                  </button>
                  <button type="button" className={LINK} onClick={() => dispatch({ type: "DISCARD" })}>
                    Record again
                  </button>
                </>
              )}
              {state === "thinking" && (
                <button
                  type="button"
                  data-primary
                  className={SECONDARY}
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
                  <button type="button" data-primary className={MAIN} onClick={() => dispatch({ type: "STOP_PLAYBACK" })}>
                    <Square size={13} fill="currentColor" aria-hidden /> Stop playback
                  </button>
                  <button type="button" className={SECONDARY} aria-pressed={state === "muted"} onClick={() => dispatch({ type: state === "muted" ? "UNMUTE" : "MUTE" })}>
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
                  <button type="button" className={SECONDARY} onClick={() => dispatch({ type: "RETRY" })}>
                    <RotateCcw size={14} aria-hidden /> Try again
                  </button>
                  <button type="button" className={LINK} onClick={onBook}>
                    Book a call
                  </button>
                </>
              )}
              {state === "ended" && (
                <>
                  <button type="button" data-primary className={MAIN} onClick={() => onText()}>
                    Return to the conversation
                  </button>
                  <button type="button" className={LINK} onClick={() => dispatch({ type: "RESTART" })}>
                    Start voice again
                  </button>
                </>
              )}
            </div>
          </>
        )}
        {showStep && <div className="mt-5 w-full max-w-[640px] text-left">{step}</div>}
        {transcriptOpen && (
          <ol aria-label="Transcript" tabIndex={0} className="mt-5 max-h-56 w-full max-w-[560px] space-y-2 overflow-y-auto border-y border-border py-3 text-left text-[14.5px] leading-relaxed">
            {said.length === 0 && <li className="text-content-muted">Nothing has been said yet.</li>}
            {said.map((m) => (
              <li key={m.id}>
                <strong className="font-urbanist">{m.from === "visitor" ? "You" : "CodeShaper AI"}:</strong> {m.text}
              </li>
            ))}
          </ol>
        )}
      </div>
      {state !== "ended" && (
        <div className="flex shrink-0 flex-wrap items-center justify-center gap-1 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1">
          <button type="button" className={SIDE} onClick={() => onText(state === "review" ? voice.transcript : undefined)}>
            <Keyboard size={15} aria-hidden /> Switch to text
          </button>
          {!notice && (
            <>
              <button type="button" aria-expanded={transcriptOpen} className={SIDE} onClick={() => setTranscriptOpen((o) => !o)}>
                <ScrollText size={15} aria-hidden /> {transcriptOpen ? "Hide transcript" : "Transcript"}
              </button>
              <button type="button" className={SIDE} onClick={() => dispatch({ type: "END" })}>
                <X size={15} aria-hidden /> End voice
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
