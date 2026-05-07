import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// playwright.config.ts가 이미 .env.local을 process.env에 로드하지만
// 워커 환경 보장을 위해 여기서도 직접 읽음
function loadEnv() {
  try {
    const envPath = path.join(process.cwd(), '.env.local')
    fs.readFileSync(envPath, 'utf-8')
      .split('\n')
      .forEach(line => {
        const eq = line.indexOf('=')
        if (eq > 0 && !line.startsWith('#')) {
          const key = line.slice(0, eq).trim()
          const val = line.slice(eq + 1).trim()
          if (key && !process.env[key]) process.env[key] = val
        }
      })
  } catch { /* ignore */ }
}
loadEnv()

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const db   = createClient(url, key)

type JobInput = {
  title: string
  region: string
  job_type: string
  required_career: number
}

/** 테스트 전 DB를 깨끗한 상태로 초기화 */
export async function resetDB(): Promise<void> {
  // CASCADE 대신 명시적 순서로 삭제
  await db.from('matches').delete().not('id', 'is', null)
  await db.from('seniors').delete().not('id', 'is', null)
  await db.from('jobs').delete().not('id', 'is', null)
}

/** 테스트용 일자리 1건 삽입 */
export async function insertJob(job: JobInput): Promise<string> {
  const { data, error } = await db
    .from('jobs')
    .insert(job)
    .select('id')
    .single()
  if (error || !data) throw new Error(`insertJob 실패: ${error?.message}`)
  return data.id as string
}

/** 이름으로 시니어 ID 조회 (등록 직후 단 1건 존재 보장) */
export async function getSeniorIdByName(name: string): Promise<string> {
  const { data, error } = await db
    .from('seniors')
    .select('id')
    .eq('name', name)
    .single()
  if (error || !data) throw new Error(`시니어 조회 실패: ${error?.message}`)
  return data.id as string
}

/** seniors 테이블 행 수 반환 */
export async function countSeniors(): Promise<number> {
  const { count, error } = await db
    .from('seniors')
    .select('*', { count: 'exact', head: true })
  if (error) throw new Error(`countSeniors 실패: ${error.message}`)
  return count ?? 0
}
