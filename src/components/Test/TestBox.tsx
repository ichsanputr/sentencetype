import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import TestWords from "./TestWords";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  incrementTimer,
  resetTest,
  setInputFocus,
  setUserText,
  startTest,
} from "../../store/testSlice";
import { Stack, Typography, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton/IconButton";
import { Refresh } from "@mui/icons-material";
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

function TestBox() {
  const dispatch = useAppDispatch();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const isRunning = useAppSelector((state) => state.test.isRunning);
  const currentWordIndex = useAppSelector((state) => state.test.currentWordIndex);
  const wordsList = useAppSelector((state) => state.test.wordsList);
  const showKeyboard = useAppSelector((state) => state.test.showKeyboard);
  const timerCount = useAppSelector((state) => state.test.timerCount);
  const theme = useTheme();
  const time = useAppSelector((state) => state.test.time);
  const mode2 = useAppSelector((state) => state.test.mode2);
  const isInputFocused = useAppSelector((state) => state.test.isInputFocused);
  const [layout, setLayout] = useState(false);

  useEffect(() => {
    let id: NodeJS.Timer;
    if (isRunning) {
      id = setInterval(() => {
        dispatch(incrementTimer(id));
      }, 1000);

      return () => {
        clearInterval(id);
      };
    }
  }, [isRunning, dispatch, mode2]);

  const processInput = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isCharacter = /^[a-zA-Z!@#$%^&*()_+\-=[\]{};':"\\|,.<>/ ?]$/.test(
      e.key
    );

    if (isCharacter && !isRunning) {
      dispatch(startTest());
    }

    if (isCharacter || e.key === "Backspace") {
      // Set user text
      dispatch(setUserText(e.key));
    }
  };

  useEffect(() => {
    if (isInputFocused) {
      inputRef.current?.focus();
    }
  }, [isInputFocused]);

  const onKeyPress = (e: any) => {
    if (e == "{bksp}") {
      e = "Backspace"
    } else if (e == "{space}") {
      e = " "
    } else if (e == "{lock}") {
      e = "CapsLock"
      setLayout(!layout)
    } else {
      if (layout) {
        setLayout(!layout)
      }
    }

    const isCharacter = /^[a-zA-Z!@#$%^&*()_+\-=[\]{};':"\\|,.<>/ ?]$/.test(
      e
    );

    if (isCharacter && !isRunning) {
      dispatch(startTest());
    }

    if (isCharacter || e === "Backspace") {
      // Set user text
      dispatch(setUserText(e));
    }
  }

  const keyboardLayout = {
    'default': [
      'q w e r t y u i o p',
      'a s d f g h j k l',
      '{lock} z x c v b n m {bksp}',
      ', {space} .'
    ],
    'lock': [
      'Q W E R T Y U I O P',
      'A S D F G H J K L',
      '{lock} Z X C V B N M {bksp}',
      ', {space} .'
    ],
  }

  return (
    <Box
      sx={{
        justifySelf: "center",
        margin: { sm: "auto 0" },
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* 1/18 Word success typed */}
      <Stack
        sx={{
          opacity:
            document.activeElement === inputRef.current || timerCount >= time
              ? 1
              : 0,
        }}
        direction={"row"}
        justifyContent={"space-between"}
      >
        <Typography
          sx={{
            opacity: timerCount > 0 ? 1 : 0,
          }}
          variant="h5"
          color={theme.main.main}
        >
          {`${currentWordIndex}/${wordsList.length}`}
        </Typography>
      </Stack>

      <TestWords />
      {showKeyboard && <Keyboard
        className={`${showKeyboard ? 'show-keyboard' : 'hide-keyboard'}`}
        display={{
          '{enter}': 'enter',
          '{bksp}': 'bksp',
          '{lock}': 'caps',
          '{space}': 'space',
        }}
        layout={keyboardLayout}
        layoutName={!layout ? 'default' : 'lock'}
        onKeyPress={onKeyPress}
      />}
      {/* Input to handle what user type */}
      <label>
        <input
          ref={inputRef}
          aria-label="Input"
          autoCapitalize="off"
          autoCorrect="off"
          name="mobileInput"
          autoComplete="off"
          className="hide-mobile"
          style={{
            width: "5%",
            opacity: 0,
          }}
          onKeyDown={processInput}
          autoFocus
          onBlur={() => {
            dispatch(setInputFocus(false));
          }}
        />
      </label>

      {/* Tooltip Restart Test */}
      <Tooltip
        placement="left"
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: theme.sub.alt,
              color: theme.main.main,
              fontSize: "1rem",
              padding: "4px 1rem",
              fontFamily: "Comfortaa"
            },
          },
          arrow: {
            sx: {
              color: theme.sub.alt,
            },
          },
        }}
        arrow
        title="New Test"
      >
        <IconButton
          tabIndex={0}
          onClick={() => {
            dispatch(resetTest());
          }}
          sx={{ margin: "12px auto", padding: "8px" }}
        >
          <Refresh htmlColor={theme.sub.main} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default TestBox;
