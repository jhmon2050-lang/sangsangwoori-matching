import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { AssignButton } from '@/components/assign-button'

type SeniorRow = {
  id: string
  name: string
  region: string
  desired_job: string
  career_years: number
}

type MatchRow = {
  id: string
  senior_id: string
  score: number
  status: string
  jobs: { title: string; region: string; job_type: string } | null
}

type SeniorStatus = 'unmatched' | 'pending' | 'assigned'

const STATUS_CONFIG: Record<SeniorStatus, { label: string; badgeClass: string; cardClass: string }> = {
  unmatched: { label: '미매칭',   badgeClass: 'bg-red-100 text-red-800',    cardClass: 'bg-red-50 border-red-200' },
  pending:   { label: '매칭 대기', badgeClass: 'bg-yellow-100 text-yellow-800', cardClass: 'bg-yellow-50 border-yellow-200' },
  assigned:  { label: '배정 완료', badgeClass: 'bg-green-100 text-green-800',  cardClass: 'bg-green-50 border-green-200' },
}

function getSeniorStatus(seniorId: string, matches: MatchRow[]): SeniorStatus {
  const own = matches.filter(m => m.senior_id === seniorId)
  if (own.length === 0) return 'unmatched'
  if (own.some(m => m.status === 'assigned')) return 'assigned'
  return 'pending'
}

function getBestMatch(seniorId: string, matches: MatchRow[]): MatchRow | undefined {
  return matches.find(m => m.senior_id === seniorId)
}

export default async function AdminPage() {
  const [{ data: rawSeniors }, { data: rawMatches }] = await Promise.all([
    supabase
      .from('seniors')
      .select('id, name, region, desired_job, career_years')
      .order('created_at', { ascending: false }),
    supabase
      .from('matches')
      .select('id, senior_id, score, status, jobs(title, region, job_type)')
      .order('score', { ascending: false }),
  ])

  const seniors = (rawSeniors ?? []) as SeniorRow[]
  const matches = (rawMatches ?? []) as unknown as MatchRow[]

  const counts = {
    unmatched: seniors.filter(s => getSeniorStatus(s.id, matches) === 'unmatched').length,
    pending:   seniors.filter(s => getSeniorStatus(s.id, matches) === 'pending').length,
    assigned:  seniors.filter(s => getSeniorStatus(s.id, matches) === 'assigned').length,
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">담당자 대시보드</h1>
        <p className="text-xl text-gray-600">매칭 현황을 한눈에 확인하세요</p>
      </div>

      {/* 현황 요약 카드 3종 */}
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

      {/* 시니어 매칭 현황 테이블 */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-2xl">시니어 매칭 현황</CardTitle>
            <Badge className="text-base px-4 py-1 bg-blue-600 text-white">
              전체 {seniors.length}명
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {seniors.length === 0 ? (
            <p className="text-center text-gray-400 text-xl py-12">
              등록된 시니어가 없습니다
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {['이름', '지역', '희망 직종', '경력', '추천 일자리', '점수', '상태', ''].map(h => (
                    <TableHead key={h} className="text-base font-bold text-gray-700">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {seniors.map(senior => {
                  const status    = getSeniorStatus(senior.id, matches)
                  const bestMatch = getBestMatch(senior.id, matches)
                  const cfg       = STATUS_CONFIG[status]

                  return (
                    <TableRow key={senior.id} className="hover:bg-gray-50">
                      <TableCell className="text-lg font-medium">{senior.name}</TableCell>
                      <TableCell className="text-lg">{senior.region}</TableCell>
                      <TableCell className="text-lg">{senior.desired_job}</TableCell>
                      <TableCell className="text-lg">{senior.career_years}년</TableCell>
                      <TableCell className="text-lg">{bestMatch?.jobs?.title ?? '—'}</TableCell>
                      <TableCell className="text-lg font-semibold">
                        {bestMatch ? `${bestMatch.score}점` : '—'}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex px-3 py-1 rounded-full text-base font-semibold ${cfg.badgeClass}`}>
                          {cfg.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        {status === 'pending' && bestMatch && (
                          <AssignButton matchId={bestMatch.id} />
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
