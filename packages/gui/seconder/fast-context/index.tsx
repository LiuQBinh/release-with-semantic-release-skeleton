import {
  useRef,
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  ReactNode,
} from 'react'
import {produce} from 'immer'

export interface IBaseStore<T> {
  get: () => T
  set: (_value: Partial<T>) => void
  subscribe: (_callback: () => void) => () => void
  setSelector: (setFn: (store: T) => void) => void
  forceUpdate: () => void
}

export interface IFastContextWrap<Store> {
  useStore: <ReturnType>(_selector?: (_store: Store) => ReturnType) => [
    ReturnType,
    (_value: Partial<Store>) => void,
    (setFn: (store: Store) => void) => void,
    () => void,
    () => Store
  ]
}

export default function createFastContext<Store extends object>(
  initialState: Store,
) {
  function useStoreData(): IBaseStore<Store> {
    const store = useRef<Store>(initialState)

    const get = useCallback(() => store.current, [])

    const subscribers = useRef(new Set<() => void>())

    const forceUpdate = useCallback(() => {
      subscribers.current.forEach((callback) => callback())
    }, [])

    const set = useCallback((value: Partial<Store>) => {
      store.current = produce(store.current, (draft:Partial<Store>) => {
        Object.assign(draft, value)
      })
      forceUpdate()
    }, [])

    const setSelector = useCallback(
      (setFn: (store: Store) => void) => {
        store.current = produce(store.current, (draft) => {
          setFn(draft as Store)
        })
        // setFn(store.current)
        forceUpdate()
      },
      [],
    )

    const subscribe = useCallback((callback: () => void) => {
      subscribers.current.add(callback)
      return () => subscribers.current.delete(callback)
    }, [])

    return {
      get,
      set,
      subscribe,
      setSelector,
      forceUpdate,
    }
  }

  const StoreContext = createContext<IBaseStore<Store> | null>(null)

  function FastContext({ children }: { children: ReactNode }) {
    return (
      <StoreContext.Provider value={useStoreData()}>
        {children}
      </StoreContext.Provider>
    )
  }

  function useStore<SelectorOutput>(
    selector?: (_store: Store) => SelectorOutput,
  ): [
    SelectorOutput,
    (_value: Partial<Store>) => void,
    (setFn: (store: Store) => void) => void,
    () => void,
    () => Store
  ] {
    const store = useContext(StoreContext)
    if (!store) {
      throw new Error('Store not found')
    }

    const state = useSyncExternalStore(
      store.subscribe,
      () => selector && selector(store.get()),
      () => selector && selector(initialState),
    )

    return [
      // get
      state as SelectorOutput,

      // set props lv1, Ex: set({ productRs: [] } })
      store.set,

      // set deep props, Ex: setSelector(store => {
      //    store.data.list.productRs = []
      // } })
      store.setSelector,

      // forceUpdate
      store.forceUpdate,

      // getState function,
      store.get,
    ]
  }

  return {
    FastContext,
    useStore,
  }
}
