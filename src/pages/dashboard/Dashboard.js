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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Autocomplete,
  Grid,
  Avatar,
  TextField,
  DialogActions,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import {
  AccountCircle,
  Close,
  SaveOutlined,
  ShoppingCart,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideList from "./SideList";
import { useValue } from "../../context/ContextProvider";
import Cart from "../../components/Cart";
import { db_firestore } from "../../api/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import FormInput from "../../components/form/FormInput";
import { getImageUrl, uploadImage } from "../../utils/uploadImage";
import Swal from "sweetalert2";

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
  const [roleValue, setRoleValue] = useState(null);
  const [statusValue, setStatusValue] = useState(null);
  const emailRef = useRef();
  const passwordRef = useRef();
  const phoneNumberRef = useRef();

  const {
    state: { currentUser, cart, cartDialog, openProfile, user, loading },
    dispatch,
  } = useValue();

  // console.log("dash 56:", currentUser.role);

  const darkTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: dark ? "dark" : "light",
          type: "light",
          primary: {
            main: "#010080",
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
    dispatch({ type: "CLOSE_PROFILE" });
    dispatch({ type: "RESET_USER" });
  };

  const handleClickOpen = () => {
    // setOpenCart(true);
    dispatch({ type: "OPEN_CART" });
  };

  const handleClickClose = () => {
    // setOpenCart(false);
    dispatch({ type: "CLOSE_CART" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const washingtonRef = doc(db_firestore, "users", currentUser.id);

      let url;
      if (user.file) {
        const imageRef = await uploadImage("images/users/profile", user.file);
        url = await getImageUrl(imageRef);
      }

      await updateDoc(washingtonRef, {
        email: user.email,
        name: user.name,
        password: user.password,
        phoneNumber: user.phoneNumber,
        photoUrl: url || user.photoUrl,
        role: user.role,
        status: user.status,
      });
      Swal.fire({
        text: "Successfully Save",
        icon: "success",
        confirmButtonText: "OK",
      });

      handleClose();
    } catch (error) {
      console.log(error);
      Swal.fire({
        text: error.code.split("/").pop(),
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleProfileShow = async () => {
    const docRef = doc(db_firestore, "users", currentUser.id);
    const docSnap = await getDoc(docRef);
    console.log(docSnap);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      user.id = docSnap.data().id;
      user.name = docSnap.data().name;

      user.email = docSnap.data().email;
      user.password = docSnap.data().password;
      user.phoneNumber = docSnap.data().phoneNumber;
      user.photoUrl = docSnap.data().photoUrl;
      user.role = docSnap.data().role;
      user.status = docSnap.data().status;
      dispatch({ type: "OPEN_PROFILE" });
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  const handleChangeAutoComplete = (e, newValue) => {
    setRoleValue(newValue.label);
    const str = e.target.id;

    const newStr = str.split("-")[0];

    dispatch({
      type: "UPDATE_USER",
      payload: { [newStr]: newValue.label },
    });
  };

  const handleChangeAutoComplete2 = (e, newValue) => {
    setStatusValue(newValue.label);
    const str = e.target.id;

    const newStr = str.split("-")[0];

    dispatch({
      type: "UPDATE_USER",
      payload: { [newStr]: newValue.label },
    });
  };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const photoUrl = URL.createObjectURL(file);
      console.log(photoUrl);
      dispatch({
        type: "UPDATE_USER",
        payload: { ...user, file, photoUrl },
      });
    }
  };

  const handleChange = (e) => {
    dispatch({
      type: "UPDATE_USER",
      payload: { [e.target.id]: e.target.value },
    });
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
              <MenuItem onClick={handleProfileShow}>Profile</MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/");
                  dispatch({ type: "RESET_CURRENT_USER" });
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <SideList {...{ open, setOpen }} />
        <Cart
          handleClickOpen={handleClickOpen}
          handleClickClose={handleClickClose}
          openCart={cartDialog}
        />
      </Box>

      <Dialog onClose={handleClose} open={openProfile} fullWidth maxWidth="lg">
        <DialogTitle>
          User Information
          <IconButton
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={handleClose}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent dividers={true}>
            <DialogContentText>
              Please fill user information in the fields :
            </DialogContentText>
            <Grid container justifyContent="center" alignItems="center">
              <Grid item>
                <label htmlFor="profilePhoto">
                  <input
                    accept="image/*"
                    id="profilePhoto"
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleChangeImage}
                  />
                  <Avatar
                    src={user.photoUrl}
                    sx={{ width: 250, height: 250, cursor: "pointer" }}
                  />
                </label>
              </Grid>

              <FormInput
                required
                fullWidth
                type="text"
                id="name"
                label="Name"
                name="name"
                onChange={handleChange}
                value={user.name}
                xs={12}
                sm={12}
                // inputRef={nameRef}
              />
              <FormInput
                required
                fullWidth
                type="email"
                id="email"
                label="email"
                name="email"
                onChange={handleChange}
                value={user.email}
                inputRef={emailRef}
                xs={12}
                sm={12}
              />
              <FormInput
                required
                fullWidth
                type="password"
                id="password"
                label="Password"
                name="password"
                onChange={handleChange}
                value={user.password}
                inputRef={passwordRef}
                xs={12}
                sm={12}
              />
              <FormInput
                required
                fullWidth
                type="phoneNumber"
                id="phoneNumber"
                label="phoneNumber"
                name="phoneNumber"
                onChange={handleChange}
                value={user.phoneNumber}
                inputRef={phoneNumberRef}
                xs={12}
                sm={12}
              />

              {currentUser.Encoder === "Admin" ? (
                <>
                  <Grid item xs={6} sm={6} p={1}>
                    <Autocomplete
                      options={roleBox}
                      renderInput={(params) => (
                        <TextField {...params} label="Role" />
                      )}
                      value={user.role ? user.role : roleValue}
                      onChange={(e, newValue) =>
                        handleChangeAutoComplete(e, newValue)
                      }
                      disablePortal
                      id="role"
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} p={1}>
                    <Autocomplete
                      options={statusOption}
                      renderInput={(params) => (
                        <TextField {...params} label="Status" />
                      )}
                      value={user.status ? user.status : statusValue}
                      onChange={(e, newValue) =>
                        handleChangeAutoComplete2(e, newValue)
                      }
                      disablePortal
                      id="status"
                    />
                  </Grid>
                </>
              ) : null}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: "19px" }}>
            <Button
              type="submit"
              variant="contained"
              color="success"
              endIcon={<SaveOutlined />}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </ThemeProvider>
  );
}

const roleBox = [{ label: "Admin" }, { label: "Endcoder" }];

const statusOption = [{ label: "Active" }, { label: "Banned" }];
