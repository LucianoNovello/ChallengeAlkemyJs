import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router'
import Axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'
import { AuthContext } from '../contexts/contextsutils'
import moment from 'moment'

const Edit = () => {
    const history = useHistory()
    const { userLogin,  transaction,setMessage } = useContext(AuthContext)
    const [amount, setAmount] = useState('')
    const [concept, setConcept] = useState('')
    const [typeMovement, setTypeMovement] = useState('')
    const [category, setCategory] = useState('')
    const [transDate, setTransDate] = useState('')
    const [error, setError] = useState('')
    const [idTransaction, setIdTransaction] = useState('')
    
    useEffect(() => {
       
          
       if(!userLogin){
       history.replace('/logout')
       }
       viewEdit()
        
    },[userLogin?.id])
    const TYPE_CATEGORY_OPTIONS = [
        { label: 'SELECT 1 OPTION', value: 'Undefined' },
        { label: 'Sales', value: 'Sales' },
        { label: 'Purchases', value: 'Purchases' },
        { label: 'Receipts', value: 'Receipts' },
        { label: 'Payments', value: 'Payments' }
    ]
    const TYPE_MOVEMENTS_OPTIONS = [
        { label: 'SELECT 1 OPTION', value: 'Undefined' },
        { label: 'Deposit', value: 'Deposit' },
        { label: 'Extraction', value: 'Extraction' }
    ]

    const viewEdit = async ()=>{
        Axios.post('http://localhost:4000/transactions/getByIdTransaction', { id_transaction:transaction},{headers:{authorization:"Bearer "+userLogin.token}}).then((response) => {
            setAmount(response.data[0].amount)
            setCategory(response.data[0].category)
            setConcept(response.data[0].concept)
            setTransDate(moment(response.data[0].trans_date).format('YYYY-MM-DD'))
            setTypeMovement( response.data[0].type_movement)
            setIdTransaction (response.data[0].id_transaction)
    })
    }

    const editTransaction = async (e) => {
        e.preventDefault()

        const transactionEdited = {
            amount: amount,
            concept: concept,
            trans_date: transDate,
            category: category,
            type_movement: typeMovement,
            id_transaction: idTransaction
        }
        try {
            await Axios.patch('http://localhost:4000/transactions/editTransaction', transactionEdited,{headers:{authorization:"Bearer "+userLogin.token}}).then((resp => {
                setAmount('')
                setConcept('')
                setTransDate('')
                setCategory('')
                setTypeMovement('')
                setIdTransaction('') 
                setMessage('Edited successfully')
                history.push(`/transactions/${userLogin.id}`)
               
            }))
        } catch (err) {
            setError('Error en la base de datos')
        }

    }
        const back = (e) => {
            e.preventDefault()
            setAmount('')
            setConcept('')
            setTransDate('')
            setCategory(TYPE_CATEGORY_OPTIONS[0].value)
            setTypeMovement(TYPE_MOVEMENTS_OPTIONS[0].value)
            setError('')
            history.push(`/transactions/${userLogin.id}`)
    
        }

    return (
        <div className='container '>
            <div className='row'>
                <div className='col'>
                    <h2>Transaction Form</h2>
                    <form onSubmit={editTransaction} className='form-group'>
                        <p>Concept</p>
                        <input value={concept} onChange={(e) => { setConcept(e.target.value) }} placeholder='Introduce Concept' className='form-control mb-3' type='text' required></input>
                        <br />
                        <p>Amount</p>
                        <input value={amount} onChange={(e) => { setAmount(e.target.value) }} placeholder='Introduce Amount' className='form-control mb-3' type='number' min='0' required></input>
                        <div className='mb-3'>
                            <br/>
                            <label className=' justify-content-between'>Type of Movement</label>
                            {
                           
                           
                                        <h2>{typeMovement}</h2>
                            }

                        </div>
                        <br />
                        <div className='mb-3'>
                            <label className=' justify-content-between'>Category</label>
                            {
                             
                                    
                                        <select className=' form-control block mt-1' onChange={(e) => setCategory(e.target.value)} required value={category} >
                                        {
                                            TYPE_CATEGORY_OPTIONS.map((o, i) => (
                                                o.label !== 'SELECT 1 OPTION' ? (
                                                <option key={i} value={o.value}>{o.label}</option>
                                            )
                                            :
                                            (<span>

                                            </span>
                                            )
                                            )
                                            )}
                                    </select>
                                 
                            }

                        </div>
                        <br />
                        <p>Introduce date of the transaction</p>
                        <input value={transDate} onChange={(e) => { setTransDate(e.target.value) }} className='form-control mb-3' type='date' required ></input>
                        
                                <div>
                                <input value='Update Transaction' className='btn btn-primary btn-block mb-3' type='submit'></input>
                                <button onClick={back} className='btn btn-danger btn-block mb-3 mx-3 '> Back </button>
                                </div>
                        <div className=''></div>
                    </form>
                    
                    { error ?(
                        <div className='alert alert-warning mt-3' role='alert'>{error}</div>
                    ):(
                        <span></span>
                    )}



                </div>
                
                
            </div>
        </div>

    )
}
export default Edit;