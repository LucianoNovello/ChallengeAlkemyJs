import React,{useContext, useEffect} from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/auth'


const Menu = () => {
    const history = useHistory()
    const {userLogin}= useContext(AuthContext) 
    useEffect(()=>{
   
        if(!userLogin)
        history.replace('/logout')
    },[userLogin?.id])
   
    return (
        <div>
            <nav className='navbar navbar-expand-md navbar-dark bg-primary '>
                <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
                    <li className='nav-item'>
                   
                    </li>
                    <li>
                    {
                    !userLogin ?
                    (
                    <div className='navbar-nav me-auto mb-2 mb-lg-0'>
                        <Link className='nav-link mx-3' exact to='/'>Login</Link>
                        <Link className= 'nav-link mx-3' to='/register'>Register</Link>
                    </div>
                    )
                    :
                    (
                        <Link 
                        className= 'btn btn-danger mx-3 ' to='/logout'> Sign Out</Link>
                    ) 
                }
                        
                    </li>
               
                </ul>
          
            </nav>
        </div>
    )

            }
export default Menu
