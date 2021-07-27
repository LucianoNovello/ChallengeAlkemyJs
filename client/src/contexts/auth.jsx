import React, { createContext, useState } from 'react'

export const AuthContext = createContext({})

const AuthProvider = ({ children }) => {
    const [userLogin, setUserLogin] = useState('')
    const [msg, setMsg]= useState('')

    const login = (user) => {
        setUserLogin(user)
    }

    const logout = (user) => {
        setUserLogin(null)
    }
    const setMessage=(message)=>{
        setMsg(message)
    }
    return (
        <AuthContext.Provider
            value={{
           userLogin,
                login,
                logout,
                msg,
                setMessage
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
