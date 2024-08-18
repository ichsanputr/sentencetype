export type Mode = "punctuation" | "numbers";

export enum Mode2 {
  common = "common",
  story = "story",
  news = "news",
}

export type quoteLengthOptionsType =
  | "short"
  | "medium"
  | "long"
  | "search"
export type CategoryType =
  | "common"
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
};


export interface Letter {
  hidden: boolean;
  letter: string;
  status: "correct" | "wrong" | "extra" | "untouched";
  wordIndex: number;
  charIndex: number;
}