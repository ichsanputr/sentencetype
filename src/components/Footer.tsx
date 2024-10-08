import { Box, Link, useTheme } from "@mui/material";
import Stack from "@mui/material/Stack";
import { FacebookOutlined , Instagram, PaletteRounded} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../store/store";
import { openModal } from "../store/themeSlice";
import ThemeModal from "./ThemeModal";

function Footer() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.theme.theme);
  return (
    <Box
      height={80}
      width={"100%"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"flex-end"}
    >
      <Stack
        height={"20px"}
        width={"100%"}
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Stack direction={"row"} spacing={3}>
          <Link
            target="_blank"
            href="https://www.facebook.com/ichsanputr"
            sx={{
              background: "transparent",
              border: "none",
              color: theme.sub.main,
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "13px",
              "&:hover": {
                color: theme.text.main,
                transition: "all 0.2s ease-in-out",
              },
            }}
          >
            <FacebookOutlined sx={{ padding: "1.5px" }} fontSize="small" />
            Facebook
          </Link>
        </Stack>
        <Stack direction={"row"}>
          <Box
            onClick={() => {
              dispatch(openModal());
            }}
            sx={{
              background: "transparent",
              color: theme.sub.main,
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              cursor: "pointer",
              "&:hover": {
                color: theme.text.main,
                transition: "all 0.2s ease-in-out",
              },
            }}
          >
            <PaletteRounded sx={{ padding: "1.5px" }} fontSize="small" />
            {currentTheme}
          </Box>
        </Stack>
      </Stack>
      <ThemeModal />
    </Box>
  );
}

export default Footer;
