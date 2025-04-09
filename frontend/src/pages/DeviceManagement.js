import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { getDevices, approveDevice } from "../api/deviceService"; // ⛳️ API 따로 만들기

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const data = await getDevices(); // API 호출
      setDevices(data || []);
    } catch (error) {
      showSnackbar("기기 목록을 불러오지 못했습니다.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (deviceId, approved) => {
    try {
      await approveDevice(deviceId, !approved);
      showSnackbar(`기기 ${!approved ? "승인" : "비승인"} 처리되었습니다.`);
      fetchDevices();
    } catch (error) {
      showSnackbar("기기 승인 처리 중 오류가 발생했습니다.", "error");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography
        variant="h5"
        fontFamily="Noto Sans KR"
        fontWeight={700}
        gutterBottom
      >
        사용자 디바이스 등록 📱
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>기기 ID</TableCell>
              <TableCell>승인 상태</TableCell>
              <TableCell>등록 일자</TableCell>
              <TableCell align="right">작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {devices.length > 0 ? (
              devices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>{device.deviceId}</TableCell>
                  <TableCell>
                    {device.approved ? "✅ 승인됨" : "❌ 미승인"}
                  </TableCell>
                  <TableCell>
                    {new Date(device.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color={device.approved ? "error" : "primary"}
                      onClick={() =>
                        handleApprove(device.deviceId, device.approved)
                      }
                    >
                      {device.approved ? "승인 해제" : "승인하기"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary" fontFamily="Noto Sans KR">
                    등록된 기기가 없습니다.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DeviceManagement;
