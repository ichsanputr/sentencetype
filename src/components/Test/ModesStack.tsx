import { EmojiPeople, Article, AutoStories } from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/store";
import type { Mode2 } from "../../typings";
import Search from "@mui/icons-material/Search";
import {
  openSearchModal,
  quoteLengthOptions,
  setMode2,
  setQuoteLength,
} from "../../store/testSlice";

const CustomButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>(({ theme, active }) => ({
  textTransform: "none",
  backgroundColor: "transparent",
  color: active ? theme.main.main : theme.sub.main,
  outline: "none",
  border: "none",
  fontWeight: "lighter",
  fontSize: "12px",
  borderRadius: "8px",
  lineHeight: "1.25",
  width: "auto",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  transitionDuration: "0.1s",
  transitionProperty: "color",
  transitionTimingFunction: "ease-in-out",
  "&:hover": {
    color: theme.text.main,
  },
  "&:active": {
    color: theme.main.main,
  },
}));

const ButtonContainer = styled(Stack)(({ theme }) => ({
  borderRadius: "8px",
  "&>*": {
    padding: "12px 8px 11px",
  },

  "&>:first-of-type": {
    padding: "12px 8px 11px 16px",
  },
  "& > :last-child": {
    padding: "12px 16px 11px 8px",
  },

  "&:not(:last-child) > :last-child": {
    "&::after": {
      content: "''",
      height: "60%",
      width: "4px",
      position: "absolute",
      right: 0,
      top: "20%",
      backgroundColor: theme.background.main,
    },
  },
  backgroundColor: "transparent",
  flexDirection: "row",
  alignItems: "center",
}));

function ModesStack() {
  const theme = useTheme();
  const isRunning = useAppSelector((state) => state.test.isRunning);
  const mode2 = useAppSelector((state) => state.test.mode2);
  const quoteLength = useAppSelector((state) => state.test.quoteLength);
  const dispatch = useAppDispatch();

  return (
    <Stack
      sx={{
        flexDirection: {
          xs: "column",
          md: "row",
        },
        alignItems: {
          xs: "center",
          md: "center",
        },
        backgroundColor: theme.sub.alt,
        margin: "0 auto",
        color: theme.sub.main,
        borderRadius: "8px",
        justifySelf: "flex-start",
        transition: "all 0.5s ease-in-out",
        "@keyframes fadeOut": {
          "0%": {
            opacity: 1,
          },
          "100%": {
            opacity: 0,
          },
        },
        "@keyframes fadeIn": {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        animation: isRunning
          ? "fadeOut 0.5s ease-in-out forwards"
          : "fadeIn 0.5s ease-in-out forwards",
      }}
    >
      <ButtonContainer>
        <CustomButton
          active={mode2 === "conversation"}
          onClick={() => dispatch(setMode2("conversation" as Mode2.conversation))}
        >
          <EmojiPeople fontSize="small" sx={{ padding: 0.2 }} />
          conversation
        </CustomButton>
        <CustomButton
          active={mode2 === "story"}
          onClick={() => dispatch(setMode2("story" as Mode2.story))}
        >
          <AutoStories fontSize="small" sx={{ padding: 0.2 }} />
          story
        </CustomButton>
        <CustomButton
          active={mode2 === "news"}
          onClick={() => dispatch(setMode2("news" as Mode2.news))}
        >
          <Article fontSize="small" sx={{ padding: 0.2 }} />
          news
        </CustomButton>
      </ButtonContainer>
      <ButtonContainer>
        {
          quoteLengthOptions.map((w) => {
            return (
              <CustomButton
                key={w}
                active={w === quoteLength}
                onClick={() => dispatch(setQuoteLength(w))}
              >
                {w}
              </CustomButton>
            );
          })}
        <CustomButton key={3} onClick={() => dispatch(openSearchModal())}>
          <Search
            sx={{
              fontSize: "16px",
            }}
          />
        </CustomButton>
      </ButtonContainer>
    </Stack>
  );
}

export default ModesStack;
