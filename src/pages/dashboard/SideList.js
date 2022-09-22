import {
  Analytics,
  Assessment,
  AttachMoneyOutlined,
  BarChartOutlined,
  ChevronLeft,
  Dashboard,
  Home,
  KingBed,
  Logout,
  MarkChatUnread,
  NotificationsActive,
  PeopleAlt,
  PersonOutlineOutlined,
  Report,
  School,
  StorefrontOutlined,
  TimelineOutlined,
  TrendingUpOutlined,
  WorkOutlineOutlined,
  AccountBoxOutlined,
} from "@mui/icons-material";
import BadgeIcon from "@mui/icons-material/Badge";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { useMemo, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useValue } from "../../context/ContextProvider";
import Customer from "./customer/Customer";
import Main from "./main/Main";

import Products from "./products/Products";
import Reports from "./reports/Reports";

import Sales from "./sales/Sales";
import Transactions from "./transactions/Transactions";

import Users from "./users/Users";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const SideList = ({ open, setOpen }) => {
  const [selectedLink, setSelectedLink] = useState("");

  const list = useMemo(
    () => [
      {
        title: "Home",
        icon: <Home />,
        link: "",
        component: <Main {...{ setSelectedLink, link: "" }} />,
      },
      {
        title: "Users",
        icon: <PersonOutlineOutlined />,
        link: "users",
        component: <Users {...{ setSelectedLink, link: "users" }} />,
      },
      {
        title: "Products",
        icon: <StorefrontOutlined />,
        link: "products",
        component: <Products {...{ setSelectedLink, link: "products" }} />,
      },
      {
        title: "Transactions",
        icon: <AttachMoneyOutlined />,
        link: "transactions",
        component: (
          <Transactions {...{ setSelectedLink, link: "transactions" }} />
        ),
      },
      {
        title: "Sales",
        icon: <TrendingUpOutlined />,
        link: "sales",
        component: <Sales {...{ setSelectedLink, link: "sales" }} />,
      },
      {
        title: "Analytics",
        icon: <TimelineOutlined />,
        link: "analytics",
        component: <Analytics {...{ setSelectedLink, link: "analytics" }} />,
      },
      {
        title: "Reports",
        icon: <BarChartOutlined />,
        link: "reports",
        component: <Reports {...{ setSelectedLink, link: "reports" }} />,
      },
      {
        title: "Manage Staff",
        icon: <WorkOutlineOutlined />,
        link: "managestaff",
        component: <Reports {...{ setSelectedLink, link: "managestaff" }} />,
      },
      {
        title: "Customer Profile",
        icon: <AccountBoxOutlined />,
        link: "customerProfile",
        component: (
          <Customer {...{ setSelectedLink, link: "customerProfile" }} />
        ),
      },
    ],
    []
  );

  const navigate = useNavigate();

  const handleLogout = () => {};
  return (
    <>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={() => setOpen(false)}>
            <ChevronLeft />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {list.map((item) => (
            <ListItem key={item.title} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                onClick={() => navigate(item.link)}
                selected={selectedLink === item.link}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ mx: "auto", mt: 3, mb: 1 }}>
          <Tooltip title={"ADMIN NAME"}>
            <Avatar
              src={""}
              {...(open && { sx: { width: 100, height: 100 } })}
            />
          </Tooltip>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          {open && <Typography>{"ADMIN ROLE"}</Typography>}
          <Typography variant="body2">{"Admin"}</Typography>
          {open && <Typography variant="body2">{"admin@gmail.com"}</Typography>}
          <Tooltip title="Logout" sx={{ mt: 1 }}>
            <IconButton onClick={handleLogout}>
              <Logout />
            </IconButton>
          </Tooltip>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Routes>
          {list.map((item) => (
            <Route key={item.title} path={item.link} element={item.component} />
          ))}
        </Routes>
      </Box>
    </>
  );
};

export default SideList;
