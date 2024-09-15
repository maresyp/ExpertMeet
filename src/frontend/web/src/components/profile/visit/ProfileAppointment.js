import * as React from 'react'
import Alert from '@mui/material/Alert';
import AlertContext from '../../../context/AlertContext';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AuthContext from '../../../context/AuthContext';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

function ProfileAppointment({ profileData }) {
    useQueryClient()

    const { alert, showAlert } = React.useContext(AlertContext)
    const { user, authTokens } = React.useContext(AuthContext);
    const [selectedDate, setSelectedDate] = React.useState(null);

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

    const { isLoading: scheduleLoading, data: schedule, error: scheduleError, refetch } = useQuery({
        queryKey: ['VisitSchedule', profileData.id],
        queryFn: ({ signal }) =>
            fetch(`http://127.0.0.1:8080/api/appointments/get_schedule/${profileData.id}`, {
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

    const fetchCreateAppointment = async ({ formData }) => {
        const response = await fetch(`http://127.0.0.1:8080/api/appointments/create_appointment/${profileData.id}`, {
            method: 'POST',
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

    const { mutate: createAppointment } = useMutation({
        mutationFn: (formData) => fetchCreateAppointment({ formData }),
        onSuccess: (data) => {
            showAlert('Wysłano zapytanie o spotkanie', 'success')
            refetch();
        },
        onError: (error) => {
            console.error('Failed to update password', error);
            showAlert('Nie udało się wysłać zapytania o spotkanie', 'error')
        }
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        createAppointment({ date: selectedDate });
    };

    const handleDateChange = (newValue) => {
        setSelectedDate(newValue);
    };

    return (
        <>
            {alert.open && <Alert sx={{ mb: 3 }} severity={alert.severity}>{alert.message}</Alert>}
            {user && <>
                <Box component="form" onSubmit={handleSubmit} noValidate >
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                onChange={handleDateChange}
                                value={selectedDate}
                                label="Wybierz datę spotkania"
                            />
                        </LocalizationProvider>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 2, mb: 2, }}
                        >
                            Wyślij
                        </Button>
                    </Box>
                </Box>

            </>}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}>
                <Typography variant='h6'>Sprawdź harmonogram dla tego profilu:</Typography>
            </Box>
            <Box sx={{ justifyContent: 'center', alignItems: 'center' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {Object.keys(times).map((day) => (
                        <Box key={day} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, width: '100%' }}>
                            <Typography variant='h5'>{dayTranslations[day]}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <TimePicker
                                    readOnly
                                    label="Godzina rozpoczęcia"
                                    value={times[day].start ? dayjs(times[day].start, 'HH:mm') : null}
                                    sx={{ mr: 2 }}
                                />
                                <TimePicker
                                    readOnly
                                    label="Godzina zakończenia"
                                    value={times[day].end ? dayjs(times[day].end, 'HH:mm') : null}
                                />
                            </Box>
                        </Box>
                    ))}
                </LocalizationProvider>
            </Box>
        </>
    );
}


export default ProfileAppointment;