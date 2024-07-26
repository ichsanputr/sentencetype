export type TimeOptionsType = 15 | 30 | 60 | 120;

export type Mode = "punctuation" | "numbers";

export enum Mode2 {
  conversation = "conversation",
  story = "story",
  news = "news",
}

export type wordLengthOptionsType = 10 | 25 | 50 | 100;
export type quoteLengthOptionsType =
  | "all"
  | "short"
  | "medium"
  | "long"
  | "search";
export type CategoryType =
  | "conversation"
  | "story"
  | "news"

export type CustomTheme = {
  bgColor: string;
  caretColor: string;
  mainColor: string;
  subColor: string;
  subAltColor: string;
  textColor: string;
  errorColor: string;
  errorExtraColor: string;
  colorfulErrorColor: string;
  colorfulErrorExtraColor: string;
};

export type HistoryType = {
  time: number;
  wpm: number;
};


export interface Letter {
  hidden: boolean;
  letter: string;
  status: "correct" | "wrong" | "extra" | "untouched";
  wordIndex: number;
  charIndex: number;
}