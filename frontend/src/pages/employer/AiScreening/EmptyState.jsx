export default function EmptyState({ icon: Icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 mb-2">
        <Icon className="h-5 w-5 text-slate-400" />
      </div>
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  )
}
