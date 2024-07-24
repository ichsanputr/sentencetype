import Box from "@mui/material/Box";
import React, { useEffect } from "react";
import TestWords from "./TestWords";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  calculateWMP,
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

function TestBox() {
  const dispatch = useAppDispatch();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const isRunning = useAppSelector((state) => state.test.isRunning);
  const currentWordIndex = useAppSelector((state) => state.test.currentWordIndex);
  const wordsList = useAppSelector((state) => state.test.wordsList);
  const timerCount = useAppSelector((state) => state.test.timerCount);
  const theme = useTheme();
  const time = useAppSelector((state) => state.test.time);
  const mode2 = useAppSelector((state) => state.test.mode2);
  const isInputFocused = useAppSelector((state) => state.test.isInputFocused);

  useEffect(() => {
    let id: NodeJS.Timer;
    if (isRunning) {
      id = setInterval(() => {
        dispatch(incrementTimer(id));
        dispatch(calculateWMP());
      }, 1000);

      return () => {
        clearInterval(id);
      };
    }
  }, [isRunning, dispatch, mode2]);

  const processInput = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isCharacter = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/ ?]$/.test(
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

  return (
    <Box
      sx={{
        justifySelf: "center",
        margin: "auto 0",
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

      {/* Input to handle what user type */}
      <input
        ref={inputRef}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
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
        title="Restart Test"
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
