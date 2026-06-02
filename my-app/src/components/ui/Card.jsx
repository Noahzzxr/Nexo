function Card({ children, className = '', as: Component = 'section' }) {
  return (
    <Component className={`rounded-xl border border-line bg-white p-5 shadow-md ${className}`}>
      {children}
    </Component>
  )
}

export default Card
