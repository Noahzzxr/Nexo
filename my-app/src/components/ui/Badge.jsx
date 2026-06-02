const styles = {
  royal: 'bg-brand-royal-soft text-brand-royal',
  coral: 'bg-alert-soft text-alert-coral',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-amber-700',
  neutral: 'bg-slate-100 text-slate-700',
  dark: 'bg-brand-ink text-white',
}

function Badge({ children, className = '', tone = 'neutral' }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${styles[tone]} ${className}`}>
      {children}
    </span>
  )
}

export default Badge
