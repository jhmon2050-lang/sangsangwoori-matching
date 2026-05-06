export default function Loading() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      <div>
        <div className="h-10 w-64 bg-gray-200 rounded-lg mb-2" />
        <div className="h-6 w-96 bg-gray-100 rounded" />
      </div>

      <div className="flex items-center gap-3">
        <div className="h-8 w-20 bg-gray-200 rounded-full" />
        <div className="h-5 w-32 bg-gray-100 rounded" />
      </div>

      <div className="grid gap-5">
        {[1, 2, 3].map(i => (
          <div key={i} className="border rounded-lg shadow-md p-6 border-l-4 border-l-blue-200">
            <div className="flex items-start justify-between mb-4">
              <div className="h-7 w-48 bg-gray-200 rounded" />
              <div className="h-8 w-32 bg-gray-100 rounded-full" />
            </div>
            <div className="flex gap-3">
              <div className="h-7 w-24 bg-gray-100 rounded-full" />
              <div className="h-7 w-28 bg-gray-100 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
