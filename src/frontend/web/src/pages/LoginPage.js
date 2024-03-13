import React from "react";

const LoginPage = () => {
    return (
        <div>
            <form>
                <input type="text" name="username" placeholder="Login..." />
                <input type="password" name="password" placeholder="Password..." />
                <input type="submit" />
            </form>
        </div>
    )
}

export default LoginPage