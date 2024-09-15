import { Badge, Box, IconButton, Menu, Tooltip } from '@mui/material'
import * as React from 'react'
import NotificationsIcon from '@mui/icons-material/Notifications';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AuthContext from '../context/AuthContext';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

export default function Notifications() {
    useQueryClient();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { authTokens } = React.useContext(AuthContext)
    const open = Boolean(anchorEl);
    const { isLoading: notificationsLoading, data: notifications, error: notificationsError, refetch: refetchNotifications } = useQuery({
        queryKey: ['Notifications'],
        queryFn: ({ signal }) =>
            fetch(`http://127.0.0.1:8081/api/notifications/`, {
                signal,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens?.access}`,
                },
            }).then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch')
                }
                return res.json()
            }),
    })

    const { isLoading: notificationsCountLoading, data: notificationsCount, error: notificationsCountError, refetch } = useQuery({
        queryKey: ['NotificationsCount'],
        queryFn: ({ signal }) =>
            fetch(`http://127.0.0.1:8081/api/notifications/count/`, {
                signal,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens?.access}`,
                },
            }).then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch')
                }
                return res.json()
            }),
    })

    const fetchCreateAppointment = async ({ formData }) => {
        const response = await fetch(`http://127.0.0.1:8081/api/notifications/mark_all_as_read/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}`,
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error("Failed to send markAsRead");
        }

        const data = await response.json();
        return data;
    };

    const { mutate: markAsRead } = useMutation({
        mutationFn: (formData) => fetchCreateAppointment({ formData }),
        onSuccess: (data) => {
            refetch();
            refetchNotifications();
        },
        onError: (error) => {
            console.error('Failed to update password', error);
        }
    });

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        markAsRead();
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    console.log("notifications: ", notifications);
    console.log("notifications count: ", notificationsCount);

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Powiadomienia">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 0 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Badge badgeContent={notificationsCount?.count || 0} color="primary">
                            <NotificationsIcon color="action" />
                        </Badge>
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <List sx={{
                    overflow: 'auto',
                    maxHeight: 300,
                    width: '100%',
                    maxWidth: 500,
                }}>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                        </ListItemAvatar>
                        <ListItemText
                            primary="Brunch this weekend?"
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        Ali Connors
                                    </Typography>
                                    {" — I'll be in your neighborhood doing errands this…"}
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                </List>
            </Menu>
        </React.Fragment>
    )
}