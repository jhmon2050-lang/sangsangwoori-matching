'use server'

import { supabase } from '@/lib/supabase'
import { normalizeRegion, normalizeJobType } from '@/lib/normalize'

export type RegisterState = {
  fieldErrors?: { name?: string; region?: string; desired_job?: string }
  error?: string
  success?: true
} | null

export async function registerSenior(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const name        = (formData.get('name') as string)?.trim()
  const region      = (formData.get('region') as string)?.trim()
  const desired_job = (formData.get('desired_job') as string)?.trim()
  const career_raw  = formData.get('career_years') as string
  const career_years = parseInt(career_raw, 10)

  const fieldErrors: { name?: string; region?: string; desired_job?: string } = {}
  if (!name)        fieldErrors.name        = '이름을 입력해 주세요.'
  if (!region)      fieldErrors.region      = '지역을 선택해 주세요.'
  if (!desired_job) fieldErrors.desired_job = '희망 직종을 선택해 주세요.'
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors }

  const normRegion = normalizeRegion(region)
  const normJob    = normalizeJobType(desired_job)

  const { data: senior, error: seniorErr } = await supabase
    .from('seniors')
    .insert({ name, region: normRegion, desired_job: normJob, career_years: isNaN(career_years) ? 0 : career_years })
    .select('id')
    .single()

  if (seniorErr || !senior) {
    return { error: `등록 실패: ${seniorErr?.message ?? 'Supabase 연결을 확인해 주세요.'}` }
  }

  // Supabase RPC로 자동 매칭 (지역+3 / 직종+2 / 경력+1)
  const { error: rpcErr } = await supabase.rpc('rematch_senior', { p_senior_id: senior.id })
  if (rpcErr) {
    return { error: `매칭 계산 실패: ${rpcErr.message}` }
  }

  return { success: true }
}
