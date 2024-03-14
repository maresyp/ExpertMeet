import * as React from 'react';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import AuthContext from '../context/AuthContext';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';

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
    const { logoutUser } = React.useContext(AuthContext)

    const logoutHandler = () => {
        logoutUser()
    }

    return (
        <Box
            sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 0.5,
                alignItems: 'center',
            }}
        >
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