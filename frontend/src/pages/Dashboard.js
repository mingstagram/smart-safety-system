import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Typography,
  Button,
  Collapse,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, Outlet } from "react-router-dom";
import UserList from "../components/UserList";
import UserDetail from "../components/UserDetail";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const drawerWidth = "20%"; // 2/10 of the screen width

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [openSettings, setOpenSettings] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleMenuClick = (item) => {
    if (item.subItems) {
      setOpenSettings(!openSettings);
    } else {
      navigate(item.path);
    }
  };

  const menuItems = [
    { text: "대시보드 📊", path: "/dashboard", icon: <DashboardIcon /> },
    { text: "사용자 👥", path: "/dashboard/users", icon: <PeopleIcon /> },
    { text: "알림 🔔", path: "/dashboard/alerts", icon: <NotificationsIcon /> },
    {
      text: "설정 ⚙️",
      path: "/dashboard/settings",
      icon: <SettingsIcon />,
      subItems: [
        { text: "관리자 관리 👤", path: "/dashboard/settings/admins" },
        {
          text: "사용자 디바이스 등록 📱",
          path: "/dashboard/settings/devices",
        },
      ],
    },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: theme.palette.background.default,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Noto Sans KR",
              fontWeight: 700,
              fontSize: "1.5rem",
              color: theme.palette.primary.main,
            }}
          >
            스마트 안전 관리
          </Typography>
        </Box>
        <List>
          {menuItems.map((item) => (
            <React.Fragment key={item.text}>
              <ListItem
                button
                onClick={() => handleMenuClick(item)}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontFamily: "Noto Sans KR",
                      fontWeight: 500,
                    },
                  }}
                />
                {item.subItems &&
                  (openSettings ? <ExpandLess /> : <ExpandMore />)}
              </ListItem>
              {item.subItems && (
                <Collapse in={openSettings} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItem
                        key={subItem.text}
                        button
                        onClick={() => navigate(subItem.path)}
                        sx={{
                          pl: 4,
                          minHeight: 40,
                          "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        <ListItemText
                          primary={subItem.text}
                          sx={{
                            "& .MuiListItemText-primary": {
                              fontFamily: "Noto Sans KR",
                              fontWeight: 500,
                              fontSize: "0.9rem",
                            },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <List>
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              minHeight: 48,
              px: 2.5,
              color: theme.palette.error.main,
              "&:hover": {
                backgroundColor: theme.palette.error.light,
                color: theme.palette.error.dark,
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="로그아웃"
              sx={{
                "& .MuiListItemText-primary": {
                  fontFamily: "Noto Sans KR",
                  fontWeight: 500,
                },
              }}
            />
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
