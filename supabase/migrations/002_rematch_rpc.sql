-- (senior_id, job_id) 쌍을 유일하게 — upsert ON CONFLICT 에 필요
ALTER TABLE matches
  ADD CONSTRAINT matches_senior_job_unique UNIQUE (senior_id, job_id);

-- ────────────────────────────────────────────────────────
-- rematch_senior : 시니어 1명 × 전체 일자리 점수 재계산
-- 점수 규칙: 지역 일치 +3 / 직종 일치 +2 / 경력 충족 +1
-- ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION rematch_senior(p_senior_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v seniors%ROWTYPE;
BEGIN
  SELECT * INTO v FROM seniors WHERE id = p_senior_id;
  IF NOT FOUND THEN RETURN; END IF;

  DELETE FROM matches
  WHERE senior_id = p_senior_id
    AND job_id NOT IN (
      SELECT j.id FROM jobs j
      WHERE (
        (CASE WHEN v.region      = j.region           THEN 3 ELSE 0 END) +
        (CASE WHEN v.desired_job = j.job_type          THEN 2 ELSE 0 END) +
        (CASE WHEN v.career_years >= j.required_career THEN 1 ELSE 0 END)
      ) > 0
    );

  INSERT INTO matches (senior_id, job_id, score, status)
  SELECT
    p_senior_id, j.id,
    (CASE WHEN v.region      = j.region           THEN 3 ELSE 0 END) +
    (CASE WHEN v.desired_job = j.job_type          THEN 2 ELSE 0 END) +
    (CASE WHEN v.career_years >= j.required_career THEN 1 ELSE 0 END),
    'pending'
  FROM jobs j
  WHERE (
    (CASE WHEN v.region      = j.region           THEN 3 ELSE 0 END) +
    (CASE WHEN v.desired_job = j.job_type          THEN 2 ELSE 0 END) +
    (CASE WHEN v.career_years >= j.required_career THEN 1 ELSE 0 END)
  ) > 0
  ON CONFLICT (senior_id, job_id) DO UPDATE SET score = EXCLUDED.score;
END;
$$;

-- ────────────────────────────────────────────────────────
-- rematch_job : 일자리 1개 × 전체 시니어 점수 재계산
-- ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION rematch_job(p_job_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v jobs%ROWTYPE;
BEGIN
  SELECT * INTO v FROM jobs WHERE id = p_job_id;
  IF NOT FOUND THEN RETURN; END IF;

  DELETE FROM matches
  WHERE job_id = p_job_id
    AND senior_id NOT IN (
      SELECT s.id FROM seniors s
      WHERE (
        (CASE WHEN s.region      = v.region           THEN 3 ELSE 0 END) +
        (CASE WHEN s.desired_job = v.job_type          THEN 2 ELSE 0 END) +
        (CASE WHEN s.career_years >= v.required_career THEN 1 ELSE 0 END)
      ) > 0
    );

  INSERT INTO matches (senior_id, job_id, score, status)
  SELECT
    s.id, p_job_id,
    (CASE WHEN s.region      = v.region           THEN 3 ELSE 0 END) +
    (CASE WHEN s.desired_job = v.job_type          THEN 2 ELSE 0 END) +
    (CASE WHEN s.career_years >= v.required_career THEN 1 ELSE 0 END),
    'pending'
  FROM seniors s
  WHERE (
    (CASE WHEN s.region      = v.region           THEN 3 ELSE 0 END) +
    (CASE WHEN s.desired_job = v.job_type          THEN 2 ELSE 0 END) +
    (CASE WHEN s.career_years >= v.required_career THEN 1 ELSE 0 END)
  ) > 0
  ON CONFLICT (senior_id, job_id) DO UPDATE SET score = EXCLUDED.score;
END;
$$;
