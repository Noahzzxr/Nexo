import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

function DoughnutStat({ value, label, subLabel, colors = ['#243F8F', '#E8EFFF'], className = '' }) {
  const remaining = Math.max(0, 100 - value)
  const data = [
    { name: label, value },
    { name: 'Restante', value: remaining },
  ]

  return (
    <div className={`relative h-44 w-full ${className}`}>
      <ResponsiveContainer height="100%" width="100%">
        <PieChart>
          <Pie
            cx="50%"
            cy="50%"
            data={data}
            dataKey="value"
            endAngle={-270}
            innerRadius={52}
            outerRadius={72}
            paddingAngle={2}
            startAngle={90}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell fill={colors[index]} key={entry.name} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-black text-brand-ink">{value.toFixed(1)}</span>
        <span className="text-xs font-semibold uppercase text-muted">{subLabel}</span>
      </div>
    </div>
  )
}

export default DoughnutStat
