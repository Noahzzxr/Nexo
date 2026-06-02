function Table({ columns, children, className = '' }) {
  return (
    <div className={`overflow-x-auto rounded-xl border border-line bg-white ${className}`}>
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-brand-ink text-white">
          <tr>
            {columns.map((column) => (
              <th className="px-4 py-3 font-semibold" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  )
}

export default Table
