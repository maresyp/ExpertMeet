import React, { useContext, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import AlertContext from "../context/AlertContext";

const PrivateRoutes = () => {
    let { user } = useContext(AuthContext)
    let { showAlert } = useContext(AlertContext)

    useEffect(() => {
        if (!user) {
            showAlert("Ta strona jest dostępna tylko dla zalogowanych użytkowników.", "error")
        }
    }, [user, showAlert])

    return (
        user ? <Outlet /> : <Navigate to="/login" />
    )
}

export default PrivateRoutes