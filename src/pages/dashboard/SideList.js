import {
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
  SpeedOutlined,
  InventoryOutlined,
  PaymentOutlined,
  Inventory2Outlined,
  PointOfSaleOutlined,
  PaymentsOutlined,
  // Inventory2Outlined,
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
import Analytics from "./analytics/Analytics";
import Customer from "./customer/Customer";
import Expenses from "./expenses/Expenses";
import Inventory from "./inventory/Inventory";
import Main from "./main/Main";
import Meter from "./meter/Meter";
import Pos from "./pos/Pos";

import Products from "./products/Products";
import Reports from "./reports/Reports";

import Sales from "./sales/Sales";
import ManageStaff from "./staff/ManageStaff";
import Stock from "./stock/Stock";
import Transactions from "./transactions/Transactions";

import Users from "./users/Users";

const drawerWidth = 240;

const colorIcon = (theme) => ({
  color: "#000080",
});

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

  const {
    state: { currentUser },
    dispatch,
  } = useValue();

  const list = useMemo(() => [
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
      icon: <PaymentOutlined />,
      link: "transactions",
      component: (
        <Transactions {...{ setSelectedLink, link: "transactions" }} />
      ),
    },

    {
      title: "Manage Staff",
      icon: <WorkOutlineOutlined />,
      link: "managestaff",
      component: <ManageStaff {...{ setSelectedLink, link: "managestaff" }} />,
    },
    {
      title: "Customer Profile",
      icon: <AccountBoxOutlined />,
      link: "customerProfile",
      component: <Customer {...{ setSelectedLink, link: "customerProfile" }} />,
    },
    {
      title: "Meter Reading",
      icon: <SpeedOutlined />,
      link: "meterReading",
      component: <Meter {...{ setSelectedLink, link: "meterReading" }} />,
    },
    {
      title: "Stock",
      icon: <Inventory2Outlined />,
      link: "stock",
      component: <Stock {...{ setSelectedLink, link: "stock" }} />,
    },
    {
      title: "POS",
      icon: <PointOfSaleOutlined />,
      link: "pos",
      component: <Pos {...{ setSelectedLink, link: "pos" }} />,
    },
    {
      title: "Expenses",
      icon: <PaymentsOutlined />,
      link: "expenses",
      component: <Expenses {...{ setSelectedLink, link: "expenses" }} />,
    },
  ]);

  const listEncoder = useMemo(() => [
    {
      title: "Customer Profile",
      icon: <AccountBoxOutlined />,
      link: "customerProfile",
      component: <Customer {...{ setSelectedLink, link: "customerProfile" }} />,
    },

    {
      title: "Meter Reading",
      icon: <SpeedOutlined />,
      link: "meterReading",
      component: <Meter {...{ setSelectedLink, link: "meterReading" }} />,
    },
    {
      title: "POS",
      icon: <PointOfSaleOutlined />,
      link: "pos",
      component: <Pos {...{ setSelectedLink, link: "pos" }} />,
    },
  ]);

  const navigate = useNavigate();

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
          {currentUser.role === "Admin"
            ? list.map((item) => (
                <ListItem
                  key={item.title}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      borderRadius: 3,
                      marginLeft: 1,
                      marginRight: 1,
                    }}
                    onClick={() => navigate(item.link)}
                    selected={selectedLink === item.link}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color: selectedLink === item.link ? "#2065D1" : "",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      sx={{
                        opacity: open ? 1 : 0,
                        color: selectedLink === item.link ? "#2065D1" : "",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            : listEncoder.map((item) => (
                <ListItem
                  key={item.title}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      borderRadius: 3,
                      marginLeft: 1,
                      marginRight: 1,
                    }}
                    onClick={() => navigate(item.link)}
                    selected={selectedLink === item.link}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color: selectedLink === item.link ? "#2065D1" : "",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      sx={{
                        opacity: open ? 1 : 0,
                        color: selectedLink === item.link ? "#2065D1" : "",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
        </List>
        <Divider />
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
