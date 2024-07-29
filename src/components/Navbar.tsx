import React from "react";
import MemoMtLogo from "./MtLogo";
import { Box, IconButton, Stack, Typography, Divider, Tooltip, Avatar, Menu, MenuItem, ListItemIcon, useTheme } from "@mui/material";
import { KeyboardRounded, Logout, History, Login } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";
import { resetTest, setHistoryResultModal, setShowKeyboard } from "../store/testSlice";
import { UserContext } from "../store/userContext";
import { signOut } from "firebase/auth";
import { auth } from "../util/firebase";

function Navbar() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const showKeyboard = useAppSelector((state) => state.test.showKeyboard);
  const { username } = React.useContext(UserContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function openHistoryResultModal() {
    dispatch(setHistoryResultModal(true))
    setAnchorEl(null)
  }

  const navigateLogin = () => {
    navigate("/login")
  }

  function handleLogout() {
    signOut(auth)
  }

  function openKeyboard() {
    if (window.innerWidth >= 900) {
      navigate("/");
      dispatch(resetTest());
    }

    dispatch(setShowKeyboard(!showKeyboard))
  }

  return (
    <Stack
      padding={"5px 0"}
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
              top={{
                sm: -4,
                xs: -5
              }}
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
              bottom={{
                xs: -10,
                sm: -6
              }}
              color={theme.sub.main}
            >
              learn english
            </Typography>
            <Typography fontFamily="Comfortaa" color={theme.text.main} variant="h6" sx={{
              fontSize: {
                sm: "2rem",
              }
            }}>
              catsentence
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
            openKeyboard()
          }}
        >
          <KeyboardRounded fontSize="medium" />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <Tooltip title="Settings & Other">
            <IconButton
              onClick={handleClick}
              tabIndex={-1}
              sx={{
                color: theme.sub.main,
                transition: "color 0.2s",
                "&:hover": {
                  color: theme.text.main,
                },
              }}
            >
              <Avatar sx={{ width: 22, height: 22, textTransform: "capitalize", fontSize: "12px", bgcolor: theme.sub.main }}>{username ? username[0] : '?'}</Avatar>
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {
            username && (
              <MenuItem onClick={openHistoryResultModal}>
                <ListItemIcon>
                  <History fontSize="small" />
                </ListItemIcon>
                History
              </MenuItem>
            )
          }
          <Divider />
          {username ? (
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          ) : (
            <MenuItem onClick={navigateLogin}>
              <ListItemIcon>
                <Login fontSize="small" />
              </ListItemIcon>
              Login
            </MenuItem>
          )}
        </Menu>
      </Stack>
    </Stack >
  );
}

export default Navbar;
