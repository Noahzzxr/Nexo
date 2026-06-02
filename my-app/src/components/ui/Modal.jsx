import { X } from 'lucide-react'

function Modal({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-brand-ink/60 px-4 py-6">
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 text-slate-900 shadow-panel">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl font-black text-brand-ink">{title}</h2>
          <button
            aria-label="Fechar modal"
            className="grid h-9 w-9 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-brand-ink"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  )
}

export default Modal
