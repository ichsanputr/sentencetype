import { Mode2, quoteLengthOptionsType } from "../typings";
import english from "../languages/english.json";
import englishQuotes from "../languages/english_quotes.json";
import { quoteLengthOptions } from "../store/testSlice";

const { groups, quotes } = englishQuotes;
export function getWords(
  punctuation: boolean,
  numbers: boolean,
  mode2: Mode2,
  time: number,
  wordLength: number,
  quoteLength: quoteLengthOptionsType
) {
  let words = [...english.words];
  return getQuote(quoteLength).split(" ");
}

function getQuote(length: quoteLengthOptionsType) {
  const groupIndex = quoteLengthOptions.findIndex((x) => x === length);

  const group = groups[groupIndex - 1];
  const newQuotes = [...quotes].filter(
    (x) => group[0] <= x.length && x.length <= group[1]
  );
  return newQuotes[Math.floor(Math.random() * newQuotes.length)].text;
}

export function punctuations(words: string[]) {
  const punctuation = [",", ".", "!", "?", ";", ":", "()", "''"];
  const newWords = [...words];
  for (let i = 0; i < newWords.length; i++) {
    if (Math.random() < 0.6) {
      if (Math.random() < 0.4) {
        const r = punctuation[Math.floor(Math.random() * punctuation.length)];
        if (r === "()") {
          newWords[i] = "(" + newWords[i] + ")";
        } else if (r === "''") {
          newWords[i] = "'" + newWords[i] + "'";
        } else {
          newWords[i] = newWords[i] + r;
        }
      } else {
        newWords[i] =
          newWords[i].charAt(0).toUpperCase() + newWords[i].slice(1);
      }
    }
  }
  return newWords;
}

export function numbersMode(words: string[]): string[] {
  let newWordsString = "";
  for (let i = 0; i < words.length; i++) {
    newWordsString += words[i];
    if (Math.random() < 0.2) {
      let numOfDigits = Math.floor(Math.random() * 3) + 1;
      let randomNumber = Math.floor(Math.random() * Math.pow(10, numOfDigits));
      newWordsString += " " + randomNumber;
    }
    newWordsString += " ";
  }
  return newWordsString.split(" ");
}
