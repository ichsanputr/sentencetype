import React, { useContext, useMemo } from "react";
import "./App.css";
import { Box, Container, CircularProgress, Alert, Snackbar } from "@mui/material";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { getTheme } from "./styles/theme";
import { useAppSelector, useAppDispatch } from "./store/store";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Test from "./components/Test/Test";
import { UserContextProvider } from "./store/userContext";
import { useFavicon } from "react-use";
import HistoryModal from "./components/Modals/HistoryModal";
import SubscriptionModal from "./components/Modals/SubscriptionModal";
import { setShowNotLoggedSnackbar } from "./store/testSlice";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    children: [
      { path: "/", element: <Test /> },
      { path: "*", element: "Not Found" },
    ],
  },
]);

function App() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const historyResultModal = useAppSelector((state) => state.test.historyResultModal);
  const showNotLoggedSnackbar = useAppSelector((state) => state.test.showNotLoggedSnackbar);
  const loadingQris = useAppSelector((state) => state.test.loadingQris);

  function handleShowNotLoggedSnackbar() {
    dispatch(setShowNotLoggedSnackbar(false))
  }

  function handleCloseLoadingQris() {
    dispatch(setShowNotLoggedSnackbar(false))
  }

  return (
    <Box
      sx={{
        pt: { xs: 1 },
        pb: { xs: 2 },
      }}
      margin={0}
      width={"100%"}
      minHeight={"100vh"}
      bgcolor={theme.background.main}
      display={"flex"}
      flexDirection={"column"}
      overflow={"hidden"}
    >
      <Container
        disableGutters={false}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          flex: 1,
        }}
      >
        <Navbar />
        <Outlet />
        <Footer />
        {historyResultModal && <HistoryModal />}
        <SubscriptionModal />
        <Snackbar sx={{
          display: "flex"
        }} open={showNotLoggedSnackbar} autoHideDuration={2000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} onClose={handleShowNotLoggedSnackbar}>
          <Alert severity="warning">You need to login to start the test!</Alert>
        </Snackbar>
        <Snackbar sx={{
          display: "flex",
          bottom: 0
        }} open={loadingQris} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} onClose={handleCloseLoadingQris}>
          <Alert severity="success" icon={false} sx={{
            display: "flex"
          }}>
            <CircularProgress size={14} sx={{
              marginRight: 1
            }} color="secondary" />
            Creating your payment..
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export const AppWithTheme = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  const muiTheme = useMemo(() => getTheme(theme), [theme]);

  useFavicon('/favicon.ico');

  return (
    <ThemeProvider theme={muiTheme}>
      <UserContextProvider>
        <RouterProvider router={router} />
      </UserContextProvider>
    </ThemeProvider>
  );
};

export default App;
