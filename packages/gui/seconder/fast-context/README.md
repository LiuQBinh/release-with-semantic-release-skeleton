# How to use

## STEP 1 (SET UP): create provider, and wrap provider

- Create provider, in this example is `packages/gui/ggj/store/pages/test.tsx`.

```tsx
'use client'
import {createContext, ReactNode} from 'react'
import createFastContext, {IFastContextWrap} from '@sec/gui-ggj/store'

export type TestType = {
  propA: string
  propB: string
}

export const TestContext = createContext<IFastContextWrap<TestType>>(
  {} as IFastContextWrap<TestType>
)

export default function TestProvider({children, testPL}: { children: ReactNode, testPL: TestType }) {
  const {FastContext, useStore} = createFastContext<TestType>(testPL)
  return (
    <TestContext.Provider value={{useStore}}>
      <FastContext>{children}</FastContext>
    </TestContext.Provider>
  )
}
```

- Wrap provider, in this example is `apps/gui/ggj-ja/src/app/(surface)/page.tsx` (top page).

```tsx
import {ReactNode} from 'react'
import TestProvider from '@sec/gui-ggj/store/pages/test'

export default async function Home({children}: { children: ReactNode }) {
  return (
    <TestProvider testPL={{propB: 'b-index', propA: 'a-index'}}>
      {/* you child component, that will use store */}
      {children}
    </TestProvider>
  )
}
```

#### STEP 2 (USAGE):

- List params of `useStore`.

  | index of params | params name | description                                |
  |-----------------|-------------|--------------------------------------------|
  | 0               | state       | value return from get                      |
  | 1               | set         | using for set full store                   |
  | 2               | setSelector | using for set only property of store       |
  | 3               | forceUpdate | forceUpdate data, using in case setTimeout |
  | 4               | getState    | get state of store                        |
- Example:

```tsx
import {useContext} from 'react'
import {TestContext, TestType} from '@sec/gui-ggj/store/pages/test'

export function TestPropA() {
  const {useStore} = useContext(TestContext)
  const [a, set, setSelector, forceUpdate] = useStore((store) => store.propA)
  return (
    <div style={{background: '#598fdc'}}>
      <div>TestPropA</div>
      <div>{a}</div>
      <div>SET VALUE:</div>
      <div>
        {/* set */}
        <input
          onChange={(e) =>
            set({
              propA: e.target.value,
              propB: e.target.value,
            })
          }
        />

        {/* set using selector */}
        <input
          onChange={(e) => {
            setSelector((store: TestType) => {
              store.propA = e.target.value
            })
          }}
        />

        {/* set using force update */}
        <button
          onClick={(e) => {
            setSelector((store: TestType) => {
              setTimeout(() => {
                store.propA = '999999999999'
                forceUpdate()
              }, 2000)
            })
          }}
        >
          SET TIMEOUT
        </button>
      </div>
    </div>
  )
}
```

# Important points:

- In case wrapping store provider in layout.tsx, when go to another layout, store may be destroyed or reset.
- In case wrapping store provider in page.tsx, when go to another page, store will be destroyed.
- When developing, you should you testing store in the cases above.


## How to use `useFastDispatch`

When you want to function handler can access to `{setSelector, getState, fastDispatch}`, you can use `useFastDispatch`

- Example:

1. Define handler function
```tsx
// In api.ts
import { TContextParams } from '@sec/gui-skijan/fast-context/useFastDispatch'
import { IChatTransaction } from './index'

export const handleSomeAction = async ({
  setSelector,
  getState,
  fastDispatch
}: TContextParams<IChatTransaction>, params: { param1: string, param2: number }) => {
  try {
    const state = getState()
    // Use state data...

    // Use params
    console.log(`Params: ${params.param1}, ${params.param2}`)

    // Update state
    setSelector(store => {
      store.someProperty = 'new value'
    })

    // Call another function with context and params
    await fastDispatch(context => someOtherFunction(context, params))

  } catch (error) {
    console.error(error)
    // Handle error...
  }
}

```


2. Usage of the fastDispatch and handler function

```tsx
// In your component
import { useFastDispatch } from '@sec/gui-skijan/fast-context/useFastDispatch'
import { MypageTransactionContext } from './context'

const YourComponent = () => {
  const fastDispatch = useFastDispatch(MypageTransactionContext)

  const handleClick = () => {
    const params = {
      param1: 'some string',
      param2: 42
    }
    fastDispatch(context => handleSomeAction(context, params))
  }

  return <button onClick={handleClick}>Perform Action</button>
}


```
