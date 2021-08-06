import React,{ useState, useEffect, useContext } from 'react'
import {useHistory} from 'react-router-dom'
import Axios from 'axios'
import { AuthContext } from '../contexts/auth'
const Login = () => {
    const {login, msg, setToken}= useContext(AuthContext) 
    const history = useHistory()
    const [email, setEmail]= useState('')
    const [pass, setPass]= useState('')
    const [msgError, setMsgError]=useState(null)
   
    const isAValidCase = () => {
        if (!email.trim() && !pass.trim()) setMsgError('Params cant be null');
        if (!pass.trim()) setMsgError('Password cant be null');
        else return email !== '' && pass !== '';
      }
   
    const LoginUser = async(e)=>{
        e.preventDefault()
        const validCase = isAValidCase()
        if(validCase){
            const userLog ={
                email:email,
                pass:pass   
            }
            await Axios.post('http://localhost:4000/user/login',userLog).then((resp => {
                if(resp.data.trim)setMsgError(resp.data)
                else{
                    setToken('user', JSON.stringify(resp.data))
                    const idUser = resp.data.id_user
                    const logged={
                        id: idUser,
                        email: resp.data.email
                    }
                    login(logged)
                    history.push(`/transactions/${idUser}`)
                }
            }))

        }else{
            setMsgError('Email or Password Required')
        }
        

        
    }
    
    
    return (
        <div className= 'row mt-5'>
            <div className='col'></div>
            <div className='col'>
            <h1>Login Form</h1>
                <form onSubmit={LoginUser} className='form-group'>
                    <input
                        value = {email} 
                        onChange={(e)=>{setEmail(e.target.value)}}
                        className= 'form-control'
                        placeholder='Introduce your email'
                        type='email'
                        />
                    <input
                        value={pass}
                        onChange={(e)=>{setPass(e.target.value)}}
                        className= 'form-control mt-3'
                        placeholder='Introduce your pass'
                        type='password'
                        
                        />
                    <input
                        className= 'btn btn-primary btn-block mt-4'
                        value='Login'
                        type='submit'/>
                        {
                            msg === 'Successful registration'?
                            (  <div className='alert alert-warning mt-3' role='alert' >
                            {msg}
                           
                        </div>):(
                            <span></span>
                        )}
              
                </form>

                { 
                    msgError != null ?
                    (
                        <div className='alert alert-warning mt-3' role='alert' >
                            {msgError}
                           
                        </div>
                    )
                    :
                    (
                        
                    <span> </span>
                    )
                }
        
                
            </div>
            <div className='col'></div>
        </div>
    )
}

export default Login
