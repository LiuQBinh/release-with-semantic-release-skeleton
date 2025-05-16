
export const handleCopyToClipboard = (url: string) => {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(url)
  }

  return new Promise<void>((resolve, reject) => {
    try {
      // The old way, deprecated
      const textArea = document.createElement('textarea')
      textArea.style.display = 'none'
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}
