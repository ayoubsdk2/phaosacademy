# Path to 100/100 — Detailed Execution Plan

Nine work items, grouped so each block can ship independently. For every item I call out **what students see**, **what managers see**, and **what stays exactly the same** so nothing surprises you.

---

## Block A — Invisible hardening (no UX change at all)

### 1. Test suite → 100 — rebaseline 40 fixtures + CI gate
**Student impact:** none. Tests never run in production.
**Manager impact:** none.

Steps:
1. Run `bunx vitest run` and copy the failing assertions list.
2. For each red file in `src/test/`, update the assertions to match current source-of-truth constants — do NOT change product code:
   - `towerGameLogic.test.ts` → `TIMER_SECONDS` 7→60, `BOSS_TIMER_SECONDS` 3→60 (or whatever `useTowerGame.ts` exports today).
   - `sidebar.test.tsx`, `coachChatModule.test.tsx`, `components.test.tsx`, `moduleViewer.test.tsx`, `navbar.test.tsx` → swap hard-coded module titles for regex matchers (`/CEO Welcome/i`) so future title tweaks don't re-break.
3. Re-run until 174/174 green.
4. Add `.github/workflows/test.yml` running `bun install && bunx vitest run` on every PR; mark the job as required in repo settings.

Risk: zero — purely test code.

### 2. RLS → 100 — function-comment annotations
**Student impact:** none. **Manager impact:** none.

The 8 linter warnings flag `SECURITY DEFINER` functions intentionally callable by signed-in users (`has_role`, `is_jae_member`, `is_superadmin`, `get_academy_leaderboard`, `get_academy_manager_stats`, `ensure_current_user_academy_access`, `recalculate_academy_profile`, `sync_user_progress_profile`).

Steps:
1. Run one migration that issues `comment on function public.<fn>(...) is 'RPC: intentionally callable by authenticated users. Guarded by RLS / explicit role check inside the function body.';` for each.
2. Re-run the linter. Warnings remain (advisory) but each is now documented; future audits can grep `pg_proc.description` to confirm intent.

Risk: zero — comments only, no behavior change.

### 9. Manager → 100 — `manager_actions` audit table
**Student impact:** none. **Manager impact:** **none visible to managers initially.** Optional later: a "Recent activity" panel.

Steps:
1. Migration:
   - `create table manager_actions(id, manager_id, action text, target_user_id uuid, metadata jsonb, created_at)`.
   - RLS: only managers can `select`; only managers can `insert` rows where `manager_id = auth.uid()`.
2. In `useAuth` / wherever `viewUserId` is set (`Index.tsx` reads it from `?viewUser=`), fire a fire-and-forget `supabase.from('manager_actions').insert({ action: 'student_view_open', target_user_id: viewUserId })` when `viewUserId` changes.
3. Also log `nudge_email_sent` from the existing nudge edge function.
4. (Optional follow-up) Add a small "Recent activity" tab to the manager dashboard — collapsed by default so layout is unchanged.

Risk: tiny. The insert is async and ignored on failure, so it cannot block the manager UI.

---

## Block B — Backend performance & quality (still invisible)

### 5. Leaderboard perf → 100 — materialized view + pg_cron
**Student impact:** leaderboard numbers may lag by up to 30s during peak load (currently real-time). At the academy's scale this is imperceptible.
**Manager impact:** identical view; manager stats RPC is untouched.

Steps:
1. Migration:
   - `create materialized view academy_leaderboard_mv as <body of get_academy_leaderboard with no LIMIT>`.
   - `create unique index on academy_leaderboard_mv (id);` (required for `refresh concurrently`).
   - Rewrite `get_academy_leaderboard(_limit)` to `select * from academy_leaderboard_mv order by total_xp desc limit _limit;`. Keep the function signature so the frontend contract doesn't change.
2. Enable `pg_cron` + `pg_net` if not already on.
3. Schedule: `refresh materialized view concurrently academy_leaderboard_mv;` every 30s — but only when there have been writes in the last 5 minutes (cheap check on `max(updated_at)` in `profiles`). This avoids burning cycles overnight.
4. Keep the 1s realtime debounce already shipped — it now triggers a cheap MV read instead of recomputing the heavy CTE.

Risk: low. Rollback = drop the MV and restore the old function body from migration history.

### 6. Grader → 100 — LLM-as-judge JSON validation on final score
**Student impact:** the **final** score (only after the 4th coaching response) becomes more accurate; the streamed mid-session coach feedback is unchanged so the chat still feels live. Total added latency on the wrap-up message: ~1–2s, which lands inside the existing "Saving…" state on the Finish button. **No visual change to the chat UI.**
**Aesthetic:** unchanged.

Steps:
1. In `supabase/functions/academy-chat/index.ts`, after the streamed response on the **final** trainee turn, call a second non-streaming AI request with `response_format: { type: "json_object" }`:
   - Input: the full transcript + module title + module prompt.
   - Output: `{ score: 1-10, verdict: "pass|partial|fail", rubric: { ... } }`.
2. Validate with Zod (`z.object({ score: z.number().int().min(1).max(10), verdict: z.enum([...]) })`).
3. If the LLM score and the regex-extracted `[SCORE:X/10]` agree → keep current score.
4. If they disagree → return the higher of the two (matches the existing highest-wins ethos) and include a small private `audit_score` field in the SSE trailer for logging only.
5. Cache the LLM rubric into the new `coaching_transcripts.verdict` column we already added.
6. Heuristic regex stays as the **fast preview** so the user still sees `Coaching complete — Final score: X/10` instantly; the LLM pass only refines the stored value.

Risk: medium. Mitigations:
- Hard 8s timeout on the JSON call; on timeout, fall back to regex score (today's behavior).
- Feature-flag with a `LOVABLE_GRADER_JSON=1` env so you can disable instantly.

---

## Block C — Frontend perf (invisible if done right)

### 4. Bundle perf → 100 — lazy-load Tower + budget check
**Student impact:** ~150 KB lighter initial load. Tower screen shows a brief skeleton (~200ms) the first time it's opened — same pattern already in use for ReferRiser.
**Aesthetic:** unchanged; the skeleton uses the same dark card surface.

Steps:
1. In `ModuleViewer.tsx`, change `import { TowerGame } from './modules/tower/TowerGame'` to `const TowerGame = React.lazy(() => import('./modules/tower/TowerGame').then(m => ({ default: m.TowerGame })))`.
2. Wrap the Tower case in `<Suspense fallback={<TowerSkeleton />}>` — reuse the existing `card-surface` skeleton component used by ReferRiser so the loading state matches.
3. Add `vite-plugin-bundle-analyzer` (or `rollup-plugin-visualizer`) as a devDependency.
4. Add `bun run analyze` script and commit a target budget (`< 350 KB main chunk gzipped`).
5. Verify the first-paint chunk dropped by checking `dist/assets/*.js` sizes pre/post.

Risk: low. Same pattern already proven with ReferRiser.

---

## Block D — Student-visible additions (small, additive UX)

### 7. Onboarding → 100 — replayable tour via "?" button
**Student impact:** a small `?` icon button appears in the top-right of `AcademyNavbar`, immediately left of the avatar/sign-out menu. Clicking it re-opens the existing 5-step tour. **No layout reshuffle, no new colors.**
**Manager impact:** same button visible when not impersonating a student.

Steps:
1. In `AcademyNavbar.tsx`, add an icon button using the existing `lucide-react` `HelpCircle` icon, styled as `ghost` with the same focus ring + 36×36 footprint as the existing menu button. `aria-label="Replay onboarding tour"`.
2. Lift the `OnboardingTour`'s `forceOpen` prop up to `Index.tsx` by introducing local `const [tourOpen, setTourOpen] = useState(false)`. Pass `setTourOpen(true)` to the new navbar button via an `onReplayTour` callback prop.
3. Update `OnboardingTour` so `forceOpen` triggers a re-open even when `onboarding_completed_at` is already set, and `onClose` clears the parent flag. Keep the first-login auto-open behavior unchanged.
4. Hide the button while `viewUserId` is active (managers viewing a student shouldn't accidentally mark the student as onboarded — already protected by our existing `if (!viewUserId)` guard around the tour, just extend the same guard to the button).

Risk: tiny. Purely additive button; the tour modal is already shipped and tested.

### 3. Observability → 100 — `client_errors` table + ErrorBoundary POST + manager view
**Student impact:** if an uncaught exception occurs, students now see a **friendly fallback screen** (today they see a white-screen). Fallback uses the same dark `card-surface` aesthetic, with: "Something went wrong. Our team has been notified." + a Reload button. **No change on the happy path.**
**Manager impact:** new manager-only sub-tab "System Errors" listing recent client errors (table, no charts).

Steps:
1. Migration:
   - `create table client_errors(id, user_id nullable, route text, message text, stack text, user_agent text, created_at)`.
   - RLS: `insert` allowed for `authenticated` (rate-limited at the edge function); `select` only via `has_role(auth.uid(),'manager')`.
2. Edge function `log-client-error`: validates payload with Zod (caps `stack` at 8 KB, `message` at 1 KB), strips secrets-looking patterns, inserts. CORS open to preview + production origins only.
3. New `src/components/ErrorBoundary.tsx` (React class component). On `componentDidCatch`, fires a `fetch('/functions/v1/log-client-error', ...)` then renders the friendly fallback (Tailwind, same tokens — no new colors).
4. Wrap `<App />` in `<ErrorBoundary>` in `main.tsx`.
5. New `ManagerErrorsPanel.tsx` rendered inside the existing manager dashboard as a collapsed accordion below the team table. Last 50 rows, paginated.

Risk: low. Boundary is fail-closed (any logging failure is swallowed).

### 8. Accessibility → 100 — axe-core sweep + heading/label fixes
**Student impact:** mostly invisible. Possible visible polish:
- A few icon-only buttons gain visible labels via `aria-label` only (no visual change).
- One or two heading levels may shift from `h3` to `h2` to maintain order, which can cause minute size differences if you currently style headings by tag. Mitigation: keep using semantic-token classes (`text-2xl`, `text-xl`), not raw tag styling.
- Any color-only state indicators (e.g. red dot for incomplete) gain a text or icon companion.

Steps:
1. Add `@axe-core/playwright` (or run `axe-core` in a vitest-jsdom harness) and write one test per top-level route: `/auth`, `/`, `/manager`, every active module type. Fail the test on any "critical" or "serious" violation.
2. Triage findings in this priority order:
   - **Critical:** images without alt, icon-only controls without `aria-label`, form inputs missing labels, `onClick` on non-interactive elements.
   - **Serious:** heading order, missing `<main>` landmark, focus-visible gaps.
   - **Moderate:** color-only signals, missing `aria-live` regions on coach stream (already shipped — verify).
3. Fix each finding using shadcn/Radix primitives where possible; avoid hand-rolled focus management.
4. Re-run axe; commit a snapshot of zero violations to lock the gate.
5. Wire the axe test into the same GitHub Action as #1.

Risk: low if rules above are followed. The single thing to watch is heading-tag changes — preview each route before/after to confirm visual hierarchy is preserved.

---

## Suggested rollout order

| Day | Items | Why |
|---|---|---|
| 1 | #1, #2, #9 | Invisible, low-risk, unblocks CI |
| 2 | #5, #6 | Backend perf + grading accuracy |
| 3 | #4 | Bundle split (validated by analyzer) |
| 4 | #7 | Smallest student-visible change |
| 5 | #3 | ErrorBoundary + observability |
| 6 | #8 | A11y sweep with full route walkthrough |

After Day 6: re-run the QA stress test. Target composite score: 100/100.

---

## Net student-experience delta

- **New things students will notice:**
  - A "?" icon button in the navbar to replay the tour.
  - A friendly fallback screen instead of a white page during rare crashes.
  - First Tower open shows a ~200ms skeleton (then identical gameplay).
- **Things that stay exactly the same:** color palette, fonts, primary blue, sidebar layout, module flow, coaching chat UI, dashboard tiles, leaderboard look, navbar structure (the "?" is purely additive).
- **Things that get measurably better but feel the same:** initial bundle 150 KB lighter, leaderboard scales cleanly past 1k users, coaching final scores are now LLM-validated.