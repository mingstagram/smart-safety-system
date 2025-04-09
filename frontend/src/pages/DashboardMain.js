import React, { useState } from 'react';
import { Box } from '@mui/material';
import UserList from '../components/UserList';
import UserDetail from '../components/UserDetail';

const DashboardMain = () => {
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <Box sx={{ display: 'flex', height: '100%', p: 3 }}>
            <Box sx={{ width: '50%', pr: 1 }}>
                <UserList onSelectUser={setSelectedUser} />
            </Box>
            <Box sx={{ width: '50%', pl: 1 }}>
                <UserDetail user={selectedUser} />
            </Box>
        </Box>
    );
};

export default DashboardMain; 