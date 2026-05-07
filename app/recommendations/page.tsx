import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function ScoreBadge({ score }: { score: number }) {
  const cls =
    score >= 6 ? 'bg-yellow-100 text-yellow-800 border-yellow-400' :
    score >= 4 ? 'bg-green-100 text-green-800 border-green-400' :
                 'bg-gray-100 text-gray-600 border-gray-300'
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-bold border ${cls}`}>
      {score >= 6 ? '★ ' : ''}{score}점
    </span>
  )
}

type MatchRow = {
  id: string
  score: number
  status: string
  jobs: { id: string; title: string; region: string; job_type: string } | null
}

export default async function RecommendationsPage({
  searchParams,
}: {
  searchParams: Promise<{ senior_id?: string }>
}) {
  const { senior_id } = await searchParams

  if (!senior_id) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <p className="text-2xl text-gray-500">프로필을 먼저 등록해 주세요</p>
        <Link
          href="/register"
          className="inline-flex items-center justify-center h-14 text-xl px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
        >
          프로필 등록하러 가기
        </Link>
      </div>
    )
  }

  const [{ data: senior }, { data: rawMatches }] = await Promise.all([
    supabase
      .from('seniors')
      .select('name, region, desired_job, career_years')
      .eq('id', senior_id)
      .single(),
    supabase
      .from('matches')
      .select('id, score, status, jobs(id, title, region, job_type)')
      .eq('senior_id', senior_id)
      .gt('score', 0)
      .order('score', { ascending: false }),
  ])

  const matches = (rawMatches ?? []) as unknown as MatchRow[]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">추천 일자리 목록</h1>
        {senior && (
          <p className="text-xl text-gray-600">
            <span className="font-semibold text-blue-700">{senior.name}</span>님 맞춤 추천 —{' '}
            {senior.region} · {senior.desired_job} · 경력 {senior.career_years}년
          </p>
        )}
      </div>

      {matches.length === 0 ? (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl px-6 py-10 text-center">
          <p className="text-2xl font-semibold text-yellow-800 mb-2">현재 매칭되는 일자리가 없습니다</p>
          <p className="text-lg text-yellow-700">지역·직종·경력 조건이 맞는 일자리가 등록되면 자동으로 매칭됩니다.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <Badge className="text-base px-4 py-1 bg-blue-600 text-white">
              총 {matches.length}건
            </Badge>
            <span className="text-gray-500 text-base">매칭 점수 높은 순 (최대 6점)</span>
          </div>

          <div className="grid gap-5">
            {matches.map(match => {
              const job = match.jobs
              if (!job) return null
              return (
                <Card
                  key={match.id}
                  className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-blue-500"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <CardTitle className="text-2xl font-bold text-gray-900">{job.title}</CardTitle>
                      <ScoreBadge score={match.score} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3 flex-wrap">
                      <Badge variant="outline" className="text-base px-3 py-1 text-gray-700">
                        지역: {job.region}
                      </Badge>
                      <Badge variant="outline" className="text-base px-3 py-1 text-gray-700">
                        직종: {job.job_type}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}

      <div className="text-center mt-4">
        <Link href="/register" className="text-blue-600 hover:underline text-lg">
          다른 프로필 등록하기 →
        </Link>
      </div>
    </div>
  )
}
