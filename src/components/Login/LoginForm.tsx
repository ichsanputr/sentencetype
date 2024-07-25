import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import React, { useState, useEffect, useContext } from "react";
import { LoginRounded, Google } from "@mui/icons-material";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "../../util/firebase";
import UsernameModal from "./UsernameModal";
import { LoginInput, StyledLoginButton } from "./Login";
import { UserContext } from "../../store/userContext";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const { user, username, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && !username) {
      setShowUsernameModal(true);
    }
  }, [user, username, loading]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await signInWithEmailAndPassword(auth, email, password);
  };

  async function signInWithGoogle() {
    try {
      await signInWithPopup(auth, googleAuthProvider);
      setShowUsernameModal(true);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Box
      bgcolor={"transparent"}
      display="flex"
      flexDirection={"column"}
      width={"340px"}
    >
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
          <LoginRounded />
          Sign In
        </StyledLoginButton>
        <span
          style={{
            margin: "8px 0",
            color: theme.text.main,
            fontSize: "0.75rem",
          }}
        >
          Does'nt have account? <span onClick={() => { navigate('/register') }} style={{
            margin: "4px 0",
            color: theme.text.main,
            fontSize: "0.75rem",
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
        <StyledLoginButton onClick={signInWithGoogle}>
          <Google />
          Google Sign In
        </StyledLoginButton>
      </form>
      <UsernameModal
        open={showUsernameModal}
        handleClose={() => setShowUsernameModal(false)}
      />
    </Box>
  );
}

export default LoginForm;
