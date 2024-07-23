import React from "react";
import MemoMtLogo from "./MtLogo";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { PersonRounded, KeyboardRounded, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/store";
import { resetTest } from "../store/testSlice";
import { UserContext } from "../store/userContext";
import { signOut } from "firebase/auth";
import { auth } from "../util/firebase";

function Navbar() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { username } = React.useContext(UserContext);
  return (
    <Stack
      padding={" 5px 0"}
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Box
        padding={0}
        display={"flex"}
        flexDirection={"row"}
        gap={1}
        color={"white"}
        alignItems={"center"}
      >
        <Box
          onClick={() => navigate("/")}
          display={"flex"}
          alignItems={"center"}
          gap={1}
          sx={{
            cursor: "pointer",
          }}
        >
          <MemoMtLogo height={"24px"} width="28px" fill={theme.caret.main} />
          <Box
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },
            }}
            position={"relative"}
          >
            <Typography
              fontFamily="Comfortaa"
              fontSize={10}
              variant="caption"
              position={"absolute"}
              left={0}
              top={-8}
              color={theme.sub.main}
            >
              fill sentences
            </Typography>
            <Typography
              fontFamily="Comfortaa"
              fontSize={10}
              variant="caption"
              position={"absolute"}
              right={0}
              bottom={-12}
              color={theme.sub.main}
            >
              learn english
            </Typography>
            <Typography fontFamily="Comfortaa" color={theme.text.main} variant="h4">
              sentencetype
            </Typography>
          </Box>
        </Box>
      </Box>
      <Stack direction={"row"} alignItems={"center"} spacing={0}>
        <IconButton
          tabIndex={-1}
          sx={{
            color: theme.sub.main,
            transition: "color 0.2s",
            "&:hover": {
              color: theme.text.main,
            },
          }}
          onClick={() => {
            navigate("/");
            dispatch(resetTest());
          }}
        >
          <KeyboardRounded fontSize="medium" />
        </IconButton>
        <Box
          sx={{
            color: theme.sub.main,
            transition: "color 0.2s",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            "&:hover": {
              color: theme.text.main,
            },
          }}
        >
          {username && (
            <>
              <PersonRounded fontSize="small" />
              <Typography
                sx={{
                  marginLeft: 1 / 2,
                }}
                variant="body2"
              >
                {username}
              </Typography>
            </>
          )}
        </Box>

        <IconButton
          tabIndex={-1}
          sx={{
            color: theme.sub.main,
            transition: "color 0.2s",
            "&:hover": {
              color: theme.text.main,
            },
          }}
          onClick={() => {
            if (username) {
              signOut(auth);
            }
            navigate("/login");
          }}
        >
          {username ? (
            <Logout fontSize="small" />
          ) : (
            <PersonRounded fontSize="medium" />
          )}
        </IconButton>
      </Stack>
    </Stack>
  );
}

export default Navbar;
