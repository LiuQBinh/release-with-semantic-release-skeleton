'use client'
import { useEffect, useState, type ReactNode } from 'react'
import {
  Close,
  Root,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@radix-ui/react-toast'
import './styles.css'

type ToastType = 'error' | 'success'

interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  eventDate: Date
}

function SECToastController() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (event: CustomEvent<Toast>) => {
    setToasts((prev) => {
      const newToasts = [...prev, event.detail]
      // Keep only the last 3 toasts if more than 3 exist
      return newToasts.slice(-3)
    })
  }

  const removeToast = (idToRemove: string) => {
    setToasts((prev) => prev.filter(({ id }) => id !== idToRemove))
  }

  useEffect(() => {
    const handleToast = (event: Event) => addToast(event as CustomEvent<Toast>)
    window.addEventListener('toast', handleToast)
    return () => {
      window.removeEventListener('toast', handleToast)
    }
  }, [])

  // TODO: Binh, implement the toast UI following type (error, success)
  return (
    <>
      {toasts.map(({ id, type, title, description }) => (
        <Root
          key={id}
          className={`ToastRoot ${type}`}
          open
          duration={5000}
          onOpenChange={(open) => {
            if (!open) removeToast(id)
          }}
        >
          <ToastTitle className="ToastTitle">
            {title} - {id}
          </ToastTitle>
          {description && (
            <ToastDescription asChild>
              <div className="ToastDescription">{description}</div>
            </ToastDescription>
          )}
          <Close className="Button small green">CLOSE</Close>
        </Root>
      ))}
    </>
  )
}

// Export the toast event bus for external use
export const toast = {
  success: (title: string, description?: string) => {
    window.dispatchEvent(new CustomEvent('toast', {
      detail: {
        id: crypto.randomUUID(),
        type: 'success',
        title,
        description,
        eventDate: new Date(),
      }
    }))
  },
  error: (title: string, description?: string) => {
    window.dispatchEvent(new CustomEvent('toast', {
      detail: {
        id: crypto.randomUUID(),
        type: 'error',
        title,
        description,
        eventDate: new Date(),
      }
    }))
  },
}

export default function SECToastProvider({
  children,
}: {
  children: ReactNode
}) {
  return (
    <ToastProvider swipeDirection="up">
      {children}
      <ToastViewport className="ToastViewport" hotkey={['altKey', 'KeyT']} />
      <SECToastController />
    </ToastProvider>
  )
}
