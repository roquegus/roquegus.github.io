-- Design picker (callenueve.com/design) sends the chosen colors, logo and box
-- name with the request. Applied 2026-09-24 (migration "inquiries_design_column").
alter table public.inquiries add column if not exists design jsonb;
