import * as React from 'react';

import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ReviewSummary from '../components/ReviewSummary';
import AlertContext from '../context/AlertContext'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert } from '@mui/material';

const HomePage = () => {
    const { showAlert } = React.useContext(AlertContext)
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


    if (error) {
        showAlert("Nie udało się załadować strony.", "error")
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
                                <div key={index}>
                                    {JSON.stringify(item)}
                                    <ReviewSummary profile_id={item.id} />
                                </div>
                            </Paper>
                        </Box>
                    )) : <div>{JSON.stringify(data)}</div>
                )}
            </Box>
        </Container>
    )
}

export default HomePage