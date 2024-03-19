import * as React from 'react';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import AuthContext from '../context/AuthContext';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail'
import NotificationsIcon from '@mui/icons-material/Notifications';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';
import AccountMenu from './AccountMenu';

const NavBarLoggedInButtons = () => {


    return (
        <Box
            sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 3.0,
                alignItems: 'center',
            }}
        >
            <Tooltip title="Wiadomości">
                <Badge badgeContent={4} color="primary">
                    <MailIcon color="action" />
                </Badge>
            </Tooltip>
            <Tooltip title="Powiadomienia">
                <Badge badgeContent={3} color="primary">
                    <NotificationsIcon color="action" />
                </Badge>
            </Tooltip>
            <AccountMenu />
        </Box>
    )
}

export default NavBarLoggedInButtons