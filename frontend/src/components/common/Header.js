import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../api/authService';

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Traveloo Dashboard
                </Typography>
                <Box>
                    <Button color="inherit" onClick={handleLogout}>
                        로그아웃
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header; 