/**
 *returns a random subset of array of length size 
 */
export function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}
/**
 * 
 * cleans phrase
 */
export function processPhrase(text) {
    if (text.size == 0) {
        return text;
    } 
    text = text.toLowerCase().replace("ö", "o").replace("ä", "a").replace("å", "a")
    const regex = /[.,\/#?!$%\^&\*;:{}=\-_`~()]/g;
    text = text.replace(regex, "")
    return text;
}