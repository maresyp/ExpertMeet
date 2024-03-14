import * as React from 'react';

import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AuthContext from '../context/AuthContext';

const HomePage = () => {
    let { user } = React.useContext(AuthContext)

    return (
        <Container component="main" maxWidth="lg">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                }}
            >
                Hello hello
                {user && <p>Logged in as {user.user_id}</p>}

            </Box>
        </Container>
    )
}

export default HomePage