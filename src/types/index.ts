/**
 * Shapes shared across the dashboard.
 *
 * These describe the data the UI draws. They are not tied to any API — the
 * mock layer in `src/mock/data.ts` produces them today.
 */

/* ── Pagination ────────────────────────────────────────────────────── */

export interface Pagination {
  totalPage?: number;
  currentPage?: number;
  prevPage: number | null;
  nextPage: number | null;
  limit?: number;
  totalItem?: number;
}

/* ── People ────────────────────────────────────────────────────────── */

/** The signed-in administrator. */
export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  address?: string | null;
  profilePicture?: string | null;
  isVerified?: boolean;
  createdAt?: string;
}

/** A row in the Users table. */
export interface PlatformUser {
  _id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  role: string;
  profilePicture?: string | null;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
}

/* ── Content pages ─────────────────────────────────────────────────── */

export type SettingsPageKey = "privacy" | "terms" | "about";

/* ── Overview ──────────────────────────────────────────────────────── */

export interface OverviewStats {
  total: number;
  active: number;
  newThisWeek: number;
  growth: string;
  /** Share of the total per status, for the breakdown row. */
  breakdown: { label: string; count: number; tone: StatusTone }[];
  recent: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  tone: StatusTone;
  /** ISO timestamp — rendered as "3 days ago". */
  at: string;
}

/* ── UI ────────────────────────────────────────────────────────────── */

/**
 * Visual tone for <StatusBadge>. Domain statuses map onto these rather than
 * the badge knowing about any one project's vocabulary.
 */
export type StatusTone = "accent" | "info" | "success" | "warning" | "neutral";
