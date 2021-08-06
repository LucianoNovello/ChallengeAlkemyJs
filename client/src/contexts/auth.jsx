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
     
    const setToken=(user, token)=>{
        localStorage.setItem(user,token)
    }
    const getToken= ()=>{
        localStorage.getItem('user')
    }
    return (
        <AuthContext.Provider
            value={{
           userLogin,
                login,
                logout,
                msg,
                setMessage,
                setToken,
                getToken
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
