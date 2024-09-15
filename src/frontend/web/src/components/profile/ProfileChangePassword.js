import * as React from 'react'
import Alert from '@mui/material/Alert';
import AlertContext from '../../context/AlertContext';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import AuthContext from '../../context/AuthContext';
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Typography } from '@mui/material';

function ProfileChangePassword() {
    useQueryClient()
    const { alert, showAlert } = React.useContext(AlertContext)
    const { authTokens } = React.useContext(AuthContext);

    const changePassword = async ({ formData }) => {
        const response = await fetch("http://127.0.0.1:8080/api/profile/change_password", {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}`,
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error("Failed to update password");
        }

        const data = await response.json();
        return data;
    };

    // TODO: add proper error handling for cases like wrong password etc.
    const { mutate: updatePasswordMutation, isLoading: profileUpdatePending, error: profileUpdateError } = useMutation({
        mutationFn: (formData) => changePassword({ formData }),
        onSuccess: (data) => {
            showAlert('Zaktualizowano hasło', 'success')
        },
        onError: (error) => {
            console.error('Failed to update password', error);
            showAlert('Nie udało się zaktualizować hasła', 'error')
        }
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        const form_data = new FormData(event.currentTarget);
        const formData = {
            old_password: form_data.get('password0'),
            new_password1: form_data.get('password1'),
            new_password2: form_data.get('password2'),
        }

        updatePasswordMutation(formData);
    };

    return (
        <>
            {alert.open && <Alert sx={{ mb: 3 }} severity={alert.severity}>{alert.message}</Alert>}
            {/* TODO: add https://mui.com/material-ui/react-text-field/#validation */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}>
                <Typography variant='h4'>Zmiana hasła</Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <TextField
                        sx={{ mb: 2, width: 300 }}
                        required
                        name="password0"
                        id="password0"
                        label="Stare hasło"
                        type="password"
                        autoComplete="new-password"
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <TextField
                        sx={{ mt: 2, mb: 2, width: 300 }}
                        required
                        name="password1"
                        id="password1"
                        label="Nowe hasło"
                        type="password"
                        autoComplete="new-password"
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <TextField
                        sx={{ width: 300 }}
                        required
                        name="password2"
                        id="password2"
                        label="Powtórz nowe hasło"
                        type="password"
                        autoComplete="repeat-password"
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 4, mb: 2 }}
                    >
                        Aktualizuj
                    </Button>
                </Box>
            </Box >
        </>
    );
}


export default ProfileChangePassword;