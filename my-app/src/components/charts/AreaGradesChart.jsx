import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const series = [
  { key: 'Matematica', color: '#243F8F' },
  { key: 'Redacao', color: '#D84F45' },
  { key: 'Historia', color: '#26A269' },
  { key: 'Ingles', color: '#D6A12D' },
]

function AreaGradesChart({ data }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer height="100%" width="100%">
        <AreaChart data={data} margin={{ bottom: 4, left: -18, right: 8, top: 12 }}>
          <CartesianGrid stroke="#DFE4EB" strokeDasharray="4 4" />
          <XAxis dataKey="period" stroke="#64748B" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 10]} stroke="#64748B" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ border: '1px solid #DFE4EB', borderRadius: 12, boxShadow: '0 10px 24px rgba(15,23,42,.10)' }}
          />
          {series.map((item) => (
            <Area
              dataKey={item.key}
              fill={item.color}
              fillOpacity={0.22}
              key={item.key}
              stroke={item.color}
              strokeWidth={2}
              type="monotone"
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AreaGradesChart
