import * as React from 'react';

import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ReviewSummary from '../components/ReviewSummary';
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Avatar, Divider, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
    useQueryClient()

    const { isLoading, data, error } = useQuery({
        queryKey: ['Profile'],
        queryFn: ({ signal }) =>
            fetch("http://127.0.0.1:8080/api/profile/feed", { signal }).then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch')
                }
                return res.json()
            }),
    })

    const handleClick = () => {
        console.log('Box clicked');
    };


    if (error) {
        console.log(error);
    }

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
                {alert.open && <Alert severity={alert.severity}>{alert.message}</Alert>}
                Featured profiles
                {isLoading ? (
                    <p>Loading</p>
                ) : (
                    Array.isArray(data) ? data.map((item, index) => (
                        <Box mb={2} key={index}>
                            <Paper elevation={1}>
                                <Box onClick={handleClick} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar alt="User" src={`http://127.0.0.1:8080/api/profile/get_avatar/${item.id}`} />
                                    <Typography variant='h5'>{item.username}</Typography>
                                </Box>
                                <Divider flexItem />
                                <div key={index}>
                                    <Typography variant='h6'>
                                        Informacje:
                                    </Typography>
                                    {item.bio}
                                    <br />
                                    <br />
                                    <ReviewSummary profile_id={item.id} />
                                </div>
                            </Paper>
                        </Box>
                    )) : <p></p>
                )}
            </Box>
        </Container>
    )
}

export default HomePage