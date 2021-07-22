import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router'
import { useParams } from 'react-router-dom'
import Axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'
import uniqid from 'uniqid'
import { AuthContext } from '../contexts/auth'
import moment from 'moment'

const Form = () => {
    const history = useHistory()
    const { loggedUser } = useContext(AuthContext)
    const [amount, setAmount] = useState('')
    const [concept, setConcept] = useState('')
    const [typeMovement, setTypeMovement] = useState('')
    const [category, setCategory] = useState('')
    const [transDate, setTransDate] = useState('')
    const [transList, setTransList] = useState([])
    const [error, setError] = useState('')
    const[idTransaction, setIdTransaction]= useState('')
    const { idUser } = useParams()
    const [edit, setEdit] = useState('')
    const id_user = { id_user: idUser } 
    useEffect(() => {
        if (!loggedUser)
            history.replace('/logout')
    }, [])
    const TYPE_MOVEMENTS_OPTIONS = [
        {label: 'SELECT 1 OPTION', value:'Undefined'},
        { label: 'Deposit', value: 'Deposit' },
        { label: 'Extraction', value: 'Extraction' }
    ]
    const getTransactions = (e) => {

        Axios.post('http://localhost:4000/transactions/getTransactionsByIdUser', id_user).then((response) => {

            if (response.data.trim) {
                alert(response.data)

            }
            else {
                setTransList(response.data);
            }

        })
    }
    const setTransaction = (e) => {
        e.preventDefault()
        Axios.post("http://localhost:4000/transactions/add", {
            id_transaction: uniqid(),
            amount: amount,
            concept: concept,
            type_movement: typeMovement,
            category: category,
            id_user: idUser,
            trans_date: transDate
        }).then(() => {
            alert("success insert")
            getTransactions()
        })
    }
    const deleteTransaction = (id_transaction) => {

        Axios.delete("http://localhost:4000/transactions/delete", { data: { id_transaction } }).then(() => {
            if (transList.length === 1) {
                setTransList([])
            }
            getTransactions()
            alert('success delete')
        })

    }
    const editTransaction = (e) => {
        e.preventDefault()
        
            const transactionEdited = {
                amount: amount,
                concept: concept,
                trans_date: transDate,
                category: category,
                type_movement: typeMovement,
                id_transaction: idTransaction
            }
    
                 Axios.patch("http://localhost:4000/transactions/editTransaction", transactionEdited).then((resp => {
                    setAmount('')
                    setConcept('')
                    setTransDate('')
                    setCategory('')
                    setTypeMovement('')
                    setIdTransaction('')
                    setEdit(false)
                    getTransactions()
                    alert('Sucess')
                }))
          
        }
          

 
    const editAvailable = (id_transaction) => {
        
        Axios.post("http://localhost:4000/transactions/getByIdTransaction", {id_transaction}).then((response) => {
            setAmount(response.data[0].amount)
            setCategory(response.data[0].category)
            setConcept(response.data[0].concept)
            setTransDate(moment(response.data[0].trans_date).format("YYYY-MM-DD"))
            setTypeMovement(response.data[0].type_movement)
            setIdTransaction(response.data[0].id_transaction)
            setEdit(true)
    }
        )}

        /*const foundCategories = async (e) =>{
            e.preventDefault();
    
    
            try{
                const resp = await Axios.post("http://localhost:4000/transactions/foundTransactionsByCategory", { id_user :loggedUser.id, category}).then(resp =>{
                    setTransactionList(resp.data)
                })
            }catch(e){console.log(e);}
    
        }*/


    return (
        <div className="container ">
            <div className="row">
                <div className="col">
                    <h2>Transaction Form</h2>
                    <form onSubmit={!edit ? (setTransaction) : (editTransaction)} className="form-group">
                        <p>Concept</p>
                        <input value={concept} onChange={(e) => { setConcept(e.target.value) }} placeholder="Introduce Concept" className="form-control mb-3" type="text" required></input>
                        <br/>
                        <p>Amount</p>
                        <input value={amount} onChange={(e) => { setAmount(e.target.value) }} placeholder="Introduce Amount" className="form-control mb-3" type="number" required></input>
                        <div className='mb-3'>
                            <br></br>
                                <label className = " justify-content-between">Type of Movement</label>
                                {
                                    edit ?
                                        (
                                            <h2>{typeMovement}</h2>
                                        )
                                        :
                                        (
                                            <div>
                                            <select className='mt-2' onChange={(e) => setTypeMovement(e.target.value)}   defaultValue={TYPE_MOVEMENTS_OPTIONS[1].value} required >
                                                {TYPE_MOVEMENTS_OPTIONS.map((o, i) => (
                                                    <option key={i} value={o.value}>{o.label}</option>
                                                ))}
                                            </select>
                                            </div>
                                        )
                                }

                            </div>
                            <br/>
                            <p>Category</p>
                        <input value={category} onChange={(e) => { setCategory(e.target.value) }} placeholder="Introduce Category" className="form-control mb-3" type="text" required ></input>
                        <br/>
                        <p>Introduce date of the transaction</p>
                        <input value={transDate} onChange={(e) => { setTransDate(e.target.value) }} className="form-control mb-3" type="date" required ></input>
                        {!edit ?
                            (<input value='Add TRANSACTION' className="btn btn-dark btn-block mb-3" type="submit"></input>) :
                            (
                                <input value='Edit TRANSACTION' className="btn btn-dark btn-block mb-3" type="submit"></input>)
                        }
                    </form>
                    <button onClick={getTransactions} className="btn btn-success btn-block mt-3">GIVE ME LIST</button>



                </div>
                <div className="col d-flex flex-column ">

                    <h2>Transacion List</h2>

                    <ul className="list-group mt-4 ">{

                        transList.length === [] ? (

                            <div>
                                <p>{error}</p>
                            </div>
                        )
                            :

                            (

                                transList.map(item => (

                                    <li className="d-flex text-align-center list-group-item mx-2" key={item.id_transaction}>
                                        <div className="mx-3" >Concept {item.concept}</div>
                                        <div className="mx-3"> Amount {item.amount}</div>
                                        <div className="mx-3"> Movement {item.type_movement}</div>
                                        <div className="mx-3"> Category {item.category}</div>
                                        <div className="mx-3 me-3"> Date {moment(item.trans_date).format("YYYY-MM-DD")}</div>
                                    
                                        <div className="container d-flex text-align-center justify-content-end">
                                            <button onClick={(id_transaction) => (editAvailable(item.id_transaction))} className="btn btn-primary btn-block mx-2">Edit</button>
                                            <button onClick={(id_transaction) => (deleteTransaction(item.id_transaction))} className="btn btn-danger btn-block">Delete</button>

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