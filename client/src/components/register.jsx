import React,{ useState, useContext } from 'react'
import uniqid from 'uniqid'
import Axios from 'axios'
import {useHistory} from 'react-router-dom'
import { AuthContext } from '../contexts/auth'
const Register = () => {
    const {setMessage}= useContext(AuthContext) 
    const [email, setEmail]= useState('')
    const [pass, setPass]= useState('')
    const history = useHistory()
    const [msgError, setMsgError]=useState(null)
    const isAValidCase = () => {
        if (!email.trim() && !pass.trim()) setMsgError('Params cant be null');
        if (!pass.trim()) setMsgError('Password cant be null');
        else return email !== '' && pass !== '';
      }
    const RegisterUser=async(e)=>{
        e.preventDefault()
        const validCase = isAValidCase()
        if(validCase){
        const user={
        id_user : uniqid(),
        email: email,
        pass: pass,
            }
            await Axios.post('http://localhost:4000/user/signup', user).then((resp => {
                if (resp.data.trim) {
                    if (resp.data === 'Successful registration') {
                        setMessage(resp.data)
                        history.push('/')
                    }
                    else{
                        setMsgError(resp.data)
                    }
                }
                
                

    }))
     
  
    setEmail('')
    setPass('')
}
    }
   return (
        <div className= "row mt-5">
            <div className="col"></div>
            <div className="col">
            <h1>Register Form</h1>
                <form onSubmit={RegisterUser} className='form-group'>
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
                        value='Register'
                        type='submit'/>
                        
              
                </form>

                {
                    msgError !== null ?
                    (
                        <div className="alert alert-warning mt-3" role="alert" >
                            {msgError}
                        </div>
                    )
                    :
                    (
                    <span> </span>
                    )
                }
                
            </div>
            <div className="col"></div>
        </div>
    )

            }
export default Register
