import React, { useContext } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const AuthRoutes = () => {
    const { user } = useContext(AuthContext)
    const location = useLocation().pathname

    return (
        (!user && (location === '/login' || location === '/register')) ? <Outlet /> : <Navigate to="/" />
    )
}

export default AuthRoutes