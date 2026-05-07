import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Job } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { JobManagement } from '@/components/job-management'

type SeniorRow = {
  id: string
  name: string
  region: string
  desired_job: string
  career_years: number
}

type MatchRow = {
  senior_id: string
  score: number
  status: string
}

type SeniorStatus = 'unmatched' | 'pending' | 'assigned'

function getSeniorStatus(seniorId: string, matches: MatchRow[]): SeniorStatus {
  const own = matches.filter(m => m.senior_id === seniorId && m.score > 0)
  if (own.length === 0) return 'unmatched'
  if (own.some(m => m.status === 'assigned' || m.status === 'done')) return 'assigned'
  return 'pending'
}

function getBestScore(seniorId: string, matches: MatchRow[]): number {
  const scores = matches
    .filter(m => m.senior_id === seniorId && m.score > 0)
    .map(m => m.score)
  return scores.length > 0 ? Math.max(...scores) : 0
}

const STATUS_CONFIG: Record<SeniorStatus, { label: string; badgeClass: string; cardClass: string }> = {
  unmatched: { label: '미매칭',    badgeClass: 'bg-red-100 text-red-800',       cardClass: 'bg-red-50 border-red-200' },
  pending:   { label: '매칭 대기', badgeClass: 'bg-yellow-100 text-yellow-800', cardClass: 'bg-yellow-50 border-yellow-200' },
  assigned:  { label: '배정 완료', badgeClass: 'bg-green-100 text-green-800',   cardClass: 'bg-green-50 border-green-200' },
}

const FILTER_TABS: { key: SeniorStatus | 'all'; label: string }[] = [
  { key: 'all',       label: '전체' },
  { key: 'unmatched', label: '미매칭' },
  { key: 'pending',   label: '매칭 대기' },
  { key: 'assigned',  label: '배정 완료' },
]

function ScoreBadge({ score }: { score: number }) {
  if (score === 0) return <span className="text-gray-400 text-base">—</span>
  const cls =
    score >= 6 ? 'bg-yellow-100 text-yellow-800 border-yellow-400' :
    score >= 4 ? 'bg-green-100 text-green-800 border-green-400' :
                 'bg-gray-100 text-gray-600 border-gray-300'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-base font-bold border ${cls}`}>
      {score >= 6 ? '★ ' : ''}{score}점
    </span>
  )
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status: filterStatus } = await searchParams

  const [{ data: rawSeniors }, { data: rawMatches }, { data: rawJobs }] = await Promise.all([
    supabase
      .from('seniors')
      .select('id, name, region, desired_job, career_years')
      .order('created_at', { ascending: false }),
    supabase
      .from('matches')
      .select('senior_id, score, status'),
    supabase
      .from('jobs')
      .select('id, title, region, job_type, required_career')
      .order('created_at', { ascending: false }),
  ])

  const seniors = (rawSeniors ?? []) as SeniorRow[]
  const matches = (rawMatches ?? []) as MatchRow[]
  const jobs    = (rawJobs    ?? []) as Job[]

  const counts = {
    unmatched: seniors.filter(s => getSeniorStatus(s.id, matches) === 'unmatched').length,
    pending:   seniors.filter(s => getSeniorStatus(s.id, matches) === 'pending').length,
    assigned:  seniors.filter(s => getSeniorStatus(s.id, matches) === 'assigned').length,
  }

  const visibleSeniors =
    !filterStatus || filterStatus === 'all'
      ? seniors
      : seniors.filter(s => getSeniorStatus(s.id, matches) === filterStatus)

  const activeFilter = (filterStatus as SeniorStatus | 'all') ?? 'all'

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">담당자 대시보드</h1>
        <p className="text-xl text-gray-600">매칭 현황을 한눈에 확인하세요</p>
      </div>

      {/* 집계 카드 3종 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {(Object.entries(STATUS_CONFIG) as [SeniorStatus, typeof STATUS_CONFIG.unmatched][]).map(
          ([key, cfg]) => (
            <Card key={key} className={`border-2 ${cfg.cardClass} shadow-sm`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold text-gray-700">{cfg.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">{counts[key]}</span>
                  <span className="text-lg text-gray-500">명</span>
                </div>
              </CardContent>
            </Card>
          ),
        )}
      </div>

      {/* 시니어 목록 테이블 */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-2xl">시니어 매칭 현황</CardTitle>
            <Badge className="text-base px-4 py-1 bg-blue-600 text-white">
              {visibleSeniors.length}명 표시 / 전체 {seniors.length}명
            </Badge>
          </div>

          <div className="flex gap-2 flex-wrap mt-3">
            {FILTER_TABS.map(tab => {
              const isActive = activeFilter === tab.key
              return (
                <Link
                  key={tab.key}
                  href={tab.key === 'all' ? '/admin' : `/admin?status=${tab.key}`}
                  className={`px-4 py-2 rounded-lg text-base font-semibold transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                  {tab.key !== 'all' && (
                    <span className="ml-2 text-sm opacity-80">
                      {counts[tab.key as SeniorStatus]}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </CardHeader>
        <CardContent>
          {visibleSeniors.length === 0 ? (
            <p className="text-center text-gray-400 text-xl py-12">
              해당 상태의 시니어가 없습니다
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {['이름', '지역', '희망 직종', '경력', '최고 점수', '상태', ''].map(h => (
                    <TableHead key={h} className="text-base font-bold text-gray-700">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleSeniors.map(senior => {
                  const status    = getSeniorStatus(senior.id, matches)
                  const bestScore = getBestScore(senior.id, matches)
                  const cfg       = STATUS_CONFIG[status]

                  return (
                    <TableRow key={senior.id} className="hover:bg-gray-50">
                      <TableCell className="text-lg font-medium">{senior.name}</TableCell>
                      <TableCell className="text-lg">{senior.region}</TableCell>
                      <TableCell className="text-lg">{senior.desired_job}</TableCell>
                      <TableCell className="text-lg">{senior.career_years}년</TableCell>
                      <TableCell><ScoreBadge score={bestScore} /></TableCell>
                      <TableCell>
                        <span className={`inline-flex px-3 py-1 rounded-full text-base font-semibold ${cfg.badgeClass}`}>
                          {cfg.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/recommendations?senior_id=${senior.id}`}
                          className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-base font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                        >
                          상세 보기
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 일자리 관리 섹션 */}
      <JobManagement jobs={jobs} />
    </div>
  )
}
