import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({ children }) => {
    // Get auth token and user from local storage if possible else null
    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    let updateToken = async () => {
        console.log("Trying to update token");
        let response = await fetch(
            'http://127.0.0.1:8080/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'refresh': authTokens?.refresh })
        })
        // TODO: add error handling
        const data = await response.json();
        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        } else {
            // TODO : add some kind of message about being logged out ?
            clearUserData()
        }

        if (loading) {
            setLoading(false)
        }
    }

    let loginUser = async (login, pwd) => {
        let response = await fetch(
            'http://127.0.0.1:8080/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
                body: JSON.stringify({ 'username': login, 'password': pwd })
        })

        const data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            navigate('/')
            return true
        } else {
            return false
            // TODO: This need error handling ( network errors )
        }
    }

    const clearUserData = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
    }

    let logoutUser = () => {
        clearUserData()
        navigate('/')
    }

    let contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
    }

    useEffect(() => {

        if (loading) {
            updateToken()
        }

        let fourMinutes = 1000 * 60 * 4
        let interval = setInterval(() => {
            if (authTokens) {
                updateToken()
            }
        }, fourMinutes)
        return () => clearInterval(interval)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authTokens, loading])

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}