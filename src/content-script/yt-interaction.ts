import {
    ADS_CONTAINER,
    CLOSE_AD_BANNER_BTN,
    MUTE_BTN,
    SKIP_AD_BTN,
    VIDEO_PLAYS_SOON_INDICATOR,
    VIDEO_PLAYS_SOON_INDICATOR_TEXT,
} from './elem-selectors.constants'
import { isOnWatchPage } from './yt.utils'
import { waitForElem } from './elem.utils'
import { isIntersecting } from './general.util'

export const setMuteState = (shouldBeMuted: boolean) => {
    const muteBtn = document.querySelector<HTMLButtonElement>(MUTE_BTN)
    if (!muteBtn) return

    const isMuted = /unmute/i.test(muteBtn.title)

    if (isMuted && !shouldBeMuted) {
        muteBtn.click()
        console.log('unmuting')
    } else if (!isMuted && shouldBeMuted) {
        muteBtn.click()
        console.log('muting')
    }
}

export const skipAdOrDismissBanner = () => {
    const skipAdButton = document.querySelector<HTMLButtonElement>(SKIP_AD_BTN)
    if (skipAdButton) {
        skipAdButton.click()
        console.info('skipping video ad')
    }

    const closeAdBannerButton = document.querySelector<HTMLButtonElement>(CLOSE_AD_BANNER_BTN)
    if (closeAdBannerButton) {
        closeAdBannerButton.click()
        console.info('closing ad banner')
    }
}

export const setupBodyObserver = async () => {
    const bodyObserver = new MutationObserver(e => {
        if (!isOnWatchPage()) return

        const adContainer = document.querySelector(ADS_CONTAINER)
        const adIndicator = document.querySelector(VIDEO_PLAYS_SOON_INDICATOR)
        const adIndicatorText = document.querySelector(VIDEO_PLAYS_SOON_INDICATOR_TEXT)
        const skipAdButton = document.querySelector(SKIP_AD_BTN)

        const mutationTargets = e.map<Node | Element>(record => record.target)
        const adElements = [adContainer, adIndicator, adIndicatorText, skipAdButton].filter(Boolean)

        // if none of the relevant elements changed, we can ignore
        if (!isIntersecting(mutationTargets, adElements)) return

        // if (
        //     !mutationTargets.includes(adContainer) &&
        //     !mutationTargets.includes(adIndicator) &&
        //     !mutationTargets.includes(skipAdButton)
        // ) {
        //     console.log("no ad relevant stuff changed, skipping");
        //     return;
        // }
        console.log('egaging')

        // means there is an ad playing, but we can't skip it
        if (adIndicator && !skipAdButton) {
            // so we simply mute it
            setMuteState(true)
        }
        // no ad playing, we can unmute again
        else if (!adIndicator && !skipAdButton) {
            setMuteState(false)
        }

        skipAdOrDismissBanner()
    })

    const body = await waitForElem('body', 4000) // page should never take 4s to load, but justin case
    if (!body) {
        console.error('Could not find body element')
        return null
    }

    bodyObserver.observe(body, {
        subtree: true,
        childList: true,
    })

    return bodyObserver
}

export const manualSkipHandler = async () => {
    if (!isOnWatchPage()) return

    skipAdOrDismissBanner()
}
