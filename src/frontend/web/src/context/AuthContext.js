import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({ children }) => {
    // Get auth token and user from local storage if possible else null
    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null)

    const navigate = useNavigate()

    let loginUser = async (e) => {
        e.preventDefault()

        let response = await fetch(
            'http://127.0.0.1:8080/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'username': e.target.username.value, 'password': e.target.password.value })
        })

        const data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            navigate('/')
        } else {
            alert('Something went wrong!')
            // TODO: This need error handling
        }
    }

    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate('/login')
    }

    let contextData = {
        user: user,
        loginUser: loginUser,
        logoutUser: logoutUser,
    }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}