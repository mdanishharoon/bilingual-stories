export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 flex justify-center items-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto mb-4"></div>
        <p className="text-purple-600 font-medium text-lg">Creating magic...</p>
      </div>
    </div>
  )
}
