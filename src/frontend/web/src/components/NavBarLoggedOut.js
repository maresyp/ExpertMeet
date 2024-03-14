import * as React from 'react';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';

export function DrawerLoggedOut() {
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
                    Zarejestruj się
                </Button>
            </MenuItem>
            <MenuItem>
                <Button
                    color="primary"
                    variant="outlined"
                    component="a"
                    href="/material-ui/getting-started/templates/sign-in/"
                    target="_blank"
                    sx={{ width: '100%' }}
                >
                    Zaloguj się
                </Button>
            </MenuItem>
        </Box>
    )
}


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