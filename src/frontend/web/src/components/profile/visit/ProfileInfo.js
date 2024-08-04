import * as React from 'react'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

function ProfileInfo({ profileData }) {
    return (
        <>
            <Box sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    fullWidth
                    name="category"
                    label="Kategoria"
                    id="category"
                    defaultValue={profileData?.category || 'Brak kategorii'}
                    multiline
                    rows={1}
                    inputProps={{
                        readOnly: true,
                        style: { color: 'black' }
                    }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    id="bio"
                    label="Krótki opis"
                    name="bio"
                    defaultValue={profileData?.bio || 'Brak krótkiego opisu'}
                    multiline
                    rows={2}
                    inputProps={{
                        readOnly: true,
                        style: { color: 'black' }
                    }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="description"
                    label="Szczegółowy opis"
                    id="description"
                    defaultValue={profileData?.description || 'Brak szczegółowego opisu'}
                    multiline
                    rows={5}
                    inputProps={{
                        readOnly: true,
                        style: { color: 'black' }
                    }}
                />
            </Box >
        </>
    );
}

export default ProfileInfo;