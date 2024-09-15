import * as React from 'react';

import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ReviewSummary from '../components/ReviewSummary';
import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { Alert, Avatar, Divider, TextField, Typography } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { useDebounce } from 'use-debounce'
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const HomePage = () => {
    useQueryClient()

    const [searchTerm, setSearchTerm] = React.useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    const [ordering, setOrdering] = React.useState('')
    const [selectedCategories, setSelectedCategories] = React.useState([]);
    const [noMorePages, setNoMorePages] = React.useState(false);
    const navigate = useNavigate();

    // eslint-disable-next-line no-unused-vars
    const { isLoading: categoriesLoading, data: availableCategories, error: categoriesError } = useQuery({
        queryKey: ['Categories'],
        queryFn: ({ signal }) =>
            fetch("http://127.0.0.1:8080/api/profile/get_categories", {
                signal,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch')
                }
                return res.json()
            }),
    })

    const fetchProfiles = async ({ queryKey }) => {
        // eslint-disable-next-line no-unused-vars
        const [_key, page, debouncedSearchTerm, selectedCategories, ordering] = queryKey;

        // Create URLSearchParams object
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('username', debouncedSearchTerm);

        // Add each category as a separate parameter
        if (Array.isArray(selectedCategories)) {
            selectedCategories.forEach(category => params.append('category', category));
        }

        if (ordering) {
            params.append('ordering', ordering);
        }

        const response = await fetch(`http://127.0.0.1:8080/api/profile/feed?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                setNoMorePages(true);
                throw new Error('There are no more messages to download.');
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
        queryKey: ['Profiles', debouncedSearchTerm, selectedCategories, ordering],
        queryFn: ({ pageParam = 1 }) => fetchProfiles({ queryKey: ['Profiles', pageParam, debouncedSearchTerm, selectedCategories, ordering] }),
        getNextPageParam: (lastPage, pages) => noMorePages ? undefined : pages.length + 1
    });

    const handleClick = (profileID) => {
        console.log('Box clicked');
        navigate(`/visit/${profileID}`);
    };

    if (error) {
        console.log(error);
    }

    const resetQuery = React.useCallback(() => {
        refetch({ refetchPage: (page, index) => index === 0 });
        setNoMorePages(false);
    }, [refetch]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        resetQuery();
    };

    const handleChangeOrdering = (event) => {
        setOrdering(event.target.value);
        resetQuery();
    };

    const handleChangeCategories = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedCategories(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        resetQuery();
    };

    const handleScroll = React.useCallback(() => {
        const scrollPosition = window.scrollY + window.innerHeight;
        const totalHeight = document.documentElement.scrollHeight;
        const buffer = 50;

        if ((scrollPosition + buffer >= totalHeight)) {
            fetchNextPage();
        }
    }, [fetchNextPage]);

    React.useEffect(() => {
        // Add scroll event listener to the window when the component mounts
        window.addEventListener('scroll', handleScroll);

        // Remove the scroll event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

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
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, mb: 5 }}>
                    <TextField id="search-bar" label="Wyszukaj..." variant="outlined" fullWidth onChange={handleSearchChange} />
                    <FormControl sx={{ m: 1, minWidth: 260 }}>
                        <InputLabel id="category-checkbox-label">Kategoria</InputLabel>
                        <Select
                            labelId="category-multiple-checkbox-label"
                            id="category-multiple-checkbox"
                            multiple
                            value={selectedCategories}
                            onChange={handleChangeCategories}
                            input={<OutlinedInput label="Kategoria" />}
                            renderValue={(selected) =>
                                selected.map((selectedId) =>
                                    availableCategories.find((category) => category.id === selectedId)?.name || ''
                                ).join(', ')
                            }
                        >
                            {availableCategories?.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    <Checkbox checked={selectedCategories.indexOf(category.id) > -1} />
                                    <ListItemText primary={category.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 220 }} >
                        <InputLabel id="ordering">Sortowanie</InputLabel>
                        <Select
                            labelId="demo-select-small-label"
                            id="select-ordering"
                            value={ordering}
                            label="Sortowanie"
                            onChange={handleChangeOrdering}
                        >
                            <MenuItem value={"last_name"}>Nazwisko (A- Z)</MenuItem>
                            <MenuItem value={"-last_name"}>Nazwisko (Z- A)</MenuItem>
                            <MenuItem value={"reviewsummary__ratings_mean"}>Oceny (rosnąco)</MenuItem>
                            <MenuItem value={"-reviewsummary__ratings_mean"}>Oceny (malejąco)</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                {data?.pages.map((group, i) => (
                    <React.Fragment key={i}>
                        {group.filter(profile => {
                            const fullName = `${profile?.username || ''}`.toLowerCase();
                            return fullName.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
                        }).map((item, index) => (
                            <Box mb={4} key={index}>
                            <Paper elevation={1}>
                                    <Box onClick={() => handleClick(item.id)} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar alt="User" src={`http://127.0.0.1:8080/api/profile/get_avatar/${item.id}`} />
                                    <Typography variant='h5'>{item.username}</Typography>
                                </Box>
                                <Divider flexItem />
                                <div key={index}>
                                    <Typography variant='h6'>
                                    Kategoria: {item.category}
                                </Typography>
                                <Typography variant='h6'>
                                    Informacje:
                                </Typography>
                                {item.bio}
                                <br />
                                {item.description}
                                <br />
                                <br />
                                    <ReviewSummary profile_id={item.id} />
                                </div>
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
        </Container>
    )
}

export default HomePage