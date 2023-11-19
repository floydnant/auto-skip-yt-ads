import { manualSkipHandler, setupBodyObserver } from './yt-interaction'
import { IS_AUTO_SKIP_ENABLED_KEY } from '../shared/storage-keys.constants'

// @TODO: figure out how to let this be changed at runtime
let isAutoSkipEnabled = true
let bodyObserver: MutationObserver | null = null

const alignObserver = async () => {
    if (isAutoSkipEnabled && !bodyObserver) {
        bodyObserver = await setupBodyObserver()
    }

    if (!isAutoSkipEnabled && bodyObserver) {
        bodyObserver.disconnect()
        bodyObserver = null
    }
}

const main = async () => {
    document.addEventListener('keydown', async e => {
        if (e.key.toLowerCase() != 's') return

        manualSkipHandler()
        alignObserver()
    })

    // align local state with storage
    chrome.storage.local.get(IS_AUTO_SKIP_ENABLED_KEY, async storageResult => {
        if (IS_AUTO_SKIP_ENABLED_KEY in storageResult) {
            isAutoSkipEnabled = storageResult[IS_AUTO_SKIP_ENABLED_KEY] as boolean

            if (isAutoSkipEnabled) manualSkipHandler()
            alignObserver()
        }
    })

    // update local state when storage changes
    chrome.storage.local.onChanged.addListener(async storageChanges => {
        if (IS_AUTO_SKIP_ENABLED_KEY in storageChanges) {
            isAutoSkipEnabled = storageChanges[IS_AUTO_SKIP_ENABLED_KEY].newValue as boolean

            if (isAutoSkipEnabled) manualSkipHandler()
            alignObserver()
        }
    })
}
main()
