/**
 * Sample data for the design template.
 *
 * Nothing here talks to a server. Every page imports from this file so the
 * whole dashboard renders — populated, paginated and filterable — with no
 * backend running. When you wire the real thing up, replace the `load*`
 * functions below with API calls and delete the arrays; the pages call them
 * exactly as they would call a client.
 */

import { MOCK_DELAY, PAGE_SIZE } from "../config/app";
import type {
  AdminUser,
  ActivityItem,
  OverviewStats,
  Pagination,
  PlatformUser,
  SettingsPageKey,
} from "../types";

/** Pretends to be a network round-trip so loading states stay designable. */
const delay = <T>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY));

/** Relative ISO timestamp, so "3 days ago" stays true whenever you run it. */
const daysAgo = (days: number) =>
  new Date(Date.now() - days * 86_400_000).toISOString();

/* ── The signed-in admin ───────────────────────────────────────────── */

export const DEMO_ADMIN: AdminUser = {
  _id: "admin-1",
  name: "Alex Morgan",
  email: "alex@example.com",
  role: "admin",
  phone: "+1 555 0134",
  address: "42 Prospect Street, Springfield",
  profilePicture: null,
  isVerified: true,
  createdAt: daysAgo(420),
};

/* ── Users ─────────────────────────────────────────────────────────── */

const NAMES = [
  "Priya Raman", "Daniel Okafor", "Sofia Bianchi", "Marcus Lee",
  "Hana Kobayashi", "Yusuf Demir", "Clara Nowak", "Tomas Silva",
  "Amara Nwosu", "Lena Fischer", "Omar Haddad", "Grace Mensah",
  "Viktor Petrov", "Ines Duarte", "Noah Bergman", "Zara Ahmed",
  "Felix Wagner", "Maya Sharma", "Ruben Castillo", "Anouk Visser",
  "Kofi Boateng", "Elena Rossi", "Jonas Lindqvist",
];

export const USERS: PlatformUser[] = NAMES.map((name, i) => {
  const handle = name.toLowerCase().replace(/[^a-z]+/g, ".");
  return {
    _id: `user-${i + 1}`,
    name,
    email: `${handle}@example.com`,
    phone: i % 3 === 0 ? null : `+1 555 0${(100 + i).toString().padStart(3, "0")}`,
    address: null,
    role: i < 2 ? "admin" : "user",
    profilePicture: null,
    isVerified: i % 4 !== 0,
    isBlocked: i === 5 || i === 14,
    createdAt: daysAgo(i * 9 + 2),
  };
});

/* ── Overview ──────────────────────────────────────────────────────── */

const RECENT: ActivityItem[] = [
  {
    id: "a1",
    title: "Priya Raman",
    subtitle: "Submitted a new request · Springfield",
    status: "New",
    tone: "accent",
    at: daysAgo(0.02),
  },
  {
    id: "a2",
    title: "Daniel Okafor",
    subtitle: "Moved to review · assigned to Alex",
    status: "In review",
    tone: "info",
    at: daysAgo(0.3),
  },
  {
    id: "a3",
    title: "Sofia Bianchi",
    subtitle: "Approved · confirmation sent",
    status: "Approved",
    tone: "success",
    at: daysAgo(1.4),
  },
  {
    id: "a4",
    title: "Marcus Lee",
    subtitle: "Awaiting documents · reminder due",
    status: "Pending",
    tone: "warning",
    at: daysAgo(2.8),
  },
  {
    id: "a5",
    title: "Hana Kobayashi",
    subtitle: "Archived · no response after 30 days",
    status: "Closed",
    tone: "neutral",
    at: daysAgo(6),
  },
];

export const OVERVIEW: OverviewStats = {
  total: 1284,
  active: 342,
  newThisWeek: 57,
  growth: "+12.4%",
  breakdown: [
    { label: "New", count: 148, tone: "accent" },
    { label: "In review", count: 194, tone: "info" },
    { label: "Approved", count: 806, tone: "success" },
    { label: "Closed", count: 136, tone: "neutral" },
  ],
  recent: RECENT,
};

/* ── Content pages ─────────────────────────────────────────────────── */

export const CONTENT_PAGES: Record<SettingsPageKey, string> = {
  privacy: `<h2>Privacy Policy</h2>
<p>We collect only what we need to run this service, and we never sell it. This page is placeholder copy so the editor and its preview have something to render.</p>
<h3>What we collect</h3>
<ul>
  <li>Account details you give us — name, email, phone.</li>
  <li>Usage data, so we know which features earn their place.</li>
</ul>
<p>Questions? Write to <a href="#">privacy@example.com</a>.</p>`,

  terms: `<h2>Terms &amp; Conditions</h2>
<p>By using this service you agree to the terms below. Replace this copy with your own before launch.</p>
<h3>Your account</h3>
<p>You are responsible for keeping your credentials safe and for everything done under your account.</p>
<ol>
  <li>One account per person.</li>
  <li>No automated scraping.</li>
  <li>We may suspend accounts that abuse the service.</li>
</ol>`,

  about: `<h2>About Us</h2>
<p>A short introduction to the company, the team and what the product sets out to do. <strong>Keep it human</strong> — this is usually the second page a visitor opens.</p>
<p>Founded in 2019, we work with teams who would rather ship than sit in meetings about shipping.</p>`,
};

/* ── Loaders (swap these for real API calls) ───────────────────────── */

export const loadOverview = (): Promise<OverviewStats> => delay(OVERVIEW);

export interface UserQuery {
  page?: number;
  search?: string;
  role?: string;
}

export interface UserPage {
  users: PlatformUser[];
  pagination: Pagination;
}

/**
 * Search, filter and paginate in memory. A real backend does this server-side;
 * doing it here keeps every control on the page live while you design it.
 */
export function loadUsers({ page = 1, search = "", role = "" }: UserQuery): Promise<UserPage> {
  const term = search.trim().toLowerCase();

  const filtered = USERS.filter((user) => {
    if (role && user.role !== role) return false;
    if (!term) return true;
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      (user.phone ?? "").toLowerCase().includes(term)
    );
  });

  const totalPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), totalPage);
  const start = (current - 1) * PAGE_SIZE;

  return delay({
    users: filtered.slice(start, start + PAGE_SIZE),
    pagination: {
      currentPage: current,
      totalPage,
      prevPage: current > 1 ? current - 1 : null,
      nextPage: current < totalPage ? current + 1 : null,
      limit: PAGE_SIZE,
      totalItem: filtered.length,
    },
  });
}

export const loadContentPage = (key: SettingsPageKey): Promise<string> =>
  delay(CONTENT_PAGES[key]);
