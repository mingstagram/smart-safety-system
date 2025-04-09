import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { getHealthDataByUserId } from "../api/healthDataService";

const UserDetail = ({ user }) => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  // 심전도 데이터 예시
  const ecgData = [
    { time: '0s', value: 0.2 },
    { time: '1s', value: 0.5 },
    { time: '2s', value: 0.3 },
    { time: '3s', value: 0.8 },
    { time: '4s', value: 0.4 },
    { time: '5s', value: 0.6 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const healthDataResponse = await getHealthDataByUserId(user.id);
        setHealthData(healthDataResponse);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ 
            fontFamily: 'Noto Sans KR',
            fontWeight: 300
          }}
        >
          사용자를 선택해주세요
        </Typography>
      </Box>
    );
  }

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
        p: 3,
        height: "100%",
        overflow: "auto",
        border: "1px solid #e3f2fd",
        borderRadius: 2,
        fontFamily: 'Noto Sans KR'
      }}
    >
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          color: "primary.main",
          fontFamily: 'Noto Sans KR',
          fontWeight: 500,
          mb: 3
        }}
      >
        건강 모니터링 💝
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* 심박수 */}
        <Card elevation={0} sx={{ border: "1px solid #e3f2fd" }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FavoriteIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
              <Typography variant="h6" sx={{ fontFamily: 'Noto Sans KR', fontWeight: 500 }}>
                심박수
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
              {healthData?.heartRate || '--'} <span style={{ fontSize: '1rem' }}>BPM</span>
            </Typography>
          </CardContent>
        </Card>

        {/* 심전도 */}
        <Card elevation={0} sx={{ border: "1px solid #e3f2fd" }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MonitorHeartIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
              <Typography variant="h6" sx={{ fontFamily: 'Noto Sans KR', fontWeight: 500 }}>
                심전도
              </Typography>
            </Box>
            <Box sx={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ecgData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={theme.palette.primary.main} 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        {/* 위치 */}
        <Card elevation={0} sx={{ border: "1px solid #e3f2fd" }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
              <Typography variant="h6" sx={{ fontFamily: 'Noto Sans KR', fontWeight: 500 }}>
                현재 위치
              </Typography>
            </Box>
            <Box sx={{ height: 200, borderRadius: 1, overflow: 'hidden' }}>
              <MapContainer 
                center={[37.5665, 126.9780]} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[37.5665, 126.9780]}>
                  <Popup>
                    현재 위치
                  </Popup>
                </Marker>
              </MapContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Paper>
  );
};

export default UserDetail; 