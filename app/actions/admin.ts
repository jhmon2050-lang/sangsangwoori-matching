'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { normalizeRegion, normalizeJobType } from '@/lib/normalize'

export async function assignMatch(matchId: string) {
  const { error } = await supabase
    .from('matches')
    .update({ status: 'assigned' })
    .eq('id', matchId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}

export type AddJobState = {
  fieldErrors?: { title?: string; region?: string; job_type?: string }
  error?: string
  success?: true
} | null

export async function addJob(
  _prevState: AddJobState,
  formData: FormData,
): Promise<AddJobState> {
  const title               = (formData.get('title') as string)?.trim()
  const region              = (formData.get('region') as string)?.trim()
  const job_type            = (formData.get('job_type') as string)?.trim()
  const required_career_raw = formData.get('required_career') as string
  const required_career     = parseInt(required_career_raw, 10)

  const fieldErrors: { title?: string; region?: string; job_type?: string } = {}
  if (!title)    fieldErrors.title    = '공고명을 입력해 주세요.'
  if (!region)   fieldErrors.region   = '지역을 선택해 주세요.'
  if (!job_type) fieldErrors.job_type = '직종을 선택해 주세요.'
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors }

  const normRegion  = normalizeRegion(region)
  const normJobType = normalizeJobType(job_type)

  const { data: job, error: jobErr } = await supabase
    .from('jobs')
    .insert({ title, region: normRegion, job_type: normJobType, required_career: isNaN(required_career) ? 0 : required_career })
    .select('id')
    .single()

  if (jobErr || !job) return { error: `등록 실패: ${jobErr?.message}` }

  const { error: rpcErr } = await supabase.rpc('rematch_job', { p_job_id: job.id })
  if (rpcErr) return { error: `매칭 계산 실패: ${rpcErr.message}` }

  revalidatePath('/admin')
  return { success: true }
}

export async function deleteJob(jobId: string) {
  const { error } = await supabase.from('jobs').delete().eq('id', jobId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}
