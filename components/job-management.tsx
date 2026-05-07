'use client'

import { useActionState, useTransition, useState } from 'react'
import { addJob, deleteJob, type AddJobState } from '@/app/actions/admin'
import type { Job } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

const REGIONS   = ['서울', '경기', '인천', '기타'] as const
const JOB_TYPES = ['경비', '청소', '조리', '돌봄', '기타'] as const

function AddJobForm() {
  const [state, formAction, isPending] = useActionState<AddJobState, FormData>(addJob, null)
  const [region,  setRegion]  = useState('')
  const [jobType, setJobType] = useState('')

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold text-gray-800">일자리 추가</h3>

      {state?.success && (
        <div className="bg-green-50 border-2 border-green-400 text-green-800 text-lg px-4 py-3 rounded-lg font-semibold">
          일자리가 등록되었습니다.
        </div>
      )}
      {state?.error && (
        <div className="bg-red-50 border border-red-300 text-red-700 text-lg px-4 py-3 rounded-lg">
          {state.error}
        </div>
      )}

      <form action={formAction} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 공고명 */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <Label htmlFor="title" className="text-lg font-semibold text-gray-800">
            공고명 <span className="text-red-500">*</span>
          </Label>
          {state?.fieldErrors?.title && (
            <div className="bg-red-50 border border-red-300 text-red-700 text-base px-3 py-2 rounded-lg">
              {state.fieldErrors.title}
            </div>
          )}
          <Input
            id="title" name="title" type="text"
            placeholder="예: 강남구 아파트 경비원"
            className="h-12 text-lg px-4 border-2 border-gray-300 focus:border-blue-500"
          />
        </div>

        {/* 지역 */}
        <div className="flex flex-col gap-1">
          <Label className="text-lg font-semibold text-gray-800">
            지역 <span className="text-red-500">*</span>
          </Label>
          {state?.fieldErrors?.region && (
            <div className="bg-red-50 border border-red-300 text-red-700 text-base px-3 py-2 rounded-lg">
              {state.fieldErrors.region}
            </div>
          )}
          <input type="hidden" name="region" value={region} />
          <Select value={region} onValueChange={v => setRegion(v ?? '')}>
            <SelectTrigger className="h-12 text-lg border-2 border-gray-300">
              <SelectValue placeholder="지역 선택" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map(r => (
                <SelectItem key={r} value={r} className="text-base py-2">{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 직종 */}
        <div className="flex flex-col gap-1">
          <Label className="text-lg font-semibold text-gray-800">
            직종 <span className="text-red-500">*</span>
          </Label>
          {state?.fieldErrors?.job_type && (
            <div className="bg-red-50 border border-red-300 text-red-700 text-base px-3 py-2 rounded-lg">
              {state.fieldErrors.job_type}
            </div>
          )}
          <input type="hidden" name="job_type" value={jobType} />
          <Select value={jobType} onValueChange={v => setJobType(v ?? '')}>
            <SelectTrigger className="h-12 text-lg border-2 border-gray-300">
              <SelectValue placeholder="직종 선택" />
            </SelectTrigger>
            <SelectContent>
              {JOB_TYPES.map(j => (
                <SelectItem key={j} value={j} className="text-base py-2">{j}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 요구 경력 */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="required_career" className="text-lg font-semibold text-gray-800">
            요구 경력 (년)
          </Label>
          <Input
            id="required_career" name="required_career" type="number"
            min={0} max={50} defaultValue={0}
            className="h-12 text-lg px-4 border-2 border-gray-300 focus:border-blue-500"
          />
        </div>

        <div className="sm:col-span-2">
          <Button
            type="submit"
            disabled={isPending}
            className="h-12 text-lg font-bold px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow disabled:opacity-50"
          >
            {isPending ? '등록 중…' : '일자리 등록'}
          </Button>
        </div>
      </form>
    </div>
  )
}

function DeleteJobButton({ jobId }: { jobId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      size="sm"
      variant="destructive"
      disabled={isPending}
      className="text-base font-semibold"
      onClick={() => startTransition(() => deleteJob(jobId))}
    >
      {isPending ? '삭제 중…' : '삭제'}
    </Button>
  )
}

export function JobManagement({ jobs }: { jobs: Job[] }) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">일자리 관리</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <AddJobForm />

        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            등록된 일자리 <span className="text-base font-normal text-gray-500">({jobs.length}건)</span>
          </h3>
          {jobs.length === 0 ? (
            <p className="text-center text-gray-400 text-lg py-8">등록된 일자리가 없습니다</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {['공고명', '지역', '직종', '요구 경력', ''].map(h => (
                    <TableHead key={h} className="text-base font-bold text-gray-700">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map(job => (
                  <TableRow key={job.id} className="hover:bg-gray-50">
                    <TableCell className="text-lg font-medium">{job.title}</TableCell>
                    <TableCell className="text-lg">{job.region}</TableCell>
                    <TableCell className="text-lg">{job.job_type}</TableCell>
                    <TableCell className="text-lg">{job.required_career}년</TableCell>
                    <TableCell>
                      <DeleteJobButton jobId={job.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
