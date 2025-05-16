import { h, JSX } from 'preact'
import { Container } from '../Container'
import { Button } from '@create-figma-plugin/ui'
import {
  GetThemeHandler,
  SetThemeHandler,
  SetMappingVariableHandler,
} from '../../utils/types'
import { emit, on } from '@create-figma-plugin/utilities'
import { useState } from 'preact/hooks'

export function GetThemeFigma() {
  function handleGetTheme() {
    emit<GetThemeHandler>('GET_THEME')
  }

  return (
    <Container>
      <Button onClick={handleGetTheme} className="bg-red-500">
        Get Theme
      </Button>
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        <div style={{ flex: 1 }}>
          <h4 style={{ marginTop: 20 }}>Theme</h4>
          <ValueTheme />
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ marginTop: 20 }}>Mapping</h4>
          <ValueMappingColorToVariableCss />
        </div>
      </div>
    </Container>
  )
}

function ValueTheme() {
  const [value, setValue] = useState<string>('')
  on<SetThemeHandler>('SET_THEME', setTheme)
  function setTheme(theme: string) {
    try {
      setValue(theme)
    } catch (error) {
      console.error('Error parsing theme:', error)
    }
  }

  return (
    <div>
      <textarea
        name=""
        id=""
        value={value}
        rows={10}
        style={{
          width: '100%',
          padding: 16,
          marginTop: 16,
          border: '1px solid #ccc',
          borderRadius: 4,
        }}
      ></textarea>
    </div>
  )
}

function ValueMappingColorToVariableCss() {
  const [value, setValue] = useState<string>('')
  on<SetMappingVariableHandler>('SET_MAPPING_VARIABLE', setMappingVariable)
  function setMappingVariable(mappingVariable: string) {
    try {
      setValue(mappingVariable)
    } catch (error) {
      console.error('Error parsing theme:', error)
    }
  }

  return (
    <div>
      <textarea
        name=""
        id=""
        value={value}
        rows={10}
        style={{
          width: '100%',
          padding: 16,
          marginTop: 16,
          border: '1px solid #ccc',
          borderRadius: 4,
        }}
      ></textarea>
    </div>
  )
}
