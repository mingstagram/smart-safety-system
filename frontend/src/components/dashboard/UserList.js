import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemButton, Typography, Box } from '@mui/material';
import { getUsers } from '../../api/userService';

const UserList = ({ onSelectUser }) => {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsers();
                setUsers(response);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleUserClick = (user) => {
        setSelectedUserId(user.id);
        onSelectUser(user);
    };

    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <Typography variant="h6" sx={{ p: 2 }}>
                사용자 목록
            </Typography>
            <List>
                {users.map((user) => (
                    <ListItem key={user.id} disablePadding>
                        <ListItemButton
                            selected={selectedUserId === user.id}
                            onClick={() => handleUserClick(user)}
                        >
                            <ListItemText
                                primary={user.name}
                                secondary={`${user.email} - ${user.role}`}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default UserList; 