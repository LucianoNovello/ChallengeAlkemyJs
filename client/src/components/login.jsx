import React,{ useState, useContext } from 'react'
import uniqid from 'uniqid'
import {useHistory} from 'react-router-dom'
import Axios from 'axios'
import { AuthContext } from '../contexts/auth'
const Login = () => {
    const {login}= useContext(AuthContext) 
    const history = useHistory()
    const [email, setEmail]= useState('')
    const [pass, setPass]= useState('')
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
     await Axios.post('http://localhost:4000/user/signup', user)
     
    }
    else{
        setMsgError('Email or Password invalids')
    
    }
    setEmail('')
    setPass('')
}
    const LoginUser = async(e)=>{
        e.preventDefault()
        const validCase = isAValidCase()
        if(validCase){
            const userLog ={
                email:email,
                pass:pass   
            }
            await Axios.post('http://localhost:4000/user/signin',userLog).then((resp => {
                if(resp.data.trim)setMsgError(resp.data)
                else{
                    const idUser = resp.data[0].id_user
                    const logged={
                        id: idUser,
                        email: resp.data[0].email
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
        <div className= "row mt-5">
            <div className="col"></div>
            <div className="col">
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
                        className= 'btn btn-dark btn-block mt-4'
                        value='Register'
                        type='submit'/>

                </form>

                <button onClick= {LoginUser} className="btn btn-success btn-block mt-3">Sign In</button>
                {
                    msgError != null ?
                    (
                        <div>
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

export default Login
