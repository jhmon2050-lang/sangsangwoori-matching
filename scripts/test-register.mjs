import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://uppmwjlpsaztmaflutyk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwcG13amxwc2F6dG1hZmx1dHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMzAzMzYsImV4cCI6MjA5MzYwNjMzNn0.7JBdXr9XHxtVsr7noYAvSlBn_eH6h_4NeZxedp_uqD4'
)

// 테스트 시니어 3명 (다양한 조건)
const testSeniors = [
  { name: '김상상', region: '서울', desired_job: '경비·보안', career_years: 10 },
  { name: '이우리', region: '경기', desired_job: '조리·식품', career_years: 3 },
  { name: '박시니어', region: '부산', desired_job: '판매·영업', career_years: 0 },
]

console.log('=== 상상우리 매칭 시스템 테스트 ===\n')

for (const seniorData of testSeniors) {
  // 1. 시니어 등록
  const { data: senior, error: sErr } = await supabase
    .from('seniors').insert(seniorData).select().single()
  if (sErr) { console.error('❌ 시니어 등록 실패:', sErr.message); continue }

  // 2. 전체 jobs 조회
  const { data: jobs } = await supabase.from('jobs').select('*')

  // 3. 규칙 기반 점수 계산 (지역+40 / 직종+40 / 경력충족+20)
  const matchRows = (jobs ?? []).map(job => {
    let score = 0
    if (senior.region      === job.region)           score += 40
    if (senior.desired_job === job.job_type)          score += 40
    if (senior.career_years >= job.required_career)   score += 20
    return { senior_id: senior.id, job_id: job.id, score }
  }).filter(m => m.score > 0)

  // 4. matches 저장
  if (matchRows.length > 0) {
    await supabase.from('matches').insert(matchRows)
  }

  // 5. 결과 조회 (score 내림차순 상위 3개)
  const { data: results } = await supabase
    .from('matches')
    .select('score, jobs(title, region, job_type)')
    .eq('senior_id', senior.id)
    .order('score', { ascending: false })
    .limit(3)

  console.log(`👤 ${senior.name} (${senior.region} / ${senior.desired_job} / 경력 ${senior.career_years}년)`)
  console.log(`   매칭 결과 ${matchRows.length}건 → 상위 3개:`)
  for (const r of results ?? []) {
    const j = r.jobs
    console.log(`   ${r.score}점  ${j.title} (${j.region} · ${j.job_type})`)
  }
  console.log()
}

// 최종 현황
const { count: sc } = await supabase.from('seniors').select('*', { count: 'exact', head: true })
const { count: mc } = await supabase.from('matches').select('*', { count: 'exact', head: true })
console.log(`=== DB 최종 현황 ===`)
console.log(`seniors : ${sc}명 / matches : ${mc}건`)
