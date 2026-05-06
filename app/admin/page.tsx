import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATUS_COLUMNS = [
  {
    key: "unmatched",
    label: "미매칭",
    color: "bg-red-50 border-red-200",
    badgeColor: "bg-red-100 text-red-800",
    count: 0,
  },
  {
    key: "pending",
    label: "매칭 대기",
    color: "bg-yellow-50 border-yellow-200",
    badgeColor: "bg-yellow-100 text-yellow-800",
    count: 0,
  },
  {
    key: "assigned",
    label: "배정 완료",
    color: "bg-green-50 border-green-200",
    badgeColor: "bg-green-100 text-green-800",
    count: 0,
  },
];

const PLACEHOLDER_SENIORS = [
  { id: "1", name: "김철수", region: "서울", desired_job: "경비·보안", career_years: 10, status: "unmatched" },
  { id: "2", name: "이순자", region: "경기", desired_job: "조리·식품", career_years: 5, status: "pending" },
  { id: "3", name: "박영호", region: "부산", desired_job: "운전·배달", career_years: 15, status: "assigned" },
];

const STATUS_LABEL: Record<string, string> = {
  unmatched: "미매칭",
  pending: "매칭 대기",
  assigned: "배정 완료",
};

const STATUS_BADGE_COLOR: Record<string, string> = {
  unmatched: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
  assigned: "bg-green-100 text-green-800",
};

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">담당자 대시보드</h1>
        <p className="text-xl text-gray-600">매칭 현황을 한눈에 확인하세요</p>
      </div>

      {/* 현황 요약 카드 3개 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {STATUS_COLUMNS.map((col) => (
          <Card key={col.key} className={`border-2 ${col.color} shadow-sm`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-gray-700">
                {col.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-gray-900">
                  {PLACEHOLDER_SENIORS.filter((s) => s.status === col.key).length}
                </span>
                <span className="text-lg text-gray-500">명</span>
              </div>
              <span
                className={`inline-block mt-2 px-2 py-0.5 rounded text-sm font-medium ${col.badgeColor}`}
              >
                {col.label} 상태
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 시니어 목록 테이블 */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">시니어 매칭 현황</CardTitle>
            <Badge className="text-base px-4 py-1 bg-blue-600 text-white">
              전체 {PLACEHOLDER_SENIORS.length}명
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-lg font-bold text-gray-700">이름</TableHead>
                <TableHead className="text-lg font-bold text-gray-700">지역</TableHead>
                <TableHead className="text-lg font-bold text-gray-700">희망 직종</TableHead>
                <TableHead className="text-lg font-bold text-gray-700">경력</TableHead>
                <TableHead className="text-lg font-bold text-gray-700">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PLACEHOLDER_SENIORS.map((senior) => (
                <TableRow key={senior.id} className="hover:bg-gray-50">
                  <TableCell className="text-lg font-medium">{senior.name}</TableCell>
                  <TableCell className="text-lg">{senior.region}</TableCell>
                  <TableCell className="text-lg">{senior.desired_job}</TableCell>
                  <TableCell className="text-lg">{senior.career_years}년</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-base font-semibold ${
                        STATUS_BADGE_COLOR[senior.status]
                      }`}
                    >
                      {STATUS_LABEL[senior.status]}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-center text-gray-400 text-sm mt-4">
            * 더미 데이터 — 기능 구현 후 실데이터로 교체됩니다
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
