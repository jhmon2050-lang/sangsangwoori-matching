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

const REGIONS   = ['서울', '경기', '인천', '기타'] as const
const JOB_TYPES = ['경비', '청소', '조리', '돌봄', '기타'] as const

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerSenior, null)
  const [region, setRegion]           = useState('')
  const [desiredJob, setDesiredJob]   = useState('')

  if (state?.success) {
    return (
      <div className="flex flex-col items-center gap-8">
        <div className="w-full max-w-xl bg-green-50 border-2 border-green-400 text-green-800 rounded-xl px-6 py-8 text-center shadow">
          <p className="text-3xl font-bold mb-3">등록이 완료되었습니다</p>
          <p className="text-xl text-green-700">맞춤 일자리 매칭이 진행됩니다.</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="text-xl text-blue-600 underline underline-offset-4 hover:text-blue-800"
        >
          새 프로필 등록하기
        </button>
      </div>
    )
  }

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
            필수 항목(*)을 빠짐없이 입력해 주세요
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
              <Label htmlFor="name" className="text-xl font-semibold text-gray-800">
                이름 <span className="text-red-500">*</span>
              </Label>
              {state?.fieldErrors?.name && (
                <div className="bg-red-50 border border-red-300 text-red-700 text-base px-3 py-2 rounded-lg">
                  {state.fieldErrors.name}
                </div>
              )}
              <Input
                id="name" name="name" type="text"
                placeholder="홍길동"
                className="h-14 text-xl px-4 border-2 border-gray-300 focus:border-blue-500"
              />
            </div>

            {/* 지역 */}
            <div className="flex flex-col gap-2">
              <Label className="text-xl font-semibold text-gray-800">
                거주 지역 <span className="text-red-500">*</span>
              </Label>
              {state?.fieldErrors?.region && (
                <div className="bg-red-50 border border-red-300 text-red-700 text-base px-3 py-2 rounded-lg">
                  {state.fieldErrors.region}
                </div>
              )}
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
              <Label className="text-xl font-semibold text-gray-800">
                희망 직종 <span className="text-red-500">*</span>
              </Label>
              {state?.fieldErrors?.desired_job && (
                <div className="bg-red-50 border border-red-300 text-red-700 text-base px-3 py-2 rounded-lg">
                  {state.fieldErrors.desired_job}
                </div>
              )}
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
                min={0} max={50} defaultValue={0}
                className="h-14 text-xl px-4 border-2 border-gray-300 focus:border-blue-500"
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="h-16 text-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white mt-2 rounded-xl shadow-md disabled:opacity-50"
            >
              {isPending ? '등록 중…' : '프로필 등록하기'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
