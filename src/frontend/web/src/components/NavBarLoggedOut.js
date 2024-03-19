import * as React from 'react';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';


const NavBarLoggedOutButtons = () => {

    return (
        <Box
            sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 0.5,
                alignItems: 'center',
            }}
        >
            <Button
                color="primary"
                variant="text"
                size="small"
                component="a"
                href="/login"
            >
                Zaloguj się
            </Button>
            <Button
                color="primary"
                variant="contained"
                size="small"
                component="a"
                href="/register"
            >
                Zarejestruj się
            </Button>
        </Box>
    )
}

export default NavBarLoggedOutButtons