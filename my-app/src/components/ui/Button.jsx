const variants = {
  primary: 'bg-brand-ink text-white hover:bg-brand-ink-soft focus-visible:outline-brand-ink',
  royal: 'bg-brand-royal text-white hover:bg-blue-800 focus-visible:outline-brand-royal',
  coral: 'bg-alert-coral text-white hover:bg-red-700 focus-visible:outline-alert-coral',
  success: 'bg-success text-white hover:bg-emerald-700 focus-visible:outline-success',
  warning: 'bg-warning text-brand-ink hover:bg-amber-500 focus-visible:outline-warning',
  ghost:
    'border border-line bg-white text-brand-ink hover:border-brand-royal hover:text-brand-royal focus-visible:outline-brand-royal',
  soft:
    'bg-brand-royal-soft text-brand-royal hover:bg-blue-100 focus-visible:outline-brand-royal',
}

function Button({ as: Component = 'button', children, className = '', icon: Icon, variant = 'primary', type = 'button', ...props }) {
  const componentProps = Component === 'button' ? { type } : {}

  return (
    <Component
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...componentProps}
      {...props}
    >
      {Icon ? <Icon aria-hidden="true" className="h-4 w-4 shrink-0" /> : null}
      <span>{children}</span>
    </Component>
  )
}

export default Button
