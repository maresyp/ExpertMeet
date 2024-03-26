import React from 'react';
import { useNavigate } from 'react-router-dom';

const AlertContext = React.createContext();

export default AlertContext;

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = React.useState({ open: false, message: '', severity: '' });
    const navigate = useNavigate()

    const showAlert = (message, severity, timeout = 6000) => {
        setAlert({ open: true, message, severity });
        setTimeout(() => setAlert({ open: false, message: '', severity: '' }), timeout);
    };

    const navigateWithAlert = (path, message, severity, timeout = 6000) => {
        navigate(path);
        showAlert(message, severity, timeout);
    };

    let contextData = {
        alert: alert,
        showAlert: showAlert,
        navigateWithAlert: navigateWithAlert,
    }

    return (
        <AlertContext.Provider value={contextData}>
            {children}
        </AlertContext.Provider>
    );
};