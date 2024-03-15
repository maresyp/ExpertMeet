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

export function DrawerLoggedIn() {
    return (
        <Box
            sx={{
                minWidth: '60dvw',
                p: 2,
                backgroundColor: 'background.paper',
                flexGrow: 1,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'end',
                    flexGrow: 1,
                }}
            >
            </Box>
            <MenuItem>
                Features
            </MenuItem>
            <Divider />
            <MenuItem>
                <Button
                    color="primary"
                    variant="contained"
                    component="a"
                    href="/material-ui/getting-started/templates/sign-up/"
                    target="_blank"
                    sx={{ width: '100%' }}
                >
                    Wyloguj się
                </Button>
            </MenuItem>
        </Box>
    )
}

const NavBarLoggedInButtons = () => {
    const { logoutUser, user } = React.useContext(AuthContext)

    const logoutHandler = () => {
        logoutUser()
    }

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
            <Avatar alt="U" src={`http://127.0.0.1:8080/api/profile/get_avatar/${user.profile_id}`} />
            <Button onClick={logoutHandler}
                color="primary"
                variant="contained"
                size="small"
                component="a"
                href="#"
            >
                Wyloguj się
            </Button>
        </Box>
    )
}

export default NavBarLoggedInButtons