import React, {useState, useEffect, useContext} from 'react'
import { useHistory } from 'react-router'
import {useParams} from 'react-router-dom'
import Axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'
import uniqid from 'uniqid'
import { AuthContext } from '../contexts/auth'

const Form = () => {
    const datetime = new Date()
    const options = {year :'numeric', month:'long', day:'numeric'}
    const history = useHistory()
    const {loggedUser}= useContext(AuthContext) 
    const[amount, setAmount]= useState('')
    const[concept, setConcept]=useState('')
    const[typeMovement, setTypemovement]= useState('')
    const[category, setCategory]= useState('')
    const[transDate, setTransDate] = useState('')
    const[transList, setTransList]= useState([])
    const [error, setError]=useState('')
    const {idUser} = useParams()
    const id_user ={ id_user: idUser}
    useEffect(()=>{
        if(!loggedUser)
        history.replace('/logout')
    },[loggedUser?.id])
   
    const getTransactions = (e)=>{
       
        Axios.post('http://localhost:4000/transactions/getTransactionsById', id_user).then((response) => {
            
            if (response.data.trim){
              alert(response.data)
                
            } 
            else {
                setTransList(response.data);
            }

        })
    }
const setTransaction= (e)=>{
    e.preventDefault()
    Axios.post("http://localhost:4000/transactions/add",{
        id_transaction : uniqid(),
        amount: amount,
        concept: concept,
        type_movement: typeMovement,
        category: category,
        id_user  : idUser,
        trans_date:transDate
    }).then(()=>{
        alert("success insert")
        getTransactions()
    })
}
const deleteTransaction= (id_transaction)=>{
    
    Axios.delete("http://localhost:4000/transactions/delete", {data:{id_transaction}}).then(()=>{
        if(transList.length===1){
            setTransList([])
        }
        getTransactions()
        alert('success delete')
    })
}

  
    return (
       <div className="container ">
            <div className="row">
                <div className="col">
                    <h2>Transaction Form</h2>
                    <form onSubmit={setTransaction} className="form-group">
                        <input onChange={(e) => { setConcept(e.target.value) }} placeholder="Introduce Concept" className="form-control mb-3" type="text" required></input>
                        <input  onChange={(e) => { setAmount(e.target.value) }} placeholder="Introduce Mount" className="form-control mb-3" type="number" required></input>
                        <input  onChange={(e) => { setTypemovement(e.target.value) }} placeholder="Introduce if is Deposit or extraction" className="form-control mb-3" type="text" required ></input>
                        <input  onChange={(e) => { setCategory(e.target.value) }} placeholder="Introduce Category" className="form-control mb-3" type="text" required ></input>
                        <p>Introduce date of the transaction</p>
                        <input  onChange={(e) => { setTransDate(e.target.value) }}  className="form-control mb-3" type="datetime-local" required ></input>
                        <input value='Add TRANSACTION' className="btn btn-dark btn-block mb-3" type="submit"></input>
                    </form>
                    <button onClick={getTransactions} className="btn btn-success btn-block mt-3">GIVE ME LIST</button>
             
                </div>
                <div className="col d-flex flex-column ">

                    <h2>Transacion List</h2>
                    
                    <ul className="list-group mt-4 ">{
                        
                            transList.length === [] ?(
                                
                                <div>
                                <p>{error}</p>
                            </div>
                            )
                            :
    
                            (
                                            
                              transList.map(item=>(
                                                          
                                <li className= "d-flex text-align-center list-group-item mx-2" key= {item.id_transaction}>
                                    
                                   {item.concept}--{item.amount}--{item.type_movement}--{item.category}--{}
                                      <div className="container d-flex text-align-center justify-content-end">
                                      <button className="btn btn-primary btn-block mx-2">Edit</button>

                                <button onClick={(id_transaction)=>(deleteTransaction(item.id_transaction))} className="btn btn-danger btn-block">Delete</button>
                                </div>
                                </li>

                            ))
                            )        


                        }</ul>
                       
                </div> 
            </div>
     </div>

    )
}
export default Form;