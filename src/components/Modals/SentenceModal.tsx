import Modal from "@mui/material/Modal";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import englishQuotes from "../../languages/english_quotes.json";
import news from "../../languages/news.json";
import story from "../../languages/story.json";
import conversation from "../../languages/conversation.json";
import { Typography } from "@mui/material";
import {
  closeSearchModal,
  quoteLengthOptions,
  setSearchQuote,
  categoryOptions,
  setSelectedSentenceId,
  resetTest
} from "../../store/testSlice";
import SelectBox from "./SelectBox";

type searchResultType = {
  id: number,
  text: string,
  source: string,
  length: number,
};

function getSentenceGroup(length: number) {
  const allGroups = ["short", "medium", "long"];
  const groupRange = englishQuotes.groups;
  const quoteRangeMap = {} as Record<string, [number, number]>;
  allGroups.forEach((group, index) => {
    quoteRangeMap[group] = [groupRange[index][0], groupRange[index][1]];
  });

  const quoteGroup = allGroups.find((group) => {
    const [min, max] = quoteRangeMap[group];
    return length >= min && length <= max;
  });

  return quoteGroup;
}

function SentenceBox({ sentence }: { sentence: searchResultType }) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  return (
    <Box
      onClick={() => {
        dispatch(setSearchQuote(sentence.text.split(" ")));
      }}
      boxSizing={"border-box"}
      display="flex"
      flexDirection={"column"}
      p={1}
      sx={{
        cursor: "pointer",
        borderRadius: "10px",
        padding: "16px 24px",
        marginBottom: "1.5rem",
        backgroundColor: theme.sub.alt,
        transition: "background-color 0.2s ease-in-out",
      }}
    >
      <Typography
        sx={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          WebkitLineClamp: {
            xs: 2,
            sm: 3,
          },
        }}
        variant="body1"
        color={theme.text.main}
      >
        {sentence.text}
      </Typography>
      <Box
        display="flex"
        flexDirection={"row"}
        justifyContent={"space-between"}
      >
        <Box
          flexDirection={"column"}
        >
          <Typography
            sx={{
              opacity: 0.5,
            }}
            color={theme.sub.main}
          >
            id
          </Typography>
          <Typography color={theme.sub.main}>{sentence.id}</Typography>
        </Box>
        <Box display="flex" flexDirection={"column"}>
          <Typography
            sx={{
              opacity: 0.5,
            }}
            color={theme.sub.main}
          >
            category
          </Typography>
          <Typography color={theme.sub.main}>{sentence.source}</Typography>
        </Box>
        <Box display="flex" flexDirection={"column"}>
          <Typography
            sx={{
              opacity: 0.5,
            }}
            color={theme.sub.main}
          >
            length
          </Typography>
          <Typography color={theme.sub.main}>
            {getSentenceGroup(sentence.length)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

async function searchSentence(category: string, filterLength: string) {
  let wordsCategory = null

  if (category == "conversation") {
    wordsCategory = conversation.words
  } else if (category == "story") {
    wordsCategory = story.words
  } else if (category == "news") {
    wordsCategory = news.words
  }

  if (filterLength.length > 0) {
    wordsCategory = wordsCategory!.filter(v => {
      return v.category == filterLength
    })
  }

  return wordsCategory?.map(v => {
    let arrText: any = v.text.split(" ")

    arrText = arrText.map((j: string, k: number) => {
      if (v.fill.includes(k)) {
        j = "__"
      }

      return j
    })

    return {
      id: v.id,
      source: v.category,
      text: arrText.join(" "),
      length: v.text.split(" ").length
    }
  })
}

function SentenceModal() {
  const open = useAppSelector((state) => state.test.searchQuoteModal);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [lengthFilter, setLengthFilter] = useState<string>('medium');
  const [category, setCategory] = useState<string>('story')
  const [searchResults, setSearchResults] = useState<searchResultType[]>([]);

  // get date when filter changed
  useEffect(() => {
    let isCurrent = true;
    searchSentence(category, lengthFilter).then((res: any) => {
      // store array of sentence to state
      if (isCurrent) setSearchResults(res);
    });
    return () => {
      isCurrent = false;
    };
  }, [category, lengthFilter]);

  const handleClose = () => {
    dispatch(closeSearchModal());
  };

  function handleSelectSentence(id: number) {
    dispatch(setSelectedSentenceId(id));
    dispatch(resetTest())
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      componentsProps={{
        backdrop: {
          sx: {
            // background: "transparent",
          },
        },
      }}
    >
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80vw",
          maxWidth: "1000px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: theme.background.main,
          height: "80vh",
          borderRadius: "10px",
          outline: `0.25rem solid ${theme.sub.alt}`,
          padding: {
            xs: "1rem",
            sm: "2rem",
          },
        }}
      >
        {/* Head */}
        <Box marginBottom={"1rem"}>
          <Typography variant="h5" color={theme.sub.main}>
            Sentence Search
          </Typography>
        </Box>
        {/* search and filter input */}
        <Box
          display={"flex"}
          flexDirection={"row"}
          gap={"1rem"}
          sx={{
            flexDirection: {
              xs: "column",
              sm: "row",
            },
          }}
        >
          <SelectBox
            selectedItems={category}
            setSelectedItems={setCategory}
            inputLabel={"Filter by category"}
            items={categoryOptions}
          />
          <SelectBox
            selectedItems={lengthFilter}
            setSelectedItems={setLengthFilter}
            inputLabel={"Filter by length"}
            items={quoteLengthOptions.filter(
              (q) => q !== "search" && q !== "all"
            )}
          />
        </Box>
        <Typography
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
          }}
          color={theme.sub.main}
          textAlign={"center"}
          mt={1}
        >
          {searchResults.length}
          {` results`}
        </Typography>
        <Box
          overflow={"auto"}
          mt={1}
          sx={{
            "&::-webkit-scrollbar": {
              width: "0.5em",
            },
            "&::-webkit-scrollbar-track": {
              boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
              webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.sub.main,
              borderRadius: "10px",
            },
          }}
        >
          {searchResults.slice(0, 100).map((_sentence) => (
            <div onClick={() => handleSelectSentence(_sentence.id)}>
              <SentenceBox key={_sentence.id} sentence={_sentence} />
            </div>
          ))}
        </Box>
      </Box>
    </Modal>
  );
}

export default SentenceModal;
