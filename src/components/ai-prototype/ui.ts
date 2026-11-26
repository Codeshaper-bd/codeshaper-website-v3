/**
 * The canvas's few shared styles, so every component looks like part of one conversation.
 * Flat by default: information sits on the background; a surface only where something is filled in
 * or confirmed; shadow only on the message box and on things that float. Controls are compact with
 * a pointer and at least 44px high on phones and touch screens.
 */
const CONTROL = "inline-flex h-9 items-center justify-center gap-1.5 rounded-[9px] font-urbanist text-[13.5px] font-semibold transition-colors max-sm:h-11 pointer-coarse:h-11 disabled:cursor-not-allowed disabled:opacity-45";

/** One per component: the action that moves it forward. */
export const PRIMARY = `${CONTROL} bg-content px-3.5 text-surface hover:bg-[#262b3a]`;
export const SECONDARY = `${CONTROL} border border-border-strong bg-surface px-3.5 text-content hover:bg-surface-soft`;
export const GHOST = `${CONTROL} px-2.5 text-content hover:bg-content/[0.05]`;
/** A quiet way elsewhere, next to a primary action. */
export const LINK = `${CONTROL} px-1.5 font-medium text-content-muted underline decoration-border-strong underline-offset-4 hover:text-content`;
export const ICON = "grid h-9 w-9 shrink-0 place-items-center rounded-[9px] text-content-muted transition-colors hover:bg-content/[0.05] hover:text-content max-sm:h-11 max-sm:w-11 pointer-coarse:h-11 pointer-coarse:w-11";
export const CHIP = `${CONTROL} h-8 border border-content/10 bg-surface/70 px-3 text-left font-medium text-content hover:border-brand/40 hover:bg-surface`;

/** 16px on phones, so a focused field does not zoom the page. */
export const FIELD = "mt-1 block h-10 w-full rounded-[9px] border border-border-strong bg-surface px-3 text-[14.5px] font-normal text-content aria-[invalid=true]:border-danger max-sm:h-11 max-sm:text-[16px] pointer-coarse:h-11";
export const AREA = `${FIELD} !h-auto min-h-16 py-2 leading-relaxed max-sm:!h-auto pointer-coarse:!h-auto`;
export const FIELD_LABEL = "block text-[12.5px] font-medium text-content";

/** Only where something is filled in, checked or confirmed. */
export const SURFACE = "max-w-[600px] scroll-mt-4 rounded-[14px] border border-content/[0.08] bg-surface/90 p-3.5 sm:p-4";

export const BODY = "text-[15.5px] leading-[1.65] text-content";
export const TITLE = "font-urbanist text-[15.5px] font-bold leading-snug text-content";
export const META = "text-[12.5px] text-content-muted";
