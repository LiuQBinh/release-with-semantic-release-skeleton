import { EventHandler } from '@create-figma-plugin/utilities'
import { Color, Mode, Radius } from '../themes'
export const PRIMITIVES_COLLECTION_NAME = 'Primitives'
export const TOKEN_COLLECTION_NAME = 'Tokens'

export interface ResizeWindowHandler extends EventHandler {
  name: 'RESIZE_WINDOW'
  handler: (windowSize: { width: number; height: number }) => void
}

export interface ChangeSelectionThemeHandler extends EventHandler {
  name: 'CHANGE_SELECTION_THEME'
  handler: (
    color: Color | null,
    radius: Radius | null,
    mode: Mode | null,
  ) => void
}

export interface ChangeVariablesThemeHandler extends EventHandler {
  name: 'CHANGE_VARIABLES_THEME'
  handler: (color: Color | null, radius: Radius | null) => void
}

export interface GetThemeHandler extends EventHandler {
  name: 'GET_THEME'
  handler: () => void
}

export interface SetThemeHandler extends EventHandler {
  name: 'SET_THEME'
  handler: (theme: string) => void
}

export interface SetMappingVariableHandler extends EventHandler {
  name: 'SET_MAPPING_VARIABLE'
  handler: (theme: string) => void
}
