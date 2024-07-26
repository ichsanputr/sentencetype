import Modal from "@mui/material/Modal";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import englishQuotes from "../../languages/english_quotes.json";
import { Typography } from "@mui/material";
import {
  closeSearchModal,
  quoteLengthOptions,
  setSearchQuote,
  categoryOptions
} from "../../store/testSlice";
import SelectBox from "./SelectBox";

type searchResultType = Awaited<ReturnType<typeof searchSentence>>[0];
type quoteType = typeof englishQuotes.quotes[0];

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

function SentenceBox({ sentence }: { sentence: searchResultType | quoteType }) {
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
        "&:hover": {
          backgroundColor: theme.sub.alt,
          transition: "background-color 0.2s ease-in-out",
        },
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
          flex={1}
          sx={{
            display: {
              xs: "none",
              sm: "flex",
            },
          }}
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
        <Box flex={1} display="flex" flexDirection={"column"}>
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
        <Box flex={2} display="flex" flexDirection={"column"}>
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
      </Box>
    </Box>
  );
}

async function searchSentence(category: string, filterLength: string) {
  return [
    { id: 90, source: "kolak", length: 12, text: "koalskalskals" },
    { id: 90, source: "kolak", length: 12, text: "koalskalskals" },
    { id: 90, source: "kolak", length: 12, text: "koalskalskals" },
  ]
}

function SentenceModal() {
  const open = useAppSelector((state) => state.test.searchQuoteModal);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [lengthFilter, setLengthFilter] = useState<string>('');
  const [category, setCategory] = useState<string>('')
  const [searchResults, setSearchResults] = useState<searchResultType[]>([]);

  // get date when filter changed
  useEffect(() => {
    let isCurrent = true;
    searchSentence(category, lengthFilter).then((res) => {
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
          {` result(s)`}
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
            <SentenceBox key={_sentence.id} sentence={_sentence} />
          ))}
        </Box>
      </Box>
    </Modal>
  );
}

export default SentenceModal;
