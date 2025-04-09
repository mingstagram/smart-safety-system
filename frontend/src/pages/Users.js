import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Toolbar,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  getUsers,
  deleteUser,
  updateUser,
  createUser,
} from "../api/userService";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // 'add' or 'edit'
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const theme = useTheme();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(users.map((user) => user.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((item) => item !== id);
    }

    setSelected(newSelected);
  };

  const handleAdd = () => {
    setDialogMode("add");
    setEditUser({
      name: "",
      email: "",
      phone: "",
      password: "",
    });
    setOpenDialog(true);
  };

  const handleEdit = (user) => {
    setDialogMode("edit");
    setEditUser(user);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      fetchUsers();
      setSelected(selected.filter((item) => item !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selected.map((id) => deleteUser(id)));
      fetchUsers();
      setSelected([]);
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  };

  const handleDialogSave = async () => {
    try {
      // 입력값 유효성 검사
      if (
        !editUser.name ||
        !editUser.email ||
        (dialogMode === "add" && !editUser.password)
      ) {
        alert("이름, 이메일, 비밀번호는 필수 입력 항목입니다.");
        return;
      }

      // 이메일 형식 검사
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editUser.email)) {
        alert("올바른 이메일 형식이 아닙니다.");
        return;
      }

      if (dialogMode === "add") {
        await createUser({
          name: editUser.name.trim(),
          email: editUser.email.trim(),
          phone: editUser.phone.trim(),
          password: editUser.password,
        });
      } else {
        await updateUser(editUser.id, {
          name: editUser.name.trim(),
          email: editUser.email.trim(),
          phone: editUser.phone.trim(),
        });
      }

      await fetchUsers();
      setOpenDialog(false);
      setEditUser({
        name: "",
        email: "",
        phone: "",
        password: "",
      });
    } catch (error) {
      console.error("Error saving user:", error);
      alert("사용자 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          border: "1px solid",
          borderColor: theme.palette.divider,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2,
            bgcolor: theme.palette.background.default,
            borderBottom: "1px solid",
            borderColor: theme.palette.divider,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              flex: "1 1 100%",
              fontFamily: "Noto Sans KR",
              fontWeight: 700,
              color: theme.palette.primary.main,
            }}
          >
            사용자 관리 👥
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              sx={{
                minWidth: 120,
                whiteSpace: "nowrap",
              }}
            >
              사용자 추가
            </Button>
            {selected.length > 0 && (
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteSelected}
              >
                선택 삭제
              </Button>
            )}
          </Box>
        </Toolbar>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  padding="checkbox"
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderBottom: "2px solid",
                    borderColor: theme.palette.divider,
                  }}
                >
                  <Checkbox
                    indeterminate={
                      selected.length > 0 && selected.length < users.length
                    }
                    checked={
                      users.length > 0 && selected.length === users.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: "Noto Sans KR",
                    fontWeight: 700,
                    bgcolor: theme.palette.background.default,
                    borderBottom: "2px solid",
                    borderColor: theme.palette.divider,
                  }}
                >
                  이름
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: "Noto Sans KR",
                    fontWeight: 700,
                    bgcolor: theme.palette.background.default,
                    borderBottom: "2px solid",
                    borderColor: theme.palette.divider,
                  }}
                >
                  이메일
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: "Noto Sans KR",
                    fontWeight: 700,
                    bgcolor: theme.palette.background.default,
                    borderBottom: "2px solid",
                    borderColor: theme.palette.divider,
                  }}
                >
                  전화번호
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontFamily: "Noto Sans KR",
                    fontWeight: 700,
                    bgcolor: theme.palette.background.default,
                    borderBottom: "2px solid",
                    borderColor: theme.palette.divider,
                    pr: 3,
                    width: "100px",
                  }}
                >
                  작업
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  selected={selected.indexOf(user.id) !== -1}
                  sx={{
                    "&:last-child td": { borderBottom: 0 },
                    "&.Mui-selected": {
                      backgroundColor: `${theme.palette.primary.light}!important`,
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: `${theme.palette.primary.light}!important`,
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.indexOf(user.id) !== -1}
                      onChange={() => handleSelect(user.id)}
                    />
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Noto Sans KR" }}>
                    {user.name}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Noto Sans KR" }}>
                    {user.email}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Noto Sans KR" }}>
                    {user.phone || "-"}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      pr: 3,
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 0.5,
                    }}
                  >
                    <IconButton
                      onClick={() => handleEdit(user)}
                      color="primary"
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(user.id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Noto Sans KR",
            fontWeight: 700,
            borderBottom: "1px solid",
            borderColor: theme.palette.divider,
            pb: 2,
          }}
        >
          {dialogMode === "add" ? "사용자 추가" : "사용자 수정"}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="이름"
              value={editUser.name}
              onChange={(e) =>
                setEditUser({ ...editUser, name: e.target.value })
              }
              required
              fullWidth
              sx={{
                "& .MuiInputLabel-root": {
                  fontFamily: "Noto Sans KR",
                  fontWeight: 500,
                },
                "& .MuiOutlinedInput-root": {
                  fontFamily: "Noto Sans KR",
                },
              }}
            />
            <TextField
              label="이메일"
              value={editUser.email}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
              required
              type="email"
              fullWidth
              sx={{
                "& .MuiInputLabel-root": {
                  fontFamily: "Noto Sans KR",
                  fontWeight: 500,
                },
                "& .MuiOutlinedInput-root": {
                  fontFamily: "Noto Sans KR",
                },
              }}
            />
            {dialogMode === "add" && (
              <TextField
                label="비밀번호"
                value={editUser.password}
                onChange={(e) =>
                  setEditUser({ ...editUser, password: e.target.value })
                }
                required
                type="password"
                fullWidth
                sx={{
                  "& .MuiInputLabel-root": {
                    fontFamily: "Noto Sans KR",
                    fontWeight: 500,
                  },
                  "& .MuiOutlinedInput-root": {
                    fontFamily: "Noto Sans KR",
                  },
                }}
              />
            )}
            <TextField
              label="전화번호"
              value={editUser.phone}
              onChange={(e) =>
                setEditUser({ ...editUser, phone: e.target.value })
              }
              fullWidth
              sx={{
                "& .MuiInputLabel-root": {
                  fontFamily: "Noto Sans KR",
                  fontWeight: 500,
                },
                "& .MuiOutlinedInput-root": {
                  fontFamily: "Noto Sans KR",
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2.5,
            borderTop: "1px solid",
            borderColor: theme.palette.divider,
          }}
        >
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              fontFamily: "Noto Sans KR",
              fontWeight: 500,
              color: theme.palette.text.secondary,
              px: 2,
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleDialogSave}
            variant="contained"
            sx={{
              fontFamily: "Noto Sans KR",
              fontWeight: 500,
              px: 2,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
