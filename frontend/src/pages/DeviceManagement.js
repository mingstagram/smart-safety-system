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
    const interval = setInterval(fetchDevices, 5000); // 5초마다 새로 불러오기
    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
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
    // 1. Optimistic Update (화면만 먼저 변경)
    const updatedDevices = devices.map((d) =>
      d.deviceId === deviceId
        ? {
            ...d,
            approved: !approved,
            lastSeen: approved ? null : d.lastSeen, // 승인 해제 시 lastSeen null 처리
          }
        : d
    );
    setDevices(updatedDevices);

    try {
      // 2. 실제 서버 승인 요청
      await approveDevice(deviceId, !approved);
      showSnackbar(`기기 ${!approved ? "승인" : "비승인"} 처리되었습니다.`);
    } catch (error) {
      // 3. 실패 시 롤백
      showSnackbar("기기 승인 처리 중 오류가 발생했습니다.", "error");
      setDevices(devices); // 기존 상태 복원
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
              <TableCell>앱 등록 상태</TableCell>
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

                  {/* 🔥 앱 등록 여부 판단 */}
                  <TableCell>
                    {device.lastSeen ? (
                      <Typography color="success.main" fontWeight={500}>
                        📡 등록됨
                      </Typography>
                    ) : (
                      <Typography color="text.secondary">📴 미등록</Typography>
                    )}
                  </TableCell>
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
