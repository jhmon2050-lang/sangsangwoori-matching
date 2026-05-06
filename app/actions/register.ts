'use server'

import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export type RegisterState = { error: string } | null

export async function registerSenior(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const name        = (formData.get('name') as string)?.trim()
  const region      = (formData.get('region') as string)?.trim()
  const desired_job = (formData.get('desired_job') as string)?.trim()
  const career_raw  = formData.get('career_years') as string
  const career_years = parseInt(career_raw, 10)

  if (!name || !region || !desired_job || isNaN(career_years) || career_years < 0) {
    return { error: '모든 항목을 빠짐없이 입력해 주세요.' }
  }

  // 1. 시니어 등록
  const { data: senior, error: seniorErr } = await supabase
    .from('seniors')
    .insert({ name, region, desired_job, career_years })
    .select()
    .single()

  if (seniorErr || !senior) {
    return { error: `등록 실패: ${seniorErr?.message ?? 'Supabase 연결을 확인해 주세요.'}` }
  }

  // 2. 전체 일자리 조회
  const { data: jobs } = await supabase.from('jobs').select('*')

  // 3. 규칙 기반 점수 계산
  //    지역 일치 +40 | 직종 일치 +40 | 경력 충족 +20
  const matchRows = (jobs ?? [])
    .map(job => {
      let score = 0
      if (senior.region      === job.region)      score += 40
      if (senior.desired_job === job.job_type)     score += 40
      if (senior.career_years >= job.required_career) score += 20
      return { senior_id: senior.id, job_id: job.id, score }
    })
    .filter(m => m.score > 0)

  // 4. 매칭 결과 저장
  if (matchRows.length > 0) {
    await supabase.from('matches').insert(matchRows)
  }

  redirect(`/recommendations?senior_id=${senior.id}`)
}
