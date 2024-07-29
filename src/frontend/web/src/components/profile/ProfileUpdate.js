import * as React from 'react'
import Alert from '@mui/material/Alert';
import AlertContext from '../../context/AlertContext';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import AuthContext from '../../context/AuthContext';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Checkbox, ListItemText, OutlinedInput } from '@mui/material';

// TODO: add option to update profile picture on profile
function ProfileUpdate({ profileData, onProfileUpdateSuccess }) {
    useQueryClient()
    const { alert, showAlert } = React.useContext(AlertContext)
    const [category, setCategory] = React.useState('');
    const { authTokens } = React.useContext(AuthContext);

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

    const updateProfile = async ({ formData }) => {
        const response = await fetch("http://127.0.0.1:8080/api/profile/update", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}`,
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        const data = await response.json();
        return data;
    };

    const { mutate: updateProfileMutation, isLoading: profileUpdatePending, error: profileUpdateError } = useMutation({
        mutationFn: (formData) => updateProfile({ formData }),
        onSuccess: (data) => {
            onProfileUpdateSuccess();
            showAlert('Zaktualizowano profil', 'success')
        },
        onError: (error) => {
            console.error('Failed to update profile', error);
            showAlert('Nie udało się zaktualizować profilu', 'error')
        }
    });

    React.useEffect(() => {
        setCategory(profileData?.category)
    }, [profileData?.category])

    const handleSubmit = (event) => {
        event.preventDefault();
        const form_data = new FormData(event.currentTarget);
        const formData = {
            category: availableCategories?.find(cat => cat.name === category)?.id,
            bio: form_data.get('bio'),
            description: form_data.get('description'),
        }
        updateProfileMutation(formData);
    };

    return (
        <>
            {alert.open && <Alert sx={{ mb: 3 }} severity={alert.severity}>{alert.message}</Alert>}
            {/* TODO: add https://mui.com/material-ui/react-text-field/#validation */}
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <FormControl fullWidth sx={{ mb: 1 }} >
                    <InputLabel id="category-checkbox-label">Kategoria</InputLabel>
                    <Select
                        labelId="category-multiple-checkbox-label"
                        id="category-select"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        input={<OutlinedInput label="Kategoria" />}
                        renderValue={(selected) =>
                            availableCategories?.find((category) => category.name === selected)?.name || ''
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
                    name="bio"
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