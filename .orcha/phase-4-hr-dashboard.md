# Phase 4 — HR Dashboard

**Status:** 🟡 Not started

## Scope
The HR-facing product. This is the surface that sells the subscription renewal — it has to feel like a real business tool, not a student portal.

## Routes
- `/hr/login` — Supabase Auth (email + password, magic link fallback).
- `/hr` — overview (registered vs evaluated, level distribution, weekly active, department breakdown).
- `/hr/employees` — sortable/filterable table (name, role, level, listening %, speaking %, last active).
- `/hr/employees/[id]` — per-employee detail: exam breakdown, speaking transcripts + AI feedback, practice history, weekly chart, focus areas.
- `/hr/cohorts` — create/track/compare cohorts.
- `/hr/reports` — generate PDF (jsPDF) and Excel (SheetJS) exports.

## PDF structure (bible §8)
1. Cover — logo, hotel name, date range.
2. Executive summary — level distribution, average score, key finding, recommendation.
3. Level distribution — bar chart by department.
4–N. Employee results table — strengths + areas to improve.
Last page — methodology.

## Permissions (RLS-driven)
- `super_admin` — sees all orgs.
- `org_admin` — sees all properties within their org.
- `property_admin` — only their property.
- `viewer` — read-only, same scope as property_admin.

## Design application
- Apply the editorial design system faithfully in institutional contexts: tables with hairline dividers, monospace numerics, serif page headings, ink accent used sparingly (one moment per view). This is a GM reading a report, not a consumer app. No new accent colors — see `.orcha/design-system.md` principle 03.

## Acceptance criteria
- [ ] PDF report is identical whether generated via UI or API.
- [ ] Excel export includes every column the table shows, plus raw scores.
- [ ] Cohort progress bar matches `cohort_members.completion_pct` aggregates.
- [ ] Weekly email digest (Resend) delivers every Monday 08:00 hotel-local.
