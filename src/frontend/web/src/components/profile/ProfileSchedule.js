import * as React from 'react'
import Alert from '@mui/material/Alert';
import AlertContext from '../../context/AlertContext';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AuthContext from '../../context/AuthContext';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

function ProfileSchedule() {
    useQueryClient()

    const { alert, showAlert } = React.useContext(AlertContext)
    const { user, authTokens } = React.useContext(AuthContext);

    const [times, setTimes] = React.useState({
        monday: { start: null, end: null },
        tuesday: { start: null, end: null },
        wednesday: { start: null, end: null },
        thursday: { start: null, end: null },
        friday: { start: null, end: null },
        saturday: { start: null, end: null },
        sunday: { start: null, end: null },
    });

    const dayTranslations = {
        monday: 'Poniedziałek',
        tuesday: 'Wtorek',
        wednesday: 'Środa',
        thursday: 'Czwartek',
        friday: 'Piątek',
        saturday: 'Sobota',
        sunday: 'Niedziela',
    };

    const handleTimeChange = (day, type, newValue) => {
        const formattedTime = newValue ? dayjs(newValue).format('HH:mm') : null;
        setTimes((prevTimes) => ({
            ...prevTimes,
            [day]: {
                ...prevTimes[day],
                [type]: formattedTime,
            },
        }));
    };

    const { isLoading: scheduleLoading, data: schedule, error: scheduleError, refetch } = useQuery({
        queryKey: ['Schedule'],
        queryFn: ({ signal }) =>
            fetch(`http://127.0.0.1:8080/api/appointments/get_schedule/${user.user_id}`, {
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
        if (schedule) {
            console.log(schedule);
            setTimes({
                monday: { start: schedule.monday_start, end: schedule.monday_end },
                tuesday: { start: schedule.tuesday_start, end: schedule.tuesday_end },
                wednesday: { start: schedule.wednesday_start, end: schedule.wednesday_end },
                thursday: { start: schedule.thursday_start, end: schedule.thursday_end },
                friday: { start: schedule.friday_start, end: schedule.friday_end },
                saturday: { start: schedule.saturday_start, end: schedule.saturday_end },
                sunday: { start: schedule.sunday_start, end: schedule.sunday_end },
            });
        }
    }, [schedule])

    const changeSchedule = async ({ formData }) => {
        const response = await fetch("http://127.0.0.1:8080/api/appointments/update_schedule", {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}`,
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error("Failed to update schedule");
        }

        const data = await response.json();
        return data;
    };

    const { mutate: updateScheduleMutation } = useMutation({
        mutationFn: (formData) => changeSchedule({ formData }),
        onSuccess: (data) => {
            showAlert('Zaktualizowano harmonogram', 'success')
            refetch();
        },
        onError: (error) => {
            console.error('Failed to update password', error);
            showAlert('Nie udało się zaktualizować harmonogramu', 'error')
        }
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Submitted Times:', times);
        updateScheduleMutation(times);
    };

    return (
        <>
            {/* TODO: add https://mui.com/material-ui/react-text-field/#validation */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}>
                <Typography variant='h6'>Wybierz dni tygodnia oraz godziny w których chcesz świadczyć swoje usługi:</Typography>
            </Box>
            {alert.open && <Alert sx={{ mb: 3 }} severity={alert.severity}>{alert.message}</Alert>}
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ justifyContent: 'center', alignItems: 'center' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {Object.keys(times).map((day) => (
                        <Box key={day} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, width: '100%' }}>
                            <Typography variant='h5'>{dayTranslations[day]}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <TimePicker
                                    label="Godzina rozpoczęcia"
                                    value={times[day].start ? dayjs(times[day].start, 'HH:mm') : null}
                                    onChange={(newValue) => handleTimeChange(day, 'start', newValue)}
                                    sx={{ mr: 2 }}
                                />
                                <TimePicker
                                    label="Godzina zakończenia"
                                    value={times[day].end ? dayjs(times[day].end, 'HH:mm') : null}
                                    onChange={(newValue) => handleTimeChange(day, 'end', newValue)}
                                />
                            </Box>
                        </Box>
                    ))}
                </LocalizationProvider>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 1, mb: 2 }}
                    >
                        Aktualizuj
                    </Button>
                </Box>
            </Box>
        </>
    );
}


export default ProfileSchedule;