import React, { useState } from "react";
import { Box, Grid, Tooltip, Typography, useTheme, Snackbar, CircularProgress, Alert } from "@mui/material";
import IconButton from "@mui/material/IconButton/IconButton";
import { TurnedInNot, NavigateNext } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from "../../store/store";
import { collection, doc, writeBatch, arrayUnion } from "firebase/firestore";
import { firestore } from "../../util/firebase";
import { useUserData } from "../../hooks/useUserData";

import {
  rawWpmSelector,
  resetTest,
  wpmSelector,
} from "../../store/testSlice";

function TestResult() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const wpm = useAppSelector(wpmSelector);
  const rawWpm = useAppSelector(rawWpmSelector);
  const accuracy = Math.round(wpm / rawWpm * 100);
  const timerCount = useAppSelector((state) => state.test.timerCount);
  const sentence = useAppSelector((state) => state.test.wordsList);
  const fillWord = useAppSelector((state) => state.test.fillWord);
  const currentSentenceId = useAppSelector((state) => state.test.currentWordId);
  const [showLoadingSave, setShowLoadingSave] = useState(false);
  const [showAlertSaveSuccess, setShowAlertSaveSuccess] = useState(false);
  const mode2 = useAppSelector((state) => state.test.mode2);
  const { user } = useUserData();

  function handleClose() {
    setShowAlertSaveSuccess(false)
  }

  async function handleSaveResult() {
    setShowLoadingSave(true)
    try {
      const userDoc = doc(collection(firestore, "result"), user!.email as string);
      const batch = writeBatch(firestore);

      batch.update(userDoc, {
        sentences: arrayUnion({
          id: currentSentenceId,
          time: timerCount,
          category: mode2
        }),
      });

      await batch.commit();
      setShowAlertSaveSuccess(true)
    } catch (e) {
      console.log(e);
    }

    setShowLoadingSave(false)
  }

  return (
    <Box
      sx={{
        margin: "auto 0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Snackbar sx={{
        display: "flex"
      }} open={showLoadingSave} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} onClose={handleClose}>
        <Box
          sx={{ bgcolor: "#379777", padding: "4px 1rem", display: "flex", alignItems: "center", margin: "auto 0", borderRadius: "0.75rem" }}
        >
          <CircularProgress size={18} />
          <Typography sx={{
            color: "white",
            marginLeft: "8px",
            fontSize: "14px"
          }}>
            Saving the result...
          </Typography>
        </Box>
      </Snackbar>
      <Snackbar sx={{
        display: "flex"
      }} open={showAlertSaveSuccess} autoHideDuration={2000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} onClose={handleClose}>
        <Alert severity="success">Result success saved</Alert>
      </Snackbar>
      <Grid container spacing={2}>
        <Grid
          sx={{
            display: "flex",
            flexDirection: {
              xs: "row",
              sm: "column"
            },
            justifyContent: "space-between",
            padding: 0,
            gap: 3
          }}
          item
          xs={12}
          md={2}
        >
          <Box display={"flex"} flexDirection={"column"} >
            <Typography
              sx={{
                fontSize: {
                  xs: "1.25rem",
                  sm: "1.75rem"
                },
                lineHeight: "1",
              }}
              variant="h4"
              color={theme.sub.main}
            >
              words
            </Typography>
            <Typography
              sx={{
                fontSize: {
                  xs: "2.75rem",
                  sm: "3rem"
                },
                lineHeight: "1",
                marginBottom: "0.5rem",
              }}
              variant="h2"
              color={theme.main.main}
            >
              {sentence.length}
            </Typography>
          </Box>
          <Box display={"flex"} flexDirection={"column"} >
            <Typography
              sx={{
                fontSize: {
                  xs: "1.25rem",
                  sm: "1.75rem"
                },
                lineHeight: "1",
              }}
              variant="h4"
              color={theme.sub.main}
            >
              time
            </Typography>
            <Typography
              sx={{
                fontSize: {
                  xs: "2.75rem",
                  sm: "3rem"
                },
                lineHeight: "1",
                marginBottom: "0.5rem",
              }}
              variant="h2"
              color={theme.main.main}
            >
              {timerCount.toString()}<span className="second">s</span>
            </Typography>
          </Box>
          <Box marginBottom={"1rem"}  >
            <Typography
              sx={{
                fontSize: {
                  xs: "1.25rem",
                  sm: "1.75rem"
                },
                lineHeight: "1",
              }}
              variant="h4"
              color={theme.sub.main}
            >
              acc
            </Typography>
            <Typography
              sx={{
                fontSize: {
                  xs: "2.75rem",
                  sm: "3rem"
                },
                lineHeight: "1",
              }}
              variant="h2"
              color={theme.main.main}
            >
              {accuracy}%
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={10} sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <Box boxSizing={"border-box"}>
            <Typography
              sx={{
                fontSize: {
                  xs: "1.25rem",
                  sm: "1.5rem"
                },
                lineHeight: "1",
                paddingBottom: "4px",
                wordBreak: "break-word",
                textAlign: "center",
              }}
              color={theme.main.main}
            >
              {sentence.map((v, i) => (
                <span className={fillWord.includes(i) ? 'result-word word-highlight' : 'result-word'}>
                  {v}
                </span>
              ))}
            </Typography>
          </Box>
          <Box>
            <Tooltip
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: theme.sub.alt,
                    color: theme.main.main,
                    fontSize: "1rem",
                    padding: "4px 1rem",
                  },
                },
                arrow: {
                  sx: {
                    color: theme.sub.alt,
                  },
                },
              }}
              arrow
              title="Next test"
            >
              <IconButton
                tabIndex={1}
                onClick={() => {
                  dispatch(resetTest());
                  // inputRef.current?.focus();
                }}
                focusRipple={true}
                sx={{
                  margin: "1.5rem auto",
                  padding: "8px 0.75rem",
                  borderRadius: "20px",
                  color: theme.sub.main,
                  "&:hover": {
                    backgroundColor: theme.main.main,
                    color: theme.sub.alt,
                  },
                }}
              >
                <NavigateNext fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: theme.sub.alt,
                    color: theme.main.main,
                    fontSize: "1rem",
                    padding: "4px 1rem",
                  },
                },
                arrow: {
                  sx: {
                    color: theme.sub.alt,
                  },
                },
              }}
              arrow
              title="Save"
            >
              <IconButton
                tabIndex={1}
                onClick={handleSaveResult}
                focusRipple={true}
                sx={{
                  margin: "1.5rem auto",
                  padding: "8px 0.75rem",
                  borderRadius: "20px",
                  color: theme.sub.main,
                  "&:hover": {
                    backgroundColor: theme.main.main,
                    color: theme.sub.alt,
                  },
                }}
              >
                <TurnedInNot fontSize="medium" />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TestResult;
