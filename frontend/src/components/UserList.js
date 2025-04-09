import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  useTheme,
} from "@mui/material";
import { getUsers } from "../api/userService";

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        overflow: "auto",
        border: "1px solid #e3f2fd",
        borderRadius: 2,
      }}
    >
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography
          variant="h5"
          sx={{
            color: "primary.main",
            fontFamily: "Noto Sans KR",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
          }}
        >
          사용자 목록 👥
        </Typography>
      </Box>
      <List sx={{ p: 0 }}>
        {users.map((user, index) => (
          <React.Fragment key={user.id}>
            <ListItem
              button
              onClick={() => onSelectUser(user)}
              sx={{
                py: 2,
                "&:hover": {
                  backgroundColor: "rgba(33, 150, 243, 0.08)",
                },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    fontFamily: "Noto Sans KR",
                    fontWeight: 500,
                  }}
                >
                  {user.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontFamily: "Noto Sans KR",
                      fontWeight: 500,
                      fontSize: "1rem",
                    }}
                  >
                    {user.name}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontFamily: "Noto Sans KR",
                      fontWeight: 400,
                    }}
                  >
                    {user.email}
                  </Typography>
                }
              />
            </ListItem>
            {index < users.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default UserList; 