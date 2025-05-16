'use client'
import { createContext, ReactNode } from 'react'
import createFastContext, { IFastContextWrap } from '@sec/gui-seconder/fast-context'

// TODO: Binh, centralize with type at api
export type AuthType = {
  userId?: string;
  email?: string;
  jti?: string;
}

export const AuthContext = createContext<IFastContextWrap<AuthType>>(
  {} as IFastContextWrap<AuthType>,
)

const initialState: AuthType = {}

function safeParseAuthPayload(pl: string): AuthType {
  let initState: AuthType = initialState
  if (pl) {
    try {
      const auth = JSON.parse(pl || '')
      initState = Object.keys(auth).length ? (auth as AuthType) : {}
    } catch (e) {
      // do nothing
      console.log('safeParseAuthPayload error', e)
    }
  }
  return initState
}

export default function AuthProvider({
  children,
  authPl,
}: {
  children: ReactNode
  authPl: string
}) {
  //NOTE: Thao, example payload
  // let authPl = '{"userId":673966,"userName":"Tr%E1%BA%A7n%20T%C4%83ng%20Th%E1%BA%A3o","clientId":"skj","iatM":1692501706109,"loginType":5,"version":"1.0.0","termLanguage":4,"isSkjDeveloper":true,"isSms":1}'
  const auPayload  = safeParseAuthPayload(authPl)
  const { FastContext, useStore } = createFastContext<AuthType>(auPayload)
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     window.dispatchEvent(new CustomEvent('ggjAuPayloadUpdate', {
  //       detail: auPayload,
  //     }))
  //   }
  //   return () => {
  //     window.removeEventListener('ggjAuPayloadUpdate',handleAuPayloadUpdate as EventListener)
  //   }
  // }, [auPayload])

  return (
    <AuthContext value={{ useStore }}>
      <FastContext>{children}</FastContext>
    </AuthContext>
  )
}
