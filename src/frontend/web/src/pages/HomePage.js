import * as React from 'react';

import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ReviewSummary from '../components/ReviewSummary';
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Avatar, Divider, TextField, Typography } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

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
        keepPreviousData: true,
    })

    const handleClick = () => {
        console.log('Box clicked');
    };

    if (error) {
        console.log(error);
    }

    const [searchTerm, setSearchTerm] = React.useState('');
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredProfiles = data?.filter(profile => {
        const fullName = `${profile?.username || ''}`.toLowerCase();
        return fullName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const [ordering, setOrdering] = React.useState('')
    const handleChangeOrdering = (event) => {
        setOrdering(event.target.value);
    };

    const [selectedCategories, setSelectedCategories] = React.useState([]);
    const [availableCategories, setAvailableCategories] = React.useState(["IT", "Korepetycje", "chujowaniew dupe"]);
    const handleChangeCategories = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedCategories(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

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
                        <InputLabel id="demo-multiple-checkbox-label">Kategoria</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={selectedCategories}
                            onChange={handleChangeCategories}
                            input={<OutlinedInput label="Kategoria" />}
                            renderValue={(selected) => selected.join(', ')}
                        >
                            {availableCategories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    <Checkbox checked={selectedCategories.indexOf(category) > -1} />
                                    <ListItemText primary={category} />
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
                            <MenuItem value={"profile__username"}>Imię i nazwisko (A- Z)</MenuItem>
                            <MenuItem value={"-profile__username"}>Imię i nazwisko (Z- A)</MenuItem>
                            <MenuItem value={"profile__reviewsummary__ratings_mean"}>Oceny (rosnąco)</MenuItem>
                            <MenuItem value={"-profile__reviewsummary__ratings_mean"}>Oceny (malejąco)</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                {isLoading ? (
                    <p>Loading</p>
                ) : (
                        Array.isArray(filteredProfiles) ? filteredProfiles.map((item, index) => (
                            <Box mb={4} key={index}>
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