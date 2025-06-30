
export default function ProgressBar({ value = 0 }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div
        className="bg-blue-500 h-full transition-all duration-300 ease-in-out"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}
