chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setOptions({
    path: 'index.html',
    enabled: true,
  })
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error))
})

console.log('==========================background')

chrome.commands.onCommand.addListener((command, tab) => {
  console.log('command', command)
  if (command === 'open-sidepanel') {
    chrome.sidePanel.open({
      tabId: tab.id,
      windowId: tab.windowId,
    })
    return
  }
  if (command === 'close-sidepanel') {
    chrome.runtime.sendMessage('closeSidePanel')
    return
  }
})
