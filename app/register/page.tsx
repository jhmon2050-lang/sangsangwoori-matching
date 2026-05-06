'use client'

import { useActionState, useState } from 'react'
import { registerSenior } from '@/app/actions/register'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'

const REGIONS = [
  '서울', '부산', '대구', '인천', '광주', '대전', '울산',
  '세종', '경기', '강원', '충북', '충남', '전북', '전남',
  '경북', '경남', '제주',
]

const JOB_TYPES = [
  '경비·보안', '청소·위생', '조리·식품', '사무·행정',
  '운전·배달', '판매·영업', '농업·임업', '제조·생산',
  '복지·돌봄', '교육·강사',
]

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerSenior, null)
  const [region, setRegion]       = useState('')
  const [desiredJob, setDesiredJob] = useState('')

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">시니어 프로필 등록</h1>
        <p className="text-xl text-gray-600">정보를 입력하시면 맞춤 일자리를 추천해 드립니다</p>
      </div>

      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl text-blue-700">기본 정보 입력</CardTitle>
          <CardDescription className="text-base text-gray-500">
            모든 항목을 빠짐없이 입력해 주세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-6">

            {state?.error && (
              <div className="bg-red-50 border border-red-300 text-red-700 text-lg px-4 py-3 rounded-lg">
                {state.error}
              </div>
            )}

            {/* 이름 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-xl font-semibold text-gray-800">이름</Label>
              <Input
                id="name" name="name" type="text"
                placeholder="홍길동"
                className="h-14 text-xl px-4 border-2 border-gray-300 focus:border-blue-500"
                required
              />
            </div>

            {/* 지역 — hidden input으로 FormData에 직접 전달 */}
            <div className="flex flex-col gap-2">
              <Label className="text-xl font-semibold text-gray-800">거주 지역</Label>
              <input type="hidden" name="region" value={region} />
              <Select value={region} onValueChange={v => setRegion(v ?? '')}>
                <SelectTrigger className="h-14 text-xl border-2 border-gray-300 focus:border-blue-500">
                  <SelectValue placeholder="지역을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map(r => (
                    <SelectItem key={r} value={r} className="text-lg py-3">{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 희망 직종 */}
            <div className="flex flex-col gap-2">
              <Label className="text-xl font-semibold text-gray-800">희망 직종</Label>
              <input type="hidden" name="desired_job" value={desiredJob} />
              <Select value={desiredJob} onValueChange={v => setDesiredJob(v ?? '')}>
                <SelectTrigger className="h-14 text-xl border-2 border-gray-300 focus:border-blue-500">
                  <SelectValue placeholder="희망 직종을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map(j => (
                    <SelectItem key={j} value={j} className="text-lg py-3">{j}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 경력 연수 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="career_years" className="text-xl font-semibold text-gray-800">
                경력 연수 (년)
              </Label>
              <Input
                id="career_years" name="career_years" type="number"
                min={0} max={50} placeholder="예: 5"
                className="h-14 text-xl px-4 border-2 border-gray-300 focus:border-blue-500"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isPending || !region || !desiredJob}
              className="h-16 text-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white mt-2 rounded-xl shadow-md disabled:opacity-50"
            >
              {isPending ? '매칭 중…' : '프로필 등록하기'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
