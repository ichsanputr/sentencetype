import React from "react";
import { useAppSelector } from "../../store/store";
import { Box } from "@mui/material";
import TestResult from "./TestResult";
import ModesStack from "./ModesStack";
import TestBox from "./TestBox";
import SentenceModal from "../Modals/SentenceModal";
import HistoryModal from "../Modals/HistoryModal";

function Test() {
  const showResult = useAppSelector((state) => state.test.showResult);

  return (
    <Box display={"flex"} flexDirection={"column"} flex={1} my={"24px"}>
      {showResult ? (
        <TestResult />
      ) : (
        <>
          <ModesStack />
          <TestBox />
          <SentenceModal />
          <HistoryModal />
        </>
      )}
    </Box>
  );
}

export default Test;
