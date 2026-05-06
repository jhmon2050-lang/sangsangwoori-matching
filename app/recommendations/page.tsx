import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

function ScoreBadge({ score }: { score: number }) {
  const colorClass =
    score >= 80 ? 'bg-green-100 text-green-800 border-green-300' :
    score >= 60 ? 'bg-blue-100 text-blue-800 border-blue-300' :
                  'bg-gray-100 text-gray-700 border-gray-300'
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-bold border ${colorClass}`}>
      매칭 점수 {score}점
    </span>
  )
}

type MatchRow = {
  id: string
  score: number
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
      .select('id, score, jobs(id, title, region, job_type)')
      .eq('senior_id', senior_id)
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

      <div className="flex items-center gap-3">
        <Badge className="text-base px-4 py-1 bg-blue-600 text-white">
          총 {matches.length}건
        </Badge>
        <span className="text-gray-500 text-base">매칭 점수 높은 순</span>
      </div>

      {matches.length > 0 ? (
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
                      📍 {job.region}
                    </Badge>
                    <Badge variant="outline" className="text-base px-3 py-1 text-gray-700">
                      💼 {job.job_type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-2xl">조건에 맞는 일자리가 없습니다</p>
          <p className="text-lg mt-2">지역·직종·경력이 맞는 일자리가 등록되면 자동 매칭됩니다</p>
        </div>
      )}

      <div className="text-center mt-4">
        <Link href="/register" className="text-blue-600 hover:underline text-lg">
          다른 프로필 등록하기 →
        </Link>
      </div>
    </div>
  )
}
