function LogoMark({ className = 'h-10 w-10', light = false }) {
  return (
    <span className={`inline-grid shrink-0 place-items-center overflow-hidden rounded-lg ${light ? 'bg-white' : 'bg-brand-ink'} ${className}`}>
      <img alt="Logo Nexo" className="h-full w-full object-cover" src="/logo.png" />
    </span>
  )
}

export default LogoMark
