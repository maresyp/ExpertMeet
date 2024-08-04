import * as React from 'react'
import Alert from '@mui/material/Alert';
import AlertContext from '../../context/AlertContext';
import Box from '@mui/material/Box';
import { useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { Avatar, CircularProgress, Divider, Paper, Rating, Typography } from '@mui/material';
import ReviewSummary from '../ReviewSummary';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function ProfileReviews({ profileData }) {
    useQueryClient()
    const { alert, showAlert } = React.useContext(AlertContext)
    const [ordering, setOrdering] = React.useState('')
    const [noMorePages, setNoMorePages] = React.useState(false);
    const boxRef = React.useRef(null);

    const fetchReviews = async ({ queryKey }) => {
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
        queryFn: ({ pageParam = 1 }) => fetchReviews({ queryKey: ['Reviews', pageParam, ordering] }),
        getNextPageParam: (lastPage, pages) => noMorePages ? undefined : pages.length + 1
    });

    const resetQuery = React.useCallback(() => {
        refetch({ refetchPage: (page, index) => index === 0 });
        setNoMorePages(false);
    }, [refetch]);

    const handleChangeOrdering = (event) => {
        setOrdering(event.target.value);
        resetQuery();
    };

    const handleScroll = React.useCallback(() => {
        const reviewsContainer = boxRef.current;
        if (reviewsContainer.scrollTop + reviewsContainer.clientHeight >= reviewsContainer.scrollHeight) {
            fetchNextPage();
        }
    }, [fetchNextPage]);

    React.useEffect(() => {

        const boxElement = boxRef.current;
        boxElement.addEventListener('scroll', handleScroll);

        return () => {
            boxElement.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    return (
        <>
            {alert.open && <Alert sx={{ mb: 3 }} severity={alert.severity}>{alert.message}</Alert>}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}>
                <Typography variant='h5' sx={{ mr: 3 }}>Podsumowanie recenzji na profilu: </Typography>
                <ReviewSummary profile_id={profileData?.id} />
                <FormControl sx={{ m: 1, ml: 2, minWidth: 220 }} >
                    <InputLabel id="ordering">Sortowanie</InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="select-ordering"
                        value={ordering}
                        label="Sortowanie"
                        onChange={handleChangeOrdering}
                    >
                        <MenuItem value={"-date_created"}>Najnowsze</MenuItem>
                        <MenuItem value={"date_created"}>Najstarsze</MenuItem>
                        <MenuItem value={"rating"}>Oceny (rosnąco)</MenuItem>
                        <MenuItem value={"-rating"}>Oceny (malejąco)</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box ref={boxRef} sx={{ maxHeight: 435, overflow: 'auto' }}>
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
                                        <span style={{ fontWeight: 'bold' }}>
                                            {new Date(item.date_created).toLocaleDateString()}:&nbsp;
                                        </span>
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
            </Box>
        </>
    );
}


export default ProfileReviews;