import { Context, useCallback, useContext } from 'react'
import { IBaseStore, IFastContextWrap } from '.'


export type TContextParams<Store extends object> = {
  setSelector: IBaseStore<Store>['setSelector']
  getState: () => Store
  fastDispatch: <P>(handler: TFastDispatcher<Store, P>) => P extends Promise<infer U> ? Promise<U> : P
}

export type TFastDispatcher<Store extends object, R = any> = (params: {
  setSelector: IBaseStore<Store>['setSelector']
  getState: () => Store
  fastDispatch: <P>(
    handler: TFastDispatcher<Store, P>,
  ) => P extends Promise<infer U> ? Promise<U> : P
}) => R extends Promise<infer U> ? Promise<U> : R

export const useDispatchFastContext = <Store extends object>(
  context: Context<IFastContextWrap<Store>>,
) => {
  const { useStore } = useContext(context)
  const [, , setSelector, , getState] = useStore()

  const fastDispatch = useCallback(
    <R>(handler: TFastDispatcher<Store, R>) => {
      const result = handler({ setSelector, getState, fastDispatch })
      return result
    },
    [setSelector, getState],
  )

  return fastDispatch
}
