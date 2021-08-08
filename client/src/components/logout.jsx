import React,{useContext, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import { AuthContext } from '../contexts/contextsutils'
const Logout = () => {
    const history = useHistory()
    const {logout, setMessage}= useContext(AuthContext) 
    useEffect(()=>{
        setMessage(null)
        logout()
        history.replace('/')
    },[])
    return (
        <div>
            <p>Login out...</p>
        </div>
    )
}

export default Logout
