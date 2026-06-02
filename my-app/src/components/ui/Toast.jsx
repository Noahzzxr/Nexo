import { useCallback, useEffect, useState } from 'react'
import { Bell, X } from 'lucide-react'
import { useToast } from '../../hooks/useToast'
import { ToastContext } from './toastContext'

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback(
    (toast) => {
      const id = crypto.randomUUID()
      setToasts((current) => [...current, { id, ...toast }])
      window.setTimeout(() => dismissToast(id), 5200)
    },
    [dismissToast],
  )

  useEffect(() => {
    const timer = window.setTimeout(() => {
      addToast({
        title: 'Nova nota postada',
        message: 'Matematica recebeu correcao do 3o periodo no boletim.',
      })
    }, 1400)

    return () => window.clearTimeout(timer)
  }, [addToast])

  return <ToastContext.Provider value={{ addToast, dismissToast, toasts }}>{children}</ToastContext.Provider>
}

export function ToastViewport() {
  const { dismissToast, toasts } = useToast()

  return (
    <div className="fixed right-4 top-20 z-50 flex w-[min(420px,calc(100vw-32px))] flex-col gap-3">
      {toasts.map((toast) => (
        <div className="rounded-xl border border-line bg-white p-4 text-left shadow-panel" key={toast.id}>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success-soft text-success">
              <Bell aria-hidden="true" className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-brand-ink">{toast.title}</p>
              <p className="mt-1 text-sm text-muted">{toast.message}</p>
            </div>
            <button
              aria-label="Fechar notificacao"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-slate-100 hover:text-brand-ink"
              onClick={() => dismissToast(toast.id)}
              type="button"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
