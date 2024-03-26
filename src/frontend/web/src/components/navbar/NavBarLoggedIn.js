import * as React from 'react';
import Box from '@mui/material/Box';
import AccountMenu from '../AccountMenu';
import Notifications from '../Notifications';

const NavBarLoggedInButtons = () => {

    return (
        <Box
            sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 3.0,
                alignItems: 'center',
            }}
        >
            <Notifications />
            <AccountMenu />
        </Box>
    )
}

export default NavBarLoggedInButtons