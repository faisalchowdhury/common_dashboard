/**
 * Everything project-specific about this dashboard lives here.
 *
 * This is a design-only template — there is no backend. Pages render from
 * `src/mock/data.ts`, so the whole UI is visible the moment you run it.
 */

/** Shown in the sidebar wordmark, on the login screen and in the footer. */
export const APP_NAME = "Dashboard";

/** Sits under the wordmark. Keep it short — it renders in tracked-out caps. */
export const APP_TAGLINE = "Admin";

/** Footer line in the sidebar. */
export const APP_COPYRIGHT = APP_NAME;

/** Rows per page for every paginated list. */
export const PAGE_SIZE = 8;

/**
 * Latency the mock pages pretend to have, in ms. Keeps the loading skeletons
 * visible while you design them; set to 0 for instant renders.
 */
export const MOCK_DELAY = 500;
