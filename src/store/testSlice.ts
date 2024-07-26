import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import english from "../languages/english.json";
import news from "../languages/news.json";
import story from "../languages/story.json";
import conversation from "../languages/conversation.json";
import { RootState } from "./store";
import {
  Letter,
  Mode2,
  quoteLengthOptionsType,
  wordLengthOptionsType,
  CategoryType
} from "../typings";
import getRandomInt from "../util/randNumber";

export const wordLengthOptions: wordLengthOptionsType[] = [10, 25, 50, 100];
export const quoteLengthOptions: quoteLengthOptionsType[] = [
  "all",
  "short",
  "medium",
  "long",
  "search",
];
export const categoryOptions: CategoryType[] = [
  "conversation",
  "story",
  "news",
];

function createLetters(words: { text: string, fill: number[] }): Letter[][] {
  const text = words.text.split(" ")

  // Iterate list of word
  return text.map((word, i) => {
    const letters = word.split("");
    return letters.map((l, j) => ({
      hidden: words.fill.includes(i),
      letter: l,
      status: "untouched",
      charIndex: j,
      wordIndex: i,
    })
    );
  });
}

function getCharactersTyped(words: Letter[][]) {
  const chars = {
    correct: 0,
    wrong: 0,
    extra: 0,
  };

  words.forEach((word) => {
    word.forEach((letter) => {
      if (letter.status === "correct") {
        chars.correct += 1;
      } else if (letter.status === "wrong") {
        chars.wrong += 1;
      } else if (letter.status === "extra") {
        chars.extra += 1;
      }
    });
  });

  return chars;
}

interface caretPosition {
  top: number;
  left: number;
}

export interface TestState {
  fillWord: number[],
  isRunning: boolean;
  wordsList: string[];
  currentWords: Letter[][];
  time: 15 | 30 | 60 | 120;
  timerCount: number;
  currentWordIndex: number;
  correctWords: boolean[];
  wpm: number;
  searchQuoteModal: boolean;
  currentCharIndex: number;
  punctuation: boolean;
  numbers: boolean;
  mode2: Mode2;
  wordLength: 10 | 25 | 50 | 100;
  quoteLength: quoteLengthOptionsType;
  showResult: boolean;
  wpmHistory: {
    time: number;
    wpm: number;
  }[];
  rawHistory: {
    time: number;
    wpm: number;
  }[];
  searchQuote: string[] | null;
  caretPosition: caretPosition;
  startTime: Date | null;
  isInputFocused: boolean;
}

const randomizedWords = [...english.words].sort(() => Math.random() - 0.5);

const initialState: TestState = {
  wordsList: randomizedWords,
  currentWords: createLetters(news.words[0]),
  fillWord: [],
  isRunning: false,
  time: 30,
  timerCount: 0,
  wpm: 0,
  currentWordIndex: 0,
  correctWords: [],
  currentCharIndex: 0,
  wordLength: 25,
  mode2: "conversation" as Mode2.conversation,
  punctuation: false,
  numbers: false,
  quoteLength: "all",
  showResult: false,
  wpmHistory: [],
  rawHistory: [],
  searchQuoteModal: false,
  searchQuote: null,
  caretPosition: {
    top: 5,
    left: 0,
  },
  startTime: null,
  isInputFocused: true,
};

export const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    startTest: (state) => {
      state.isRunning = true;
      state.timerCount = 0;
      state.currentWordIndex = 0;
      state.correctWords = [];
      state.showResult = false;
      state.wpmHistory = [];
      state.rawHistory = [];
      state.currentCharIndex = 0;
      state.caretPosition = {
        top: 5,
        left: 0,
      };
      state.startTime = new Date();
    },
    resetTest: (state) => {
      state.isRunning = false;
      state.timerCount = 0;
      state.currentWordIndex = 0;
      state.correctWords = [];
      // state.wordsList =
      //   state.quoteLength === "search"
      //     ? state.wordsList
      //     : getWords(
      //       state.punctuation,
      //       state.numbers,
      //       state.mode2,
      //       state.time,
      //       state.wordLength,
      //       state.quoteLength
      //     );

      // Fill with new word list
      let words: any;

      if (state.mode2 == "conversation") {
        words = conversation.words[getRandomInt(conversation.words.length)]
      } else if (state.mode2 == "story") {
        words = story.words[getRandomInt(conversation.words.length)]
      } else if (state.mode2 == "news") {
        words = news.words[getRandomInt(conversation.words.length)]
      }

      state.wordsList = words!.text.split(" ")
      state.currentWords = createLetters(words!);
      state.fillWord = words!.fill

      state.wpm = 0;
      state.showResult = false;
      state.wpmHistory = [];
      state.rawHistory = [];
      state.currentCharIndex = 0;
      state.caretPosition = {
        top: 5,
        left: 0,
      };
      state.startTime = null;
      state.isInputFocused = true;
    },

    stopTest: (state) => {
      state.isRunning = false;
      state.showResult = true;
      state.caretPosition = {
        top: 5,
        left: 0,
      };
      state.startTime = null;
    },

    setUserText: (state, action: PayloadAction<string>) => {
      if (!state.isRunning) return;

      const typedLetter = action.payload;
      const expectedLetter = state.currentWords[state.currentWordIndex][state.currentCharIndex];

      if (typedLetter === "Backspace") {
        if (state.currentCharIndex === 0) {
          if (state.currentWordIndex === 0) return;
          console.log(9999)
          state.currentWordIndex -= 1;
          let newCharIndex = state.currentWords[state.currentWordIndex].length;

          // while (
          //   state.currentWords[state.currentWordIndex][newCharIndex - 1]
          //     .status === "untouched"
          // ) {
          //   newCharIndex -= 2;
          // }
          state.currentCharIndex = newCharIndex;
          return;
        } else {
          state.currentCharIndex -= 1;

          const isExtra =
            state.currentWords[state.currentWordIndex][state.currentCharIndex]
              .status === "extra";

          if (isExtra) {
            state.currentWords[state.currentWordIndex].pop();
            return;
          }
          state.currentWords[state.currentWordIndex][
            state.currentCharIndex
          ].status = "untouched";
        }

        return;
      }

      // space handle
      if (typedLetter === " ") {
        if (state.currentCharIndex === 0 || state.currentCharIndex != state.currentWords[state.currentWordIndex].length) {
          return;
        }

        let anyWrong = false;

        for (let i = 0; i < state.currentCharIndex; i++) {
          if (state.currentWords[state.currentWordIndex][i].status == "wrong") {
            anyWrong = true
          }
        }

        if (!anyWrong) {
          state.currentWordIndex += 1;
          state.currentCharIndex = 0;
        }

        return;
      }

      if (state.currentWords[state.currentWordIndex].length === state.currentCharIndex) {
        return;
      }

      // checking typed letter user 
      if (expectedLetter.letter === typedLetter) {
        state.currentWords[state.currentWordIndex][
          state.currentCharIndex
        ].status = "correct";

        // show real letter
        state.currentWords[state.currentWordIndex][
          state.currentCharIndex
        ].hidden = false;

        if (state.currentWordIndex + 1 === state.wordsList.length && state.currentCharIndex === state.currentWords[state.currentWordIndex].length - 1) {
          state.showResult = true
        }
      } else {
        state.currentWords[state.currentWordIndex][
          state.currentCharIndex
        ].status = "wrong";
      }

      state.currentCharIndex += 1;
    },

    incrementTimer: (state, action: PayloadAction<NodeJS.Timer>) => {
      state.timerCount += 1;

      if (state.timerCount === 0) {
        state.wpm = state.correctWords.filter(Boolean).length;
      } else {
        state.wpm =
          state.correctWords.filter(Boolean).length / (state.timerCount / 60);
      }
    },
    setInputFocus(state, action: PayloadAction<boolean>) {
      state.isInputFocused = action.payload;
    },
    updateTime(state, action: PayloadAction<15 | 30 | 60 | 120>) {
      state.time = action.payload;
      testSlice.caseReducers.resetTest(state);
    },
    setMode2(state, action: PayloadAction<Mode2>) {
      state.mode2 = action.payload;
      testSlice.caseReducers.resetTest(state);
    },
    togglePunctuation(state) {
      state.punctuation = !state.punctuation;
      testSlice.caseReducers.resetTest(state);
    },
    toggleNumbers(state) {
      state.numbers = !state.numbers;
      testSlice.caseReducers.resetTest(state);
    },
    setWordLength(state, action: PayloadAction<wordLengthOptionsType>) {
      state.wordLength = action.payload;
      testSlice.caseReducers.resetTest(state);
    },
    setQuoteLength(state, action: PayloadAction<quoteLengthOptionsType>) {
      if (action.payload === "search") {
        state.searchQuoteModal = true;
        return;
      }
      state.quoteLength = action.payload;
      testSlice.caseReducers.resetTest(state);
    },
    setSearchQuote(state, action: PayloadAction<string[]>) {
      state.wordsList = action.payload;
      state.searchQuoteModal = false;
      state.quoteLength = "search";
    },
    closeSearchModal(state) {
      state.searchQuoteModal = false;
    },
    setCaretPosition(state, action: PayloadAction<caretPosition>) {
      state.caretPosition = action.payload;
    },

    calculateWMP(state) {
      if (!state.startTime) return;

      let timeElapsed =
        (new Date().getTime() - state.startTime.getTime()) / 1000;

      if (timeElapsed < 1) return;

      timeElapsed = Math.floor(timeElapsed);

      const charsTyped = getCharactersTyped(state.currentWords);
      const wpm = Math.ceil(charsTyped.correct / 4 / (timeElapsed / 60));
      const rawWpm = Math.ceil(
        (charsTyped.correct + charsTyped.wrong + charsTyped.extra) /
        4 /
        (timeElapsed / 60)
      );
      state.wpmHistory.push({
        time: timeElapsed,
        wpm,
      });
      state.rawHistory.push({
        time: timeElapsed,
        wpm: rawWpm,
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  startTest,
  stopTest,
  setUserText,
  incrementTimer,
  resetTest,
  setMode2,
  updateTime,
  togglePunctuation,
  toggleNumbers,
  setWordLength,
  setQuoteLength,
  setSearchQuote,
  closeSearchModal,
  setCaretPosition,
  calculateWMP,
  setInputFocus,
} = testSlice.actions;

export default testSlice.reducer;

export const selectWordsList = (state: RootState) => state.test.wordsList;

export const accuracySelector = (state: RootState) => {
  const { correctWords } = state.test;
  const totalWords = correctWords.length;
  const correctWordsCount = correctWords.filter(Boolean).length;
  return Math.ceil((correctWordsCount / totalWords)) * 100;
};

export const rawSpeedSelector = (state: RootState) => {
  return Math.ceil(
    state.test.correctWords.length / (state.test.timerCount / 60)
  );
};

export const wpmSelector = (state: RootState) => {
  return state.test.wpmHistory[state.test.wpmHistory.length - 1]?.wpm || 0;
};

export const rawWpmSelector = (state: RootState) => {
  return state.test.rawHistory[state.test.rawHistory.length - 1]?.wpm || 1;
};
