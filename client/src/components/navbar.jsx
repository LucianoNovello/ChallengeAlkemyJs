import React,{useContext, useEffect} from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/auth'


const Menu = () => {
    const history = useHistory()
    const {loggedUser}= useContext(AuthContext) 
    useEffect(()=>{
        if(!loggedUser)
        history.replace('/logout')
    },[loggedUser?.id])
    return (
        <div>
            <nav className='navbar navbar-expand-lg navbar-dark bg-dark '>
                <ul className='navbar-nav mr-auto'>
                    <li className='nav-item'>
                        <Link className='nav-link' to='/'>Inicio</Link>
                    </li>
                    <li>
                    {
                    !loggedUser ?
                    (
                        <Link className='nav-link' to='/'>Login</Link>
                    )
                    :
                    (
                        <Link 
                        className= 'btn btn-danger ' to='/logout'> Sign Out</Link>
                    ) 
                }
                        
                    </li>
               
                </ul>
          
            </nav>
        </div>
    )

            }
export default Menu
