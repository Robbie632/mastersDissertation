import { ENV_VARS } from "../env";

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

export async function calculate_similarity(a, b, userDetails) {

    const response = await fetch(`${ENV_VARS.REACT_APP_SERVER_IP}/api/metric`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": userDetails["token"]
      },
      body: JSON.stringify({
        phrasea: a,
        phraseb: b,
      }),
    });
    if (response.status !== 200) {
      alert("problem getting similarity metric");
    } else {
      const metric = await response.json();
      const metric_list = metric["metric"];
      return metric_list[0];
    }
  };


  export class ShuffleWord {
    constructor(word, id) {
      this.word = word;
      this.id = id
    }
    getWord(){
      return this.word;
    }
    getId() {
      return this.id;
    }
  }

