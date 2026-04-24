-- ═══════════════════════════════════════════════════════════════════════
-- Migration 0003: Composite indexes for 100K+ employee scale
-- ═══════════════════════════════════════════════════════════════════════

-- HR dashboard: employee list filtered by property + active + role
create index if not exists employees_property_active_role_idx
  on public.employees(property_id, is_active, hotel_role);

-- HR dashboard: latest completed exams per employee
create index if not exists exam_sessions_employee_completed_idx
  on public.exam_sessions(employee_id, completed_at desc)
  where status = 'complete';

-- Scoring pipeline: find pending/processing recordings
create index if not exists speaking_recordings_scoring_created_idx
  on public.speaking_recordings(scoring_status, created_at)
  where scoring_status in ('pending', 'processing');

-- HR dashboard: employees by property + level (for level distribution charts)
create index if not exists employees_property_level_idx
  on public.employees(property_id, current_level)
  where is_active = true;
