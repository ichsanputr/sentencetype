import React, { useState } from "react";
import MemoMtLogo from "./MtLogo";
import { Box, IconButton, Stack, Typography, Snackbar, Alert, Tooltip, Avatar, Menu, MenuItem, ListItemIcon, useTheme } from "@mui/material";
import { KeyboardRounded, Logout, History, Login, RedeemRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";
import { resetTest, setHistoryResultModal, setShowKeyboard, setShowSubscriptionModal } from "../store/testSlice";
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
  const [showToastLogout, setShowToastLogout] = useState(false)
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

  function openSubscriptionModal() {
    dispatch(setShowSubscriptionModal(true))
    setAnchorEl(null)
  }

  const navigateLogin = () => {
    window.open("http://localhost:5174?redirect_uri=http://localhost:5173", "_self")
  }

  function handleLogout() {
    signOut(auth)
    setShowToastLogout(true)
    dispatch(resetTest());
  }

  function openKeyboard() {
    if (window.innerWidth >= 900) {
      navigate("/");
      dispatch(resetTest());
    }

    dispatch(setShowKeyboard(!showKeyboard))
  }

  function handleCloseToastLogout() {
    setShowToastLogout(false)
  }

  return (
    <Stack
      padding={"5px 0"}
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Snackbar sx={{
        display: "flex"
      }} open={showToastLogout} autoHideDuration={2000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} onClose={handleCloseToastLogout}>
        <Alert severity="success">Success to logout!</Alert>
      </Snackbar>

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
          <MemoMtLogo height={"28px"} width="28px" fill={theme.caret.main} />
          <Box
            sx={{
              display: {
                sm: "block",
              },
            }}
          >
            <Typography
              fontFamily="Comfortaa"
              fontSize={12}
              variant="caption"
              left={0}
              margin={0}
              color={theme.sub.main}
            >
              lengkapin
            </Typography>
            <Typography fontFamily="Comfortaa" color={theme.text.main} sx={{
              lineHeight: "0.5rem !important",
              fontSize: {
                xs: "24px",
                sm: "24px",
              },
            }}>
              catsentence
            </Typography>
          </Box>
        </Box>
      </Box>
      <Stack direction={"row"} alignItems={"center"} spacing={0}>
        <IconButton
          tabIndex={-1}
          aria-label="Open Button"
          sx={{
            color: theme.sub.main,
            transition: "color 0.2s",
            "&:hover": {
              color: theme.text.main,
            },
            display: {
              xs: "flex",
              sm: "none"
            }
          }}
          onClick={() => {
            openKeyboard()
          }}
        >
          <Tooltip title="Open Keyboard">
            <KeyboardRounded fontSize="medium" />
          </Tooltip>
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <Tooltip title="Account & Other">
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
                width: 6,
                height: 6,
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
              <MenuItem dense sx={{
                alignItems: "center"
              }} onClick={openHistoryResultModal}>
                <History fontSize="small" />
                <Typography sx={{
                  fontSize: 14,
                  marginLeft: 1
                }}>History</Typography>
              </MenuItem>
            )
          }
          {
            username && (
              <MenuItem dense sx={{
                alignItems: "center"
              }} onClick={openSubscriptionModal}>
                <RedeemRounded fontSize="small" />
                <Typography sx={{
                  fontSize: 14,
                  marginLeft: 1
                }}>Subscription</Typography>
              </MenuItem>
            )
          }
          {username ? (
            <MenuItem dense sx={{
              alignItems: "center"
            }} onClick={handleLogout}>
              <Logout fontSize="small" />
              <Typography sx={{
                fontSize: 14,
                marginLeft: 1
              }}>Logout</Typography>
            </MenuItem>
          ) : (
            <MenuItem dense sx={{
              alignItems: "center"
            }} onClick={navigateLogin}>
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
