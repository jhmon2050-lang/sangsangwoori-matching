'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { assignMatch } from '@/app/actions/admin'

export function AssignButton({ matchId }: { matchId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      size="sm"
      disabled={isPending}
      className="bg-green-600 hover:bg-green-700 text-white text-base font-semibold"
      onClick={() => startTransition(() => assignMatch(matchId))}
    >
      {isPending ? '처리 중…' : '배정 완료'}
    </Button>
  )
}
