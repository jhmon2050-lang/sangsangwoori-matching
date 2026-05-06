export default function Loading() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      <div>
        <div className="h-10 w-56 bg-gray-200 rounded-lg mb-2" />
        <div className="h-6 w-72 bg-gray-100 rounded" />
      </div>

      {/* 요약 카드 3종 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[1, 2, 3].map(i => (
          <div key={i} className="border-2 rounded-lg p-6">
            <div className="h-5 w-20 bg-gray-200 rounded mb-4" />
            <div className="h-12 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* 테이블 */}
      <div className="border rounded-lg shadow-md p-6">
        <div className="h-8 w-48 bg-gray-200 rounded mb-6" />
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}
