import * as React from 'react'
import Alert from '@mui/material/Alert';
import AlertContext from '../../context/AlertContext';
import Box from '@mui/material/Box';
import { useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { Avatar, Button, CircularProgress, Divider, Paper, Typography } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AuthContext from '../../context/AuthContext';

function ProfileAppointmentsHistory() {
    useQueryClient()
    const { alert, showAlert } = React.useContext(AlertContext)
    const [ordering, setOrdering] = React.useState('')
    const [filtering, setFiltering] = React.useState('received')
    const [noMorePages, setNoMorePages] = React.useState(false);
    const boxRef = React.useRef(null);
    const { user, authTokens } = React.useContext(AuthContext);

    const fetchAppointmentsHistory = async ({ queryKey }) => {
        // eslint-disable-next-line no-unused-vars
        const [_key, page, ordering] = queryKey;

        // Create URLSearchParams object
        const params = new URLSearchParams();
        params.append('page', page);

        if (ordering) {
            params.append('ordering', ordering);
        }

        const response = await fetch(`http://127.0.0.1:8080/api/appointments/feed?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}`,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                setNoMorePages(true);
                throw new Error('There are no more appointments to download.');
            }
            throw new Error('Failed to fetch');
        }

        const data = await response.json();
        return data;
    };

    const {
        data,
        // eslint-disable-next-line no-unused-vars
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
        queryKey: ['AppointmentsHistory', ordering],
        queryFn: ({ pageParam = 1 }) => fetchAppointmentsHistory({ queryKey: ['AppointmentsHistory', pageParam, ordering] }),
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

    const handleChangeFiltering = (event) => {
        setFiltering(event.target.value);
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

    const translateStatus = (statusCode) => {
        switch (statusCode) {
            case "1":
                return "Oczekujące"
            case "2":
                return "Zaakceptowane"
            case "3":
                return "Odrzucone"
            default:
                return "Błędny kod statusu."
        }
    }

    console.log(data);
    return (
        <>
            {alert.open && <Alert sx={{ mb: 3 }} severity={alert.severity}>{alert.message}</Alert>}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}>
                <FormControl sx={{ m: 1, ml: 2, minWidth: 280 }} >
                    <InputLabel id="filtering">Filtrowanie</InputLabel>
                    <Select
                        labelId="select-filtering"
                        id="select-filtering"
                        value={filtering}
                        label="Filtrowanie"
                        onChange={handleChangeFiltering}
                    >
                        <MenuItem value={"sent"}>Otrzymane zaproszenia</MenuItem>
                        <MenuItem value={"received"}>Wysłane zaproszenia</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, ml: 2, minWidth: 220 }} >
                    <InputLabel id="ordering">Sortowanie</InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="select-ordering"
                        value={ordering}
                        label="Sortowanie"
                        onChange={handleChangeOrdering}
                    >
                        <MenuItem value={"status"}>Status</MenuItem>
                        <MenuItem value={"-date_created"}>Najnowsze</MenuItem>
                        <MenuItem value={"date_created"}>Najstarsze</MenuItem>
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
                                        <Typography variant='h6'>Status: {translateStatus(item.status)}</Typography>
                                    </Box>
                                    <Divider flexItem />
                                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, mt: 1, }} >
                                        <Typography variant='body1' sx={{ wordWrap: 'break-word' }}>
                                            Inicjator spotkania:&nbsp;<span style={{ fontWeight: 'bold' }}>
                                                {item.requested_by}
                                            </span>
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, mt: 1, }} >
                                        <Typography variant='body1' sx={{ wordWrap: 'break-word' }}>
                                            Data utworzenia:&nbsp;<span style={{ fontWeight: 'bold' }}>
                                                {new Date(item.date_created).toLocaleDateString()} {new Date(item.date_created).toLocaleTimeString()}
                                            </span>
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, mt: 1, }} >
                                        <Typography variant='body1' sx={{ wordWrap: 'break-word' }}>
                                            Spotkanie zaplanowane na:&nbsp;<span style={{ fontWeight: 'bold' }}>
                                                {new Date(item.date_created).toLocaleDateString()} {new Date(item.date_created).toLocaleTimeString()}
                                            </span>
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mb: 2 }} />
                                    {user.user_id !== item.requested_by && item.status === "1" && <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color='error'
                                            sx={{ mb: 2 }}
                                        >
                                            Odrzuć
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color='success'
                                            sx={{ mb: 2, ml: 1 }}
                                        >
                                            Akceptuj
                                        </Button>
                                    </Box>}
                                </Paper>
                            </Box>
                        ))}
                    </React.Fragment>
                ))}

                {isFetchingNextPage && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        <CircularProgress />
                    </Box>
                )}
            </Box>
        </>
    );
}


export default ProfileAppointmentsHistory;