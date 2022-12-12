import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Toolbar,
  CssBaseline,
  Typography,
  IconButton,
  MenuItem,
  Menu,
  Button,
  Drawer,
  Badge,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import { AccountCircle, ShoppingCart } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideList from "./SideList";
import { useValue } from "../../context/ContextProvider";
import Cart from "../../components/cart/Cart";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Dashboard() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openCart, setOpenCart] = useState(false);

  const {
    state: { currentUser, cart },
    dispatch,
  } = useValue();

  const darkTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: dark ? "dark" : "light",
          type: "light",
          primary: {
            main: "#000080",
          },
          secondary: {
            main: "#e85611",
          },
        },
      }),
    [dark]
  );

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickOpen = () => {
    setOpenCart(true);
  };

  const handleClickClose = () => {
    setOpenCart(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Fairways Purified Water Station
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleClickOpen}
              color="inherit"
            >
              <Badge badgeContent={cart.length} color="warning">
                <ShoppingCart />
              </Badge>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/");
                  dispatch({ type: "RESET_CURRENT_USER" });
                }}
              >
                Logout
              </MenuItem>
            </Menu>
            {/* <IconButton onClick={() => setDark(!dark)}>
              {dark ? <Brightness7 /> : <Brightness4 />}
            </IconButton> */}
          </Toolbar>
        </AppBar>
        <SideList {...{ open, setOpen }} />
        <Cart
          handleClickOpen={handleClickOpen}
          handleClickClose={handleClickClose}
          openCart={openCart}
        />
      </Box>
    </ThemeProvider>
  );
}
