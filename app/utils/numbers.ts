/**
 * Custom price formatter.
 * @param number Number to be formatted, if it's not a number, it will be converted to a string and the first letter is made capital
 * @param currency Optional currency
 * @returns Custom number format eg. 15000 would become 15.000,00 or 'gratis' would become 'Gratis'
 */
export const priceFormatter = (number: number | string, currency?: string) => {
    // If the value does not return as a string or a number, or if it's undefined or null
    // Return an error
    if (number === undefined || number === null) {
        console.error('Invalid number or string, please check your input for possible null or undefined');
        return "";
    }
    
    const convertedNumber = Number(number);

    if (!isNaN(convertedNumber)) {
        let price = convertedNumber
            .toFixed(2) // Always leave two decimals, even if it's 0
            .replace(/\./g, ',') // Find and replace any period with a comma
            .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.'); // Replace the thousand separator with a comma

        if (currency) {
            price += ` ${currency}`;
        }
        return price;
    }

    return String(number).charAt(0).toUpperCase() + String(number).slice(1);
}


/**
 * Check if a value is even
 * @param value
 * @returns boolean
 */
export const isEven = (value: number): boolean => {
    return value % 2 === 0;
}
