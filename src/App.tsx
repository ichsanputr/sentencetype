import React, { useContext, useMemo } from "react";
import "./App.css";
import { Box, Container } from "@mui/material";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { getTheme } from "./styles/theme";
import { useAppSelector } from "./store/store";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Test from "./components/Test/Test";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import { UserContext, UserContextProvider } from "./store/userContext";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "./util/firebase";
import GoogleOneTapLogin from "react-google-one-tap-login";
import { useFavicon } from "react-use";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    children: [
      { path: "/", element: <Test /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "*", element: "Not Found" },
    ],
  },
]);

function App() {
  const theme = useTheme();
  const { user, loading } = useContext(UserContext);

  return (
    <Box
      sx={{
        py: { xs: 2 },
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
      </Container>
      {!user && !loading && (
        <GoogleOneTapLogin
          onError={(error: any) => console.log(error)}
          onSuccess={(response: any) => console.log(response)}
          googleAccountConfigs={{
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID!,
            callback: async ({ clientId, credential, select_by }) => {
              const googleCredential =
                GoogleAuthProvider.credential(credential);
              await signInWithCredential(auth, googleCredential);
            },
          }}
          disabled={!!user}
        />
      )}
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
