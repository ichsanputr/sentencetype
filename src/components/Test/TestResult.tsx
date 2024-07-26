import React from "react";
import { Box, Grid, Tooltip, Typography, useTheme, Snackbar, Alert, CircularProgress } from "@mui/material";
import IconButton from "@mui/material/IconButton/IconButton";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  rawWpmSelector,
  resetTest,
  wpmSelector,
  closeLoadingSaveResult
} from "../../store/testSlice";

function TestResult() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const wpm = useAppSelector(wpmSelector);
  const rawWpm = useAppSelector(rawWpmSelector);
  const accuracy = Math.round(wpm / rawWpm * 100);
  const timerCount = useAppSelector((state) => state.test.timerCount);
  const sentence = useAppSelector((state) => state.test.wordsList);
  const showLoadingSave = useAppSelector((state) => state.test.showLoadingSaveResult);
  const fillWord = useAppSelector((state) => state.test.fillWord);

  function handleClose() {
    dispatch(closeLoadingSaveResult())
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
          sx={{bgcolor: "#379777", padding: "4px 1rem", display: "flex", alignItems: "center", margin: "auto 0", borderRadius: "0.75rem" }}
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
                <NavigateNextIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TestResult;
