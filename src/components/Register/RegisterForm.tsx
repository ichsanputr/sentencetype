import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { PersonAddAltRounded, Google } from "@mui/icons-material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore, googleAuthProvider } from "../../util/firebase";
import { collection, doc, writeBatch } from "firebase/firestore";
import useCheckUsername from "../../hooks/useCheckUsername";
import { useNavigate } from "react-router-dom";
import {
  LoginInput,
  StyledLoginButton,
  validateEmail,
  validatePassword,
} from "./Register";

function RegisterForm() {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const { username, isValid, loading, onChange } = useCheckUsername();
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const navigate = useNavigate()

  async function registerHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password || !username || !verifyPassword) {
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userDoc = doc(collection(firestore, "users"), user.uid);
      const usernameDoc = doc(collection(firestore, "usernames"), username);
      const batch = writeBatch(firestore);
      batch.set(userDoc, {
        username: username,
      });
      batch.set(usernameDoc, { uid: user.uid });

      await batch.commit();
    } catch (e) {
      console.log(e);
    }
  }

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
      <Typography color={theme.text.main} variant="h6" sx={{
        marginBottom: "1rem",
        fontSize: "1.5rem"
      }}>
        Register to CatSentence
      </Typography>
      <form
        onSubmit={registerHandler}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <LoginInput
          value={username}
          onChange={onChange}
          placeholder="username"
          status={
            username.length > 0
              ? loading
                ? "loading"
                : isValid
                  ? "correct"
                  : "wrong"
              : undefined
          }
          message={
            username.length < 3
              ? "username must be at least 3 characters"
              : "username already taken"
          }
        />
        <LoginInput
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          status={
            email.length > 0
              ? validateEmail(email)
                ? "correct"
                : "wrong"
              : undefined
          }
          message={"invalid email"}
        />
        <LoginInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="password"
          status={
            password.length > 0
              ? validatePassword(password)
                ? "correct"
                : "wrong"
              : undefined
          }
          message={
            password.length < 8
              ? "password must be at least 8 characters"
              : "password must contain at least 1 number, 1 uppercase, and 1 lowercase letter"
          }
        />
        <LoginInput
          value={verifyPassword}
          type={"password"}
          onChange={(e) => setVerifyPassword(e.target.value)}
          placeholder="retype password"
          status={
            password.length > 0
              ? password === verifyPassword
                ? "correct"
                : "wrong"
              : undefined
          }
          message="passwords must match"
        />
        <StyledLoginButton type={"submit"}>
          <PersonAddAltRounded />
          Sign Up
        </StyledLoginButton>
        <span
          style={{
            margin: "8px 0",
            color: theme.text.main,
            fontSize: "0.75rem",
          }}
        >
          Already have account? <span onClick={() => { navigate('/login') }} style={{
            margin: "4px 0",
            color: theme.text.main,
            fontSize: "0.75rem",
            textDecoration: "underline",
            cursor: "pointer"
          }}>Login</span>
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
          Google Sign Up
        </StyledLoginButton>
      </form>
    </Box>
  );
}
export default RegisterForm;
