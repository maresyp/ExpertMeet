import * as React from 'react';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import AuthContext from '../context/AuthContext';
import NavBarLoggedInButtons, { DrawerLoggedIn } from './NavBarLoggedIn';
import NavBarLoggedOutButtons, { DrawerLoggedOut } from './NavBarLoggedOut';
import { Link } from 'react-router-dom';

const logoStyle = {
    paddingLeft: "12px",
    paddingTop: "4px",
    width: '160px',
    height: 'auto',
    cursor: 'pointer',
};

function NavBar() {
    const [open, setOpen] = React.useState(false);
    const { user } = React.useContext(AuthContext)

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    return (
        <div>
            <AppBar
                position="fixed"
                sx={{
                    boxShadow: 0,
                    bgcolor: 'transparent',
                    backgroundImage: 'none',
                    mt: 2,
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar
                        variant="regular"
                        sx={() => ({
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexShrink: 0,
                            borderRadius: '999px',
                            bgcolor: 'rgba(255, 255, 255, 0.4)',
                            backdropFilter: 'blur(24px)',
                            maxHeight: 40,
                            border: '1px solid',
                            borderColor: 'divider',
                            boxShadow: `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                        })}
                    >
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: 'flex',
                                alignItems: 'center',
                                ml: '-18px',
                                px: 0,
                            }}
                        >
                            <Link to="/">
                            <img
                                    src="/logo.png"
                                style={logoStyle}
                                alt="logo of ExpertMeet"
                            />
                            </Link>
                        </Box>
                        {user ? <NavBarLoggedInButtons /> : <NavBarLoggedOutButtons />}
                        <Box sx={{ display: { sm: '', md: 'none' } }}>
                            <Button
                                variant="text"
                                color="primary"
                                aria-label="menu"
                                onClick={toggleDrawer(true)}
                                sx={{ minWidth: '30px', p: '4px' }}
                            >
                                <MenuIcon />
                            </Button>
                            <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                                {user ? <DrawerLoggedIn /> : <DrawerLoggedOut />}
                            </Drawer>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </div>
    );
}

export default NavBar;