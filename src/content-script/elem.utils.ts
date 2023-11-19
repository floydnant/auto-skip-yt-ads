import { sleep } from './general.util'

export const waitForElem = async (selector: string, timeout = 300) => {
    const elems = await waitForElems(selector, timeout)

    return elems[0] || null
}

/** Wait for elements with the given selector to appear on the page. */
export const waitForElems = async (selector: string, timeout = 300) => {
    //                                      min                max
    const intervalDelay = Math.min(Math.max(50, timeout / 60), 600)
    let elems: NodeListOf<Element> | null = null
    let i = 0

    // keep querying in intervals
    while (!elems?.length) {
        elems = document.querySelectorAll(selector)

        if (elems?.length) break
        if (i * intervalDelay >= timeout) {
            console.warn(`Could not find any elements within ${timeout}ms:`, selector)
            break
        }

        await sleep(intervalDelay)
        i++
    }

    return elems
}
