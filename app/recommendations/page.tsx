import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PLACEHOLDER_MATCHES = [
  { id: "1", job_title: "아파트 경비원", region: "서울", job_type: "경비·보안", score: 95 },
  { id: "2", job_title: "급식 조리보조", region: "경기", job_type: "조리·식품", score: 82 },
  { id: "3", job_title: "마트 판매원", region: "서울", job_type: "판매·영업", score: 71 },
  { id: "4", job_title: "사무 보조원", region: "인천", job_type: "사무·행정", score: 60 },
];

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90
      ? "bg-green-100 text-green-800 border-green-300"
      : score >= 70
      ? "bg-blue-100 text-blue-800 border-blue-300"
      : "bg-gray-100 text-gray-700 border-gray-300";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-bold border ${color}`}
    >
      매칭 점수 {score}점
    </span>
  );
}

export default function RecommendationsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">추천 일자리 목록</h1>
        <p className="text-xl text-gray-600">매칭 점수가 높은 순서로 표시됩니다</p>
      </div>

      <div className="flex items-center gap-3">
        <Badge className="text-base px-4 py-1 bg-blue-600 text-white">
          총 {PLACEHOLDER_MATCHES.length}건
        </Badge>
        <span className="text-gray-400 text-sm">* 더미 데이터 — 기능 구현 후 실데이터로 교체됩니다</span>
      </div>

      <div className="grid gap-5">
        {PLACEHOLDER_MATCHES.map((match) => (
          <Card
            key={match.id}
            className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-blue-500"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {match.job_title}
                </CardTitle>
                <ScoreBadge score={match.score} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 flex-wrap">
                <Badge variant="outline" className="text-base px-3 py-1 text-gray-700">
                  📍 {match.region}
                </Badge>
                <Badge variant="outline" className="text-base px-3 py-1 text-gray-700">
                  💼 {match.job_type}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {PLACEHOLDER_MATCHES.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-2xl">추천 일자리가 없습니다</p>
          <p className="text-lg mt-2">프로필을 먼저 등록해 주세요</p>
        </div>
      )}
    </div>
  );
}
