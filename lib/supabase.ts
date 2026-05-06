import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Senior = {
  id: string;
  name: string;
  region: string;
  desired_job: string;
  career_years: number;
};

export type Job = {
  id: string;
  title: string;
  region: string;
  job_type: string;
  required_career: number;
};

export type Match = {
  id: string;
  senior_id: string;
  job_id: string;
  score: number;
};
