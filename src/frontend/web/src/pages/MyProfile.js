import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { useQuery, useQueryClient } from '@tanstack/react-query'

import * as React from 'react'
import AuthContext from '../context/AuthContext';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Fab from '@mui/material/Fab';
import SendIcon from '@mui/icons-material/Send';
import CallIcon from '@mui/icons-material/Call';
import { Badge, IconButton, Tooltip } from '@mui/material';

const MyProfile = () => {
    const { authTokens } = React.useContext(AuthContext)
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useQueryClient()
    const { isLoading, data, error } = useQuery({
        queryKey: ['Profile'],
        queryFn: ({ signal }) =>
            fetch("http://127.0.0.1:8080/api/profile/", {
                signal,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens?.access}`
                },
            }).then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch')
                }
                return res.json()
            }),
    })

    if (error) {
        console.log(error);
    }

    if (isLoading) {
        return (
            <p>Loading...</p>
        )
    }

    return (
        <Container component="main" maxWidth="lg" sx={{ height: '700px' }}>
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                }}
            >
                <Grid container>
                    <Grid item xs={12} >
                        <Typography variant="h5" className="header-message" style={{ textAlign: 'center', paddingBottom: '25px' }}>Twój profil</Typography>
                    </Grid>
                </Grid>
                <Grid container component={Paper}
                    sx={{
                        width: '100%',
                        height: "700px",
                        display: 'flex',
                    }}>
                    <Grid item xs={3} sx={{
                        borderRight: '1px solid #e0e0e0',
                        flexDirection: 'column',
                    }}>
                        <Grid item xs={12} style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <Avatar
                                alt={'U'}
                                src={`http://127.0.0.1:8080/api/profile/get_avatar/${data?.id}`}
                                sx={{ width: 100, height: 100 }}
                            />
                            <Typography variant="h6" style={{ paddingTop: '15px' }}>
                                {data.username}
                            </Typography>
                        </Grid>

                    </Grid>
                    <Grid item xs={9} sx={{ display: 'flex', flexDirection: 'column', height: '700px' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '35px', maxHeight: '65px' }}>
                            <Box sx={{ width: '100%' }}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                        <Tab label="Item One" />
                                        <Tab label="Item Two" />
                                        <Tab label="Item Three" />
                                    </Tabs>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ overflow: 'auto', flex: 1 }}>

                        </Box>
                        <Grid container style={{ padding: '20px' }}></Grid>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}

export default MyProfile