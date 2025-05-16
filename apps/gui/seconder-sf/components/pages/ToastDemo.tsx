'use client'
import * as React from 'react'
import { cn } from '@sec/gui-seconder/lib/utils'
import { buttonVariants } from '@sec/gui-seconder/components/shadcn/button'
import { toast } from '@sec/gui-seconder/components/common/SECToastProvider'
import { useContext } from 'react'
import { AuthContext } from '@sec/gui-seconder/store/auth'

export const ToastDemo = () => {
  const { useStore } = useContext(AuthContext)
  const [userId] = useStore((store) => store.userId)
  const addToast = () => {
    toast.success('Hello', 'This is a toast')
  }

  return (
    <button
      className={cn(buttonVariants({ className: 'mt-2' }))}
      onClick={addToast}
    >
      Test show toast {userId}
    </button>
  )
}
