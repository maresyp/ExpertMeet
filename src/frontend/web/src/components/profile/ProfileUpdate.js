import Alert from '@mui/material/Alert';
import AlertContext from '../../context/AlertContext';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import * as React from 'react'
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AuthContext from '../../context/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Checkbox, ListItemText, OutlinedInput } from '@mui/material';

// TODO: add option to update profile picture on profile
function ProfileUpdate({ profileData }) {
    useQueryClient()
    const { alert, showAlert } = React.useContext(AlertContext)
    const [category, setCategory] = React.useState('');

    const submitData = () => {
        console.log("button clicked");
    }

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

    React.useEffect(() => {
        setCategory(profileData?.category)
        console.log(profileData?.category);
    }, [profileData?.category])

    return (
        <>
            {alert.open && <Alert severity={alert.severity}>{alert.message}</Alert>}
            {/* TODO: add https://mui.com/material-ui/react-text-field/#validation */}
            <Box component="form" onSubmit={submitData} noValidate sx={{ mt: 1 }}>
                <FormControl fullWidth sx={{ mb: 1 }} >
                    <InputLabel id="category-checkbox-label">Kategoria</InputLabel>
                    <Select
                        labelId="category-multiple-checkbox-label"
                        id="category-multiple-checkbox"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        input={<OutlinedInput label="Kategoria" />}
                        renderValue={(selected) =>
                            availableCategories.find((category) => category.name === selected)?.name || ''
                        }
                    >
                        {availableCategories?.map((cat) => (
                            <MenuItem key={cat.id} value={cat.name}>
                                <Checkbox checked={category === cat.name} />
                                <ListItemText primary={cat.name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    margin="normal"
                    fullWidth
                    id="bio"
                    label="Krótki opis"
                    name="Bio"
                    defaultValue={profileData?.bio}
                    multiline
                    rows={2}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="description"
                    label="Szczegółowy opis"
                    id="description"
                    defaultValue={profileData?.description}
                    multiline
                    rows={5}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Aktualizuj
                    </Button>
                </Box>
            </Box >
        </>
    );
}


export default ProfileUpdate;