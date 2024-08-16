import { Box, Typography, CircularProgress, Snackbar, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useState, useEffect, useContext } from "react";
import { LoginRounded, Google } from "@mui/icons-material";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "../../util/firebase";
import UsernameModal from "./UsernameModal";
import { LoginInput, StyledLoginButton } from "./Login";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider } from "firebase/auth";

function LoginForm() {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogging, setIsLogging] = useState(false);
  const [showToastError, setShowToastError] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLogging(true)

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLogging(false)
    } catch (e) {
      console.log(e)
      setShowToastError(true)
      setIsLogging(false)
    }
  };

  async function signInWithGoogle() {
    try {
      const data = await signInWithPopup(auth, googleAuthProvider);

      const credential = GoogleAuthProvider.credentialFromResult(data);
      const token = credential?.accessToken;

      if (token){
        localStorage.setItem('token', token);
      }

      setShowUsernameModal(true);
    } catch (e) {
      console.log(e);
    }
  }

  function handleCloseToastError() {
    setShowToastError(false)
  }

  return (
    <Box
      bgcolor={"transparent"}
      display="flex"
      flexDirection={"column"}
      width={"340px"}
    >
      <Snackbar sx={{
        display: "flex"
      }} open={showToastError} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} onClose={handleCloseToastError}>
        <Alert severity="error">Incorrect username or password</Alert>
      </Snackbar>
      <Typography color={theme.text.main} sx={{
        marginBottom: "1rem",
        fontSize: "1.5rem"
      }} variant="h6">
        Login to CatSentence
      </Typography>
      <form
        onSubmit={submitHandler}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <LoginInput
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          status={undefined}
        />
        <LoginInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="password"
          status={undefined}
        />
        <StyledLoginButton>
          {isLogging ? (
            <CircularProgress sx={{
              color: "black"
            }} size={18} />
          ) : <Box sx={{
            display: "flex",
            alignItems: "center"
          }}>
            <LoginRounded sx={{
              width: "20px",
              marginRight: "4px"
            }} />
            Login
          </Box>}
        </StyledLoginButton>
        <span
          style={{
            margin: "8px 0",
            color: theme.text.main,
            fontSize: "0.75rem",
          }}
        >
          Doesn't have account? <span onClick={() => { navigate('/register') }} style={{
            margin: "4px 0",
            color: theme.text.main,
            fontSize: "0.8rem",
            fontWeight: 700,
            textDecoration: "underline",
            cursor: "pointer"
          }}>Register</span>
        </span>
        <span
          style={{
            margin: "4px auto",
            color: theme.text.main,
            fontSize: "0.75rem",
          }}
        >
          or
        </span>
      </form>
      <StyledLoginButton onClick={signInWithGoogle}>
        <Google />
        Login with Google
      </StyledLoginButton>
      <UsernameModal
        open={showUsernameModal}
        handleClose={() => setShowUsernameModal(false)}
      />
    </Box>
  );
}

export default LoginForm;
