function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function Avatar({ image, name, size = 'md', status, className = '' }) {
  const sizes = {
    sm: 'h-9 w-9 text-xs',
    md: 'h-11 w-11 text-sm',
    lg: 'h-16 w-16 text-lg',
    xl: 'h-24 w-24 text-2xl',
  }

  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center rounded-full bg-brand-royal-soft font-bold text-brand-royal ${sizes[size]} ${className}`}>
      {image ? <img alt={name} className="h-full w-full rounded-full object-cover" src={image} /> : getInitials(name)}
      {status ? (
        <span
          aria-label={status === 'online' ? 'Online' : 'Offline'}
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${status === 'online' ? 'bg-success' : 'bg-slate-400'}`}
        />
      ) : null}
    </span>
  )
}

export default Avatar
