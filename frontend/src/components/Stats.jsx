export default function Stats() {
  const stats = [
    {
      value: "10,000+",
      label: "Active Jobs"
    },
    {
      value: "5,000+",
      label: "Registered Candidates"
    },
    {
      value: "2x",
      label: "Faster Hiring"
    }
  ]

  return (
    // Trust / Stats section with muted colors
    <section className="bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              {/* Value */}
              <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-sm text-slate-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
