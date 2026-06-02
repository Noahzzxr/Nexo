function InputField({
  label,
  name,
  type = 'text',
  value,
  placeholder,
  options = [],
  className = '',
  as = 'input',
  ...props
}) {
  const inputClass =
    'mt-2 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-copy outline-none transition placeholder:text-slate-400 focus:border-brand-royal focus:ring-2 focus:ring-brand-royal-soft disabled:bg-slate-100 disabled:text-muted'

  return (
    <label className={`block text-sm font-semibold text-brand-ink ${className}`}>
      <span>{label}</span>
      {as === 'textarea' ? (
        <textarea className={`${inputClass} min-h-28 resize-none`} name={name} placeholder={placeholder} value={value} {...props} />
      ) : as === 'select' ? (
        <select className={inputClass} name={name} value={value} {...props}>
          {options.map((option) => {
            const optionValue = typeof option === 'string' ? option : option.value
            const optionLabel = typeof option === 'string' ? option : option.label

            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            )
          })}
        </select>
      ) : (
        <input className={inputClass} name={name} placeholder={placeholder} type={type} value={value} {...props} />
      )}
    </label>
  )
}

export default InputField
