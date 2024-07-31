import Modal from "@mui/material/Modal";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { useTheme } from "@mui/material/styles";
import { Typography, Box, Button } from "@mui/material";
import { QrCodeScanner } from '@mui/icons-material';
import {
  setSearchQuote,
  setShowSubscriptionModal
} from "../../store/testSlice";

type packagesType = {
  id: number,
  text: string,
  source: string | number,
  length: string,
  time: string
};

function PackagesCard({ sentence, active }: { sentence: packagesType, active: boolean }) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  return (
    <Box
      onClick={() => {
        dispatch(setSearchQuote(sentence.text.split(" ")));
      }}
      boxSizing={"border-box"}
      display="grid"
      p={1}
      sx={{
        borderRadius: "10px",
        padding: "16px 24px",
        marginBottom: "1rem",
        width: "100%",
        border: active ? '5px solid' : '',
        borderColor: theme.sub.main,
        backgroundColor: theme.sub.alt,
        transition: "background-color 0.2s ease-in-out",
        cursor: "pointer"
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
      <Typography
        sx={{
          opacity: 0.9,
          lineHeight: "1.5 !important"
        }}
        variant="subtitle2"
        color={theme.sub.main}
      >
        You can undertake all test and use all feature in this app with {sentence.source} month
      </Typography>
      <Typography
        sx={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
        variant="subtitle1"
        marginTop={1}
        color={theme.text.main}
      >
        {sentence.length}
      </Typography>
    </Box>
  );
}

function SubscriptionBoxModal() {
  const open = useAppSelector((state) => state.test.showSubscriptionModal);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [selectedPackage, setSelectedPackage] = useState(0)
  const [packages, setPackages] = useState<packagesType[]>([
    {
      id: 0,
      text: "1 Month",
      source: 1,
      length: "1$ / 10.000 Rp",
      time: "1$ / 10.000 Rp",
    },
    {
      id: 1,
      text: "3 Months",
      source: 3,
      length: "2.5$ / 25.000 Rp",
      time: "90",
    },
    {
      id: 2,
      text: "Lifetime",
      source: "~",
      length: "5$ / 80.000 Rp",
      time: "90",
    }
  ]);

  const handleClose = () => {
    dispatch(setShowSubscriptionModal(false));
  };

  function selectPackage(id: number) {
    setSelectedPackage(id)
  }

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
          display: "block",
          backgroundColor: theme.background.main,
          height: "fit-content",
          gridAutoColumns: "1fr",
          borderRadius: "10px",
          outline: `0.25rem solid ${theme.sub.alt}`,
          padding: {
            xs: "1rem",
            sm: "2rem",
          },
        }}
      >
        <Box marginBottom={"1rem"}>
          <Typography variant="h5" fontWeight={600} color={theme.sub.main}>
            Subscription
          </Typography>
          <Typography variant="subtitle1" sx={{
            marginTop: 1
          }} color={theme.sub.main}>
            You can buy 1 month, 3 months, and lifetime packages on the below.
          </Typography>
        </Box>
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
            display: {
              sm: "flex"
            },
            gap: 3,
            marginTop: 3
          }}
        >
          {packages.map((_sentence) => (
            <div onClick={() => selectPackage(_sentence.id)}>
              <PackagesCard key={_sentence.id} sentence={_sentence} active={selectedPackage == _sentence.id} />
            </div>
          ))}
        </Box>
        <Box marginTop={3} display={{sm: "flex"}} alignItems={"center"} justifyContent="space-between">
          <Typography variant="subtitle2" fontWeight={600} color={theme.sub.main}>
            Pay with Paypal or Qris (Indonesia)
          </Typography>
          <Box display="flex" marginTop={{xs:3,sm: 0}} sx={{
            float: "right"
          }} gap={2}>
            <Button variant="contained">
              Paypal
            </Button>
            <Button variant="contained" sx={{
              alignItems: "center"
            }}>
              <QrCodeScanner fontSize="small" />
              <div style={{ paddingTop: 2, paddingLeft: 4 }}>
                Qris
              </div>
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default SubscriptionBoxModal;
