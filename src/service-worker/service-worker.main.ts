import { IS_AUTO_SKIP_ENABLED_KEY } from '../shared/storage-keys.constants'

const setAutoSkip = async (isAutoSkipEnabled: boolean) => {
    // set action badge
    chrome.storage.local.set({ [IS_AUTO_SKIP_ENABLED_KEY]: isAutoSkipEnabled })

    // update storage
    chrome.action.setBadgeText({ text: isAutoSkipEnabled ? '' : 'OFF' })
}

chrome.storage.local.get(IS_AUTO_SKIP_ENABLED_KEY, result => {
    const isAutoSkipEnabled = (result[IS_AUTO_SKIP_ENABLED_KEY] as boolean | undefined) ?? true

    // set action badge
    chrome.storage.local.set({ [IS_AUTO_SKIP_ENABLED_KEY]: isAutoSkipEnabled })

    // create context menu item
    chrome.contextMenus.create({
        id: 'toggle-auto-skip',
        title: 'Auto skip/mute YouTube ads',
        documentUrlPatterns: ['https://www.youtube.com/*'],

        contexts: ['all'],
        type: 'checkbox',
        checked: isAutoSkipEnabled,
    })
})

chrome.contextMenus.onClicked.addListener(async function (info) {
    if (info.menuItemId != 'toggle-auto-skip') return

    setAutoSkip(info.checked!)
})
