import { formatHex, formatHex8, oklch } from 'culori'

import {
  TOKEN_COLLECTION_NAME,
  PRIMITIVES_COLLECTION_NAME,
  SetThemeHandler,
  SetMappingVariableHandler,
} from './types'
import { emit } from '@create-figma-plugin/utilities'

export function convertThemeToJson() {
  try {
    const collections = figma.variables.getLocalVariableCollections()

    const primitivesCollection = collections.find(
      (collection) => collection.name === PRIMITIVES_COLLECTION_NAME,
    )
    const tokensCollection = collections.find(
      (collection) => collection.name === TOKEN_COLLECTION_NAME,
    )

    if (!primitivesCollection) {
      figma.notify('No `Primitives` collection found. Please check.', {
        error: true,
      })
      return
    }

    if (!tokensCollection) {
      figma.notify('No `Tokens` collection found. Please check.', {
        error: true,
      })
      return
    }
    const modes = primitivesCollection.modes
    const theme: Record<'light' | 'dark', Record<string, any>> = {
      light: {},
      dark: {},
    }

    const mappingVariable: Record<'light' | 'dark', Record<string, any>> = {
      light: {},
      dark: {},
    }

    for (const mode of modes) {
      const variables = getValueFromVariableIds(
        primitivesCollection.variableIds,
        mode.modeId,
      )
      const modeName = mode.name.toLowerCase() as 'light' | 'dark'
      theme[modeName] = {
        ...variables,
      }
      const variableMapping = getValueFromVariableIds(
        primitivesCollection.variableIds,
        mode.modeId,
        true,
      )
      mappingVariable[modeName] = {
        ...variableMapping,
      }
    }

    const tokens = getValueFromVariableIds(
      tokensCollection.variableIds,
      tokensCollection.modes[0].modeId,
    )

    emit<SetThemeHandler>('SET_THEME', createTheme(theme, tokens))
    emit<SetMappingVariableHandler>(
      'SET_MAPPING_VARIABLE',
      createMappingVariableColor(mappingVariable),
    )
  } catch (error) {
    console.log('error', error)
    if (error instanceof Error) {
      figma.notify(error.message, { error: true })
    } else {
      figma.notify('An unknown error occurred.', { error: true })
    }
  }
}

function resolveColorValue(
  variable: Variable,
  modeId: string,
  isMappingHexColor = false,
): string {
  const value = variable.valuesByMode[modeId]
  if (
    typeof value === 'object' &&
    'type' in value &&
    value.type === 'VARIABLE_ALIAS'
  ) {
    const alias = value as VariableAlias
    const referencedVariable = figma.variables.getVariableById(alias.id)
    if (referencedVariable) {
      return `var(--${generatesCSSKeyString(referencedVariable.name)})`
    }
  }
  if (value) {
    if (isMappingHexColor) {
      return rgbaObjectToCSSHexaString(value as RGBA)
    }
    return rgbaObjectToOklch(value as RGBA)
  }
  return ''
}

function getValueFromVariableIds(
  variableIds: string[],
  modeId: string,
  isMappingHexColor = false,
) {
  const values: Record<string, any> = {}

  variableIds.forEach((id) => {
    const variable = figma.variables.getVariableById(id)

    if (!variable) {
      throw new Error('Can`t find the variable')
    }
    switch (variable.resolvedType) {
      case 'COLOR':
        const variableName = variable.name.replace('/100', '')
        values[variableName] = resolveColorValue(
          variable,
          modeId,
          isMappingHexColor,
        )
        break
      case 'FLOAT':
        values[variable.name] = variable.valuesByMode[modeId]
        break
      default:
        values[variable.name] = ''
        break
    }
  })

  return values
}

function generatesCSSKeyString(keyString: string): string {
  return keyString
    .replace(/\//g, '-')
    .replace(/color-/g, '')
    .replace(/border-border-/g, 'border-')
    .replace(/background-bg-/g, 'bg-')
    .replace(/text-text-/g, 'text-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
}
function rgbaObjectToOklch(obj: RGBA): string {
  const { r, g, b, a } = obj
  const rgba = { r, g, b, alpha: a, mode: 'rgb' as const }
  const oklchColor = oklch(rgba)
  const { l, c, h, alpha } = oklchColor
  // Làm tròn giá trị để tránh quá nhiều chữ số sau dấu phẩy
  const lightness = (l * 100).toFixed(2) // Chuyển từ 0-1 → %
  const chroma = c.toFixed(4)
  const hue = h ? h.toFixed(1) : '0'
  const alphaColor = alpha ? alpha.toFixed(2) : '1'
  return `oklch(${lightness}% ${chroma} ${hue}/ ${alphaColor})`
}

function rgbaObjectToCSSHexaString(obj: RGBA): string {
  const { r, g, b, a } = obj
  if (a < 1) return formatHex8({ mode: 'rgb', r, g, b, alpha: a })
  return formatHex({ mode: 'rgb', r, g, b })
}

// function rgba2hex(orig: any) {
//   let a
//   const rgb = orig
//       .replace(/\s/g, '')
//       .match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
//     alpha = ((rgb && rgb[4]) || '').trim()
//   let hex = rgb
//     ? (rgb[1] | (1 << 8)).toString(16).slice(1) +
//       (rgb[2] | (1 << 8)).toString(16).slice(1) +
//       (rgb[3] | (1 << 8)).toString(16).slice(1)
//     : orig

//   if (alpha !== '') {
//     a = alpha
//   } else {
//     a = 0o1
//   }
//   a = ((a * 255) | (1 << 8)).toString(16).slice(1)
//   hex = hex + a

//   return '#' + hex.toUpperCase()
// }

function createTheme(
  theme: Record<'light' | 'dark', Record<string, any>>,
  tokens: Record<string, any>,
) {
  const radius = tokens['radius/rounded-lg'] / 16

  const template = `
  :root {
    ${Object.entries(theme.light)
      .map(([key, value]) => `--${generatesCSSKeyString(key)}: ${value};`)
      .join('\n')}
    ${Object.entries(tokens)
      .map(
        ([key]) =>
          `--${generatesCSSKeyString(key)}: ${createCSSVariables(tokens[key])};`,
      )
      .join('\n')}
     --radius:${radius}rem;
  }
      
  .dark {
    ${Object.entries(theme.dark)
      .map(([key, value]) => `--${generatesCSSKeyString(key)}: ${value};`)
      .join('\n')}
  }
  
 `
  return template
}

function createMappingVariableColor(
  mappingVariable: Record<'light' | 'dark', Record<string, any>>,
) {
  return `
    const mappingLightColor = {
     ${Object.entries(mappingVariable.light)
       .map(([key, value]) => `'${value}':'--${generatesCSSKeyString(key)}';`)
       .join('\n')}
    }

    const mappingDarkColor = {
     ${Object.entries(mappingVariable.dark)
       .map(([key, value]) => `'${value}':'--${generatesCSSKeyString(key)}';`)
       .join('\n')}
    }
  `
}

function createCSSVariables(tokenValue: string | number) {
  if (typeof tokenValue === 'number') {
    return `${tokenValue}px`
  }
  return tokenValue
}
