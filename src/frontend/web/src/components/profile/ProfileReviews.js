import * as React from 'react'
import Alert from '@mui/material/Alert';
import AlertContext from '../../context/AlertContext';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import AuthContext from '../../context/AuthContext';
import { useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { Avatar, CircularProgress, Divider, Paper, Rating, Typography } from '@mui/material';
import ReviewSummary from '../ReviewSummary';

function ProfileReviews({ profileData }) {
    useQueryClient()
    const { alert, showAlert } = React.useContext(AlertContext)
    const { authTokens } = React.useContext(AuthContext);
    const [ordering, setOrdering] = React.useState('')
    const [noMorePages, setNoMorePages] = React.useState(false);


    const fetchProfiles = async ({ queryKey }) => {
        // eslint-disable-next-line no-unused-vars
        const [_key, page, ordering] = queryKey;

        // Create URLSearchParams object
        const params = new URLSearchParams();
        params.append('page', page);

        if (ordering) {
            params.append('ordering', ordering);
        }

        const response = await fetch(`http://127.0.0.1:8080/api/profile/reviews/feed/${profileData?.id}?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                setNoMorePages(true);
                throw new Error('There are no more reviews to download.');
            }
            throw new Error('Failed to fetch');
        }

        const data = await response.json();
        return data;
    };

    const {
        data,
        error,
        fetchNextPage,
        // eslint-disable-next-line no-unused-vars
        hasNextPage,
        // eslint-disable-next-line no-unused-vars
        isFetching,
        isFetchingNextPage,
        // eslint-disable-next-line no-unused-vars
        status,
        refetch,
    } = useInfiniteQuery({
        queryKey: ['Reviews', ordering],
        queryFn: ({ pageParam = 1 }) => fetchProfiles({ queryKey: ['Reviews', pageParam, ordering] }),
        getNextPageParam: (lastPage, pages) => noMorePages ? undefined : pages.length + 1
    });

    console.log(data);
    return (
        <>
            {alert.open && <Alert sx={{ mb: 3 }} severity={alert.severity}>{alert.message}</Alert>}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}>
                <Typography variant='h5' sx={{ mr: 6 }}>Podsumowanie recenzji na twoim profilu: </Typography>
                <ReviewSummary profile_id={profileData?.id} />
            </Box>

            {data?.pages.map((group, i) => (
                <React.Fragment key={i}>
                    {group.map((item, index) => (
                        <Box mb={3} key={index}>
                            <Paper elevation={1}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ ml: 1 }} alt="User" src={`http://127.0.0.1:8080/api/profile/get_avatar/${item.author_profile_id}`} />
                                    <Typography variant='h6'>{item.author_profile_name}</Typography>
                                    <Box sx={{ flexGrow: 1 }} />
                                    <Rating sx={{ mr: 2 }} name="read-only" value={item.rating} precision={0.5} readOnly />
                                </Box>
                                <Divider flexItem />
                                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, mt: 1, maxHeight: 80, overflow: 'auto', }} >
                                    <Typography variant='body1' sx={{ wordWrap: 'break-word' }}>
                                        {item.content}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Box>
                    ))}
                </React.Fragment>))}

            {isFetchingNextPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <CircularProgress />
                </Box>
            )}
        </>
    );
}


export default ProfileReviews;