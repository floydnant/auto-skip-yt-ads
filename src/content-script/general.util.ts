/** Wait for a given amount of time (in ms, of course). */
export const sleep = (duration: number) => new Promise(res => setTimeout(res, duration))

/** Checks if at least one of the elements in `arr2` are also in `arr1`. */
export const isIntersecting = <T>(arr1: T[], arr2: T[]) => {
    return arr2.some(elem => arr1.includes(elem))
}
