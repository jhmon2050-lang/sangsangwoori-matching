import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://uppmwjlpsaztmaflutyk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwcG13amxwc2F6dG1hZmx1dHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMzAzMzYsImV4cCI6MjA5MzYwNjMzNn0.7JBdXr9XHxtVsr7noYAvSlBn_eH6h_4NeZxedp_uqD4'
)

const jobs = [
  { title: '아파트 단지 경비원',    region: '서울', job_type: '경비·보안', required_career: 0 },
  { title: '편의점 야간 경비',      region: '경기', job_type: '경비·보안', required_career: 0 },
  { title: '고속도로 순찰 경비',    region: '부산', job_type: '경비·보안', required_career: 3 },
  { title: '학교 급식 조리보조',    region: '경기', job_type: '조리·식품', required_career: 0 },
  { title: '호텔 주방 보조',        region: '부산', job_type: '조리·식품', required_career: 2 },
  { title: '구청 민원 안내 도우미', region: '서울', job_type: '사무·행정', required_career: 3 },
  { title: '복지관 행정 보조',      region: '인천', job_type: '사무·행정', required_career: 1 },
  { title: '택배 집하 운전',        region: '경기', job_type: '운전·배달', required_career: 2 },
  { title: '마트 시니어 판매원',    region: '서울', job_type: '판매·영업', required_career: 0 },
  { title: '재래시장 판매 도우미',  region: '부산', job_type: '판매·영업', required_career: 0 },
  { title: '노인복지관 돌봄 도우미',region: '서울', job_type: '복지·돌봄', required_career: 0 },
  { title: '장애인 활동 보조',      region: '인천', job_type: '복지·돌봄', required_career: 1 },
  { title: '문화센터 강사 보조',    region: '서울', job_type: '교육·강사', required_career: 3 },
  { title: '공장 포장 작업원',      region: '경기', job_type: '제조·생산', required_career: 0 },
  { title: '농산물 선별 작업원',    region: '경북', job_type: '농업·임업', required_career: 0 },
]

// 기존 데이터 전체 삭제 후 재삽입 (멱등 실행)
await supabase.from('matches').delete().neq('id', '00000000-0000-0000-0000-000000000000')
await supabase.from('seniors').delete().neq('id', '00000000-0000-0000-0000-000000000000')
await supabase.from('jobs').delete().neq('id', '00000000-0000-0000-0000-000000000000')

const { error } = await supabase.from('jobs').insert(jobs)
if (error) { console.error('❌ 오류:', error.message); process.exit(1) }

const { count: jc } = await supabase.from('jobs').select('*', { count: 'exact', head: true })
const { count: sc } = await supabase.from('seniors').select('*', { count: 'exact', head: true })
const { count: mc } = await supabase.from('matches').select('*', { count: 'exact', head: true })

console.log(`✅ 테이블 상태 확인`)
console.log(`   jobs    : ${jc}건 (샘플 일자리)`)
console.log(`   seniors : ${sc}건`)
console.log(`   matches : ${mc}건`)
