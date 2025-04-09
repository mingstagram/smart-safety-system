import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import { getHealthDataByUserId } from '../../api/healthDataService';
import { getAlertsByUserId } from '../../api/alertService';

const UserDetail = ({ user }) => {
    const [healthData, setHealthData] = useState(null);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                try {
                    const [healthResponse, alertsResponse] = await Promise.all([
                        getHealthDataByUserId(user.id),
                        getAlertsByUserId(user.id)
                    ]);
                    setHealthData(healthResponse[0] || null);
                    setAlerts(alertsResponse);
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                }
            };
            fetchData();
        }
    }, [user]);

    if (!user) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>사용자를 선택해주세요</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                {user.name}의 상세 정보
            </Typography>
            
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                기본 정보
                            </Typography>
                            <Typography>이메일: {user.email}</Typography>
                            <Typography>역할: {user.role}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                최근 생체 데이터
                            </Typography>
                            {healthData ? (
                                <>
                                    <Typography>심박수: {healthData.heartRate} bpm</Typography>
                                    <Typography>걸음수: {healthData.steps} steps</Typography>
                                    {healthData.latitude && healthData.longitude && (
                                        <Typography>
                                            위치: {healthData.latitude}, {healthData.longitude}
                                        </Typography>
                                    )}
                                </>
                            ) : (
                                <Typography>데이터가 없습니다</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                알림
                            </Typography>
                            {alerts.length > 0 ? (
                                alerts.map((alert) => (
                                    <Paper key={alert.id} sx={{ p: 2, mb: 2 }}>
                                        <Typography>타입: {alert.alertType}</Typography>
                                        <Typography>값: {alert.value}</Typography>
                                        <Typography>상태: {alert.resolved ? '해결됨' : '미해결'}</Typography>
                                    </Paper>
                                ))
                            ) : (
                                <Typography>알림이 없습니다</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default UserDetail; 