import { Bar, BarChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function AttendanceBarChart({ data }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer height="100%" width="100%">
        <BarChart data={data} margin={{ bottom: 4, left: -18, right: 8, top: 12 }}>
          <CartesianGrid stroke="#DFE4EB" strokeDasharray="4 4" />
          <XAxis dataKey="month" stroke="#64748B" tick={{ fontSize: 12 }} />
          <YAxis domain={[80, 100]} stroke="#64748B" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ border: '1px solid #DFE4EB', borderRadius: 12, boxShadow: '0 10px 24px rgba(15,23,42,.10)' }}
          />
          <Bar dataKey="presenca" fill="#26A269" name="Presenca" radius={[6, 6, 0, 0]} />
          <Line dataKey="meta" dot={false} name="Meta" stroke="#D84F45" strokeDasharray="5 5" strokeWidth={2} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AttendanceBarChart
