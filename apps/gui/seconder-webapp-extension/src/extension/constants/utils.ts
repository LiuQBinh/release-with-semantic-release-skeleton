export const isChromeExtension = () => {
  return window.chrome?.runtime?.id !== undefined
}
