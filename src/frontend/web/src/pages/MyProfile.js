import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { useQuery, useQueryClient } from '@tanstack/react-query'

import * as React from 'react'
import AuthContext from '../context/AuthContext';

const MyProfile = () => {
    const { authTokens } = React.useContext(AuthContext)

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

    // TODO: Add error handling


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
                Profile: {JSON.stringify(data)}
            </Box>
        </Container>
    )
}

export default MyProfile