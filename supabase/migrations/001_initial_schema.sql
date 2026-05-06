-- 상상우리 매칭 시스템 초기 스키마
-- 학습 환경 전용: RLS 비활성화 상태로 운영

CREATE TABLE IF NOT EXISTS seniors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  region text NOT NULL,
  desired_job text NOT NULL,
  career_years integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS jobs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  region text NOT NULL,
  job_type text NOT NULL,
  required_career integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS matches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  senior_id uuid REFERENCES seniors(id) ON DELETE CASCADE,
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- RLS 비활성화 (학습 환경 전용 — 실서비스 전 반드시 정책 재설계)
ALTER TABLE seniors DISABLE ROW LEVEL SECURITY;
ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE matches DISABLE ROW LEVEL SECURITY;
