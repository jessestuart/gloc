import { MESSAGE_IDS } from './constants'
import { translateElements } from './utils'

document.getElementById('settings-button').addEventListener('click', () => {
  chrome.tabs.create({
    url: 'chrome://extensions/?options=' + chrome.runtime.id,
  })
})

translateElements(MESSAGE_IDS.POPUP)
