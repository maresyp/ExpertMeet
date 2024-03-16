import * as React from 'react';

import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AuthContext from '../context/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query'

const HomePage = () => {
    let { user } = React.useContext(AuthContext)
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

    // TODO: Add error handling
    console.log(data);

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
                Featured profiles
                {Array.isArray(data) ? data.map((item, index) => (
                    <div key={index}>
                        {JSON.stringify(item)}
                    </div>
                )) : <div>{JSON.stringify(data)}</div>}

            </Box>
        </Container>
    )
}

export default HomePage