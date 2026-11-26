/**
 * The states of a voice consultation. Pure: the screen sends events, this says what is allowed.
 * In the prototype every event is simulated; a real version sends the same events from the
 * microphone, the transcription service and the audio player. No imports.
 */
export const VOICE_STATES = ["ready", "permission", "listening", "stopped", "transcribing", "review", "thinking", "speaking", "muted", "error", "ended"] as const;
export type VoiceState = (typeof VOICE_STATES)[number];
export type VoiceError = "mic_denied" | "transcription" | "reply";

export type VoiceModel = { state: VoiceState; permitted: boolean; transcript: string; error: VoiceError | null };

export type VoiceEvent =
  | { type: "START" | "ALLOW" | "DENY" | "STOP" | "TRANSCRIBE" | "TRANSCRIPTION_FAILED" | "CONFIRM" | "DISCARD" | "REPLY" | "FAIL" | "DONE" | "STOP_PLAYBACK" | "MUTE" | "UNMUTE" | "CANCEL" | "RETRY" | "END" | "RESTART" }
  | { type: "TRANSCRIBED" | "EDIT"; text: string };

export const initialVoice: VoiceModel = { state: "ready", permitted: false, transcript: "", error: null };

export function voiceReducer(m: VoiceModel, e: VoiceEvent): VoiceModel {
  const to = (state: VoiceState, more: Partial<VoiceModel> = {}): VoiceModel => ({ ...m, state, error: null, ...more });
  const fail = (error: VoiceError) => to("error", { error });
  const reset = () => to("ready", { transcript: "" });

  if (e.type === "END") return m.state === "ended" ? m : to("ended", { transcript: "" });

  switch (m.state) {
    case "ready":
      return e.type === "START" ? to(m.permitted ? "listening" : "permission", { transcript: "" }) : m;
    case "permission":
      if (e.type === "ALLOW") return to("listening", { permitted: true });
      if (e.type === "DENY") return fail("mic_denied");
      return e.type === "CANCEL" ? reset() : m;
    case "listening":
      if (e.type === "STOP") return to("stopped");
      return e.type === "CANCEL" ? reset() : m;
    case "stopped":
      if (e.type === "TRANSCRIBE") return to("transcribing");
      return e.type === "CANCEL" ? reset() : m;
    case "transcribing":
      if (e.type === "TRANSCRIBED") return to("review", { transcript: e.text });
      if (e.type === "TRANSCRIPTION_FAILED") return fail("transcription");
      return e.type === "CANCEL" ? reset() : m;
    case "review":
      if (e.type === "EDIT") return { ...m, transcript: e.text };
      if (e.type === "CONFIRM") return m.transcript.trim() ? to("thinking") : m;
      return e.type === "DISCARD" ? reset() : m;
    case "thinking":
      if (e.type === "REPLY") return to("speaking");
      if (e.type === "FAIL") return fail("reply");
      return e.type === "CANCEL" ? reset() : m;
    case "speaking":
    case "muted":
      if (e.type === "DONE" || e.type === "STOP_PLAYBACK") return reset();
      if (m.state === "speaking" && e.type === "MUTE") return to("muted");
      return m.state === "muted" && e.type === "UNMUTE" ? to("speaking") : m;
    case "error":
      // after a refusal the permission question is asked again
      return e.type === "RETRY" ? to("ready", { transcript: "", permitted: m.error === "mic_denied" ? false : m.permitted }) : m;
    case "ended":
      return e.type === "RESTART" ? reset() : m;
  }
}
