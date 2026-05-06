'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
      <h2 className="text-3xl font-bold text-gray-800">오류가 발생했습니다</h2>
      <p className="text-lg text-gray-500 max-w-md">
        데이터를 불러오는 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.
      </p>
      {error.digest && (
        <p className="text-sm text-gray-400">오류 코드: {error.digest}</p>
      )}
      <div className="flex gap-4">
        <button
          onClick={unstable_retry}
          className="h-12 px-6 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
        >
          다시 시도
        </button>
        <Link
          href="/register"
          className="inline-flex items-center justify-center h-12 px-6 text-lg border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-semibold transition-colors"
        >
          처음으로
        </Link>
      </div>
    </div>
  )
}
