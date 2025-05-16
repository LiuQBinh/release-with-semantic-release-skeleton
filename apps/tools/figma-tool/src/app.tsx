import { Tabs, TabsOption } from '@create-figma-plugin/ui'
import { JSX, h } from 'preact'
import { memo } from 'preact/compat'
import { useState } from 'preact/hooks'
import { ChangeVariables } from './components/ChangeVariables'
import { GetThemeFigma } from './components/GetTheme'

const options: TabsOption[] = [
  {
    children: <ChangeVariables />,
    value: 'Change variables',
  },
  {
    children: <GetThemeFigma />,
    value: 'Get theme',
  },
]

const Description = memo(function Description() {
  return (
    <ul
      style={{
        fontSize: 14,
        fontWeight: 500,
        color: '#000000',
        padding: 16,
        lineHeight: 1.5,
        marginLeft: 16,
      }}
    >
      <li>This tool is used to change variables in a Figma file.</li>
      <li>Convert Colors is used to convert colors to a different format.</li>
      <li>Get theme is used to get the theme of a Figma file.</li>
      <li>Only support convert variables to theme shadcn/ui.</li>
    </ul>
  )
})

export function App() {
  const [tab, setTab] = useState<string>('Get theme')

  function handleChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    setTab(event.currentTarget.value)
  }

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}>
      <Description />
      <Tabs options={options} onChange={handleChange} value={tab} />
    </div>
  )
}
