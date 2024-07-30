import Modal from "@mui/material/Modal";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { Typography } from "@mui/material";
import {
  setSearchQuote,
  closeHistoryResultModal
} from "../../store/testSlice";
import { firestore } from "../../util/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useUserData } from "../../hooks/useUserData";
import findSentence from "../../util/findSentence";

type searchResultType = {
  id: number,
  text: string,
  source: string,
  length: number,
  time: string
};

function HistoryBox({ sentence }: { sentence: searchResultType }) {
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
        borderRadius: "10px",
        padding: "16px 24px",
        marginBottom: "1rem",
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
            time
          </Typography>
          <Typography color={theme.sub.main}>{sentence.time}s</Typography>
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
            kolak
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function HistoryModal() {
  const open = useAppSelector((state) => state.test.historyResultModal);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { user } = useUserData();
  const [searchResults, setSearchResults] = useState<searchResultType[]>([]);

  const handleClose = () => {
    dispatch(closeHistoryResultModal());
  };

  useEffect(() => {
    console.log("makan")
    if (user?.email) {
      const collectionRef = doc(firestore, "result", user.email);
      getDoc(collectionRef).then(v => {
        if (v.exists()) {
          let data = v.data()

          let result = data.sentences.map((v: any) => {
            let sentence = findSentence(v.id, v.category)
            return {
              id: v.id,
              text: sentence.text,
              source: v.category,
              time: v.time,
            }
          })

          setSearchResults(result)
        } else {
          console.log("No such document!");
        }
      })
    }
  }, [user, open])

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
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
        <Box marginBottom={"1rem"}>
          <Typography variant="h5" color={theme.sub.main}>
            History Result
          </Typography>
        </Box>
        <Typography
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
          }}
          color={theme.sub.main}
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
            <HistoryBox key={_sentence.id} sentence={_sentence} />
          ))}
        </Box>
      </Box>
    </Modal>
  );
}

export default HistoryModal;
