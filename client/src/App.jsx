
import './App.css'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Form from './components/transactionForm'
import Login from './components/login'
import Menu from './components/navbar'
import Logout from './components/logout'
import AuthContext from './contexts/auth'
import Register from './components/register'


function App() {
  
  
  return (
<AuthContext>
<Router>
<Menu/>
  <Switch>
  <Route exact path='/' component={Login}></Route>
  <Route   path='/login' component = {Login}></Route>
  <Route  path = '/transactions/:idUser' component={Form}></Route>
  <Route path = '/register' component = {Register}></Route>
  <Route path='/logout' component={Logout}></Route>

  </Switch>
</Router>
</AuthContext>
 
  )

}

export default App;
