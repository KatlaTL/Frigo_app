/**
 * Debounce wrapper functions.
 * Used to ensure that the function is not called until a specificed amount of time has passed since it was last invoked. For example of an API call
 * @param func - Function to be wrapped
 * @param wait - Time to wait before allowing the next function call in milliseconds
 */
export const debounce = <T extends (...agrs: any[]) => any>(func: T, wait: number = 250): (...args: Parameters<T>) => void => {
    let timeoutId: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, wait);
    }
}

/**
 * Throttle wrapper functions.
 * Used to prevent multiple function calls in quick succesion. For example of an API call
 * @param func - Function to be wrapped
 * @param wait - Time to wait before allowing the next function call in milliseconds
 */
export const throttle = <T extends (...args: any[]) => any>(func: T, wait: number = 250): (...args: Parameters<T>) => void => {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
        if (!timeout) {
            func(...args);
            timeout = setTimeout(() => {
                timeout = null;
            }, wait)
        }
    }
}