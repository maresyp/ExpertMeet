import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { useQuery, useQueryClient } from '@tanstack/react-query'

import * as React from 'react'
import AuthContext from '../context/AuthContext';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Fab from '@mui/material/Fab';
import SendIcon from '@mui/icons-material/Send';
import CallIcon from '@mui/icons-material/Call';
import { Badge, IconButton, Tooltip } from '@mui/material';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import ProfileReviews from '../components/profile/visit/ProfileReviews';
import ProfileInfo from '../components/profile/visit/ProfileInfo';
import ProfileAppointment from '../components/profile/visit/ProfileAppointment';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const VisitProfile = () => {
    const { authTokens } = React.useContext(AuthContext)
    const [value, setValue] = React.useState(0);
    const { profileID } = useParams(null);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useQueryClient()
    const { isLoading, data, error } = useQuery({
        queryKey: ['VisitProfile'],
        queryFn: ({ signal }) =>
            fetch(`http://127.0.0.1:8080/api/profile/visit/${profileID}`, {
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

    if (error) {
        console.log(error);
    }

    if (isLoading) {
        return (
            <p>Loading...</p>
        )
    }

    return (
        <Container component="main" maxWidth="lg" sx={{ height: '700px' }}>
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                }}
            >
                <Grid container>
                    <Grid item xs={12} >
                        <Typography variant="h5" className="header-message" style={{ textAlign: 'center', paddingBottom: '25px' }}>Odwiedzasz profil</Typography>
                    </Grid>
                </Grid>
                <Grid container component={Paper}
                    sx={{
                        width: '100%',
                        height: "700px",
                        display: 'flex',
                    }}>
                    <Grid item xs={3} sx={{
                        borderRight: '1px solid #e0e0e0',
                        flexDirection: 'column',
                    }}>
                        <Grid item xs={12} style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <Avatar
                                alt={'U'}
                                src={`http://127.0.0.1:8080/api/profile/get_avatar/${data?.id}`}
                                sx={{ width: 100, height: 100 }}
                            />
                            <Typography variant="h6" style={{ paddingTop: '15px' }}>
                                {data.username}
                            </Typography>
                        </Grid>

                    </Grid>
                    <Grid item xs={9} sx={{ display: 'flex', flexDirection: 'column', height: '700px' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '35px', maxHeight: '65px' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab label="informacje" {...a11yProps(0)} />
                                    <Tab label="harmonogram" {...a11yProps(1)} />
                                    <Tab label="recenzje" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                        </Box>
                        <Box sx={{ overflow: 'auto', flex: 1 }}>
                            <CustomTabPanel value={value} index={0}>
                                <ProfileInfo profileData={data} />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={1}>
                                <ProfileAppointment profileData={data} />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={2}>
                                <ProfileReviews profileData={data} />
                            </CustomTabPanel>
                        </Box>
                        <Grid container style={{ padding: '20px' }}></Grid>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}

export default VisitProfile