import type { StatusTone } from "../types";

/**
 * A pill for a record's state.
 *
 * The badge stays domain-agnostic: it renders whatever label you give it in
 * one of five tones. Map your own statuses to a tone at the call site, e.g.
 *
 *   const TONES: Record<OrderStatus, StatusTone> = {
 *     Pending: "accent", Shipped: "info", Delivered: "success", Cancelled: "neutral",
 *   };
 *   <StatusBadge label={order.status} tone={TONES[order.status]} />
 */
const TONE_CLASSES: Record<StatusTone, string> = {
  accent: "bg-luxury-gold/15 text-luxury-gold border-luxury-gold/30",
  info: "bg-blue-400/10 text-blue-300 border-blue-400/25",
  success: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
  warning: "bg-amber-500/10 text-amber-300 border-amber-500/25",
  neutral: "bg-white/5 text-white/35 border-white/10",
};

export default function StatusBadge({
  label,
  tone = "neutral",
  size = "sm",
}: {
  label: string;
  tone?: StatusTone;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border font-sans font-semibold uppercase tracking-widest whitespace-nowrap ${
        size === "md" ? "px-3.5 py-1.5 text-[11px]" : "px-2.5 py-1 text-[9px]"
      } ${TONE_CLASSES[tone] ?? TONE_CLASSES.neutral}`}
    >
      {label}
    </span>
  );
}
