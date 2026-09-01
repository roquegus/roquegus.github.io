-- Order workflow: status tracking + shareable proof links
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS proof_token UUID NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS proof_response TEXT,
  ADD COLUMN IF NOT EXISTS proof_response_note TEXT;

-- Let authenticated users update status on their own projects
-- (covered by existing RLS policy)

-- RPC: load a project by proof_token (no auth required)
CREATE OR REPLACE FUNCTION get_project_by_proof_token(token UUID)
RETURNS SETOF projects
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY SELECT * FROM projects WHERE proof_token = token LIMIT 1;
END;
$$;

GRANT EXECUTE ON FUNCTION get_project_by_proof_token TO anon;
GRANT EXECUTE ON FUNCTION get_project_by_proof_token TO authenticated;

-- RPC: customer submits a proof response (no auth required)
CREATE OR REPLACE FUNCTION submit_proof_response(
  p_token UUID,
  p_response TEXT,
  p_note TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE projects
  SET
    proof_response      = p_response,
    proof_response_note = p_note,
    status              = CASE
                            WHEN p_response = 'approved' THEN 'approved'
                            ELSE status
                          END,
    updated_at          = NOW()
  WHERE proof_token = p_token;
END;
$$;

GRANT EXECUTE ON FUNCTION submit_proof_response TO anon;
GRANT EXECUTE ON FUNCTION submit_proof_response TO authenticated;
