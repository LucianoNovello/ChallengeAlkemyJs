/* eslint-disable array-callback-return */
import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router'
import Axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'
import { AuthContext } from '../contexts/contextsutils'
import moment from 'moment'


const Form = () => {
    const history = useHistory()
    const { userLogin, setTrans, msg } = useContext(AuthContext)
    const [amount, setAmount] = useState('')
    const [concept, setConcept] = useState('')
    const [typeMovement, setTypeMovement] = useState('')
    const [category, setCategory] = useState('')
    const [transDate, setTransDate] = useState('')
    const [transList, setTransList] = useState([])
    const [error, setError] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [totalAmount, setTotalAmount] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {

        if (!userLogin) {
            history.replace('/logout')
        }
        getTransactions()

        if (msg) {
            setSuccess(msg)
        }
    }, [userLogin?.id])

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

    const getTransactions = async () => {

        const user = {
            id_user: userLogin.id
        }

        try {

            await Axios.get(`http://localhost:4000/transactions/list/${user.id_user}`, { headers: { authorization: "Bearer " + userLogin.token } }).then((resp) => {

                if (resp.data === 'Empty list') {
                    setError(resp.data)

                }
                else {

                    setTransList(resp.data);
                    setError('')

                }

            })

        } catch (err) {
            setError('Error en base de datos')
        }

        totalMovements()
    }

    const setTransaction = async (e) => {
        e.preventDefault()
        const transaction = {
            amount: amount,
            concept: concept,
            type_movement: typeMovement,
            category: category,
            id_user: userLogin.id,
            trans_date: transDate,
        }
        if (amount >= 0) {
            try {
                await Axios.post('http://localhost:4000/transactions/', transaction, {
                    headers: { authorization: "Bearer " + userLogin.token }
                }).then(() => {
                    getTransactions()
                    setSuccess('Added successfully')

                })
            }
            catch (err) {
                setError('Error en base de datos')
            }

        } else {
            setError('Put a positive amount')
        }
    }

    const deleteTransaction = async (id_transaction) => {

        try {
            await Axios.delete('http://localhost:4000/transactions/', {
                headers: { authorization: "Bearer " + userLogin.token }, data: {
                    id_transaction
                }
            }).then(() => {

                if (transList.length === 1) {
                    setTransList([])
                }
                getTransactions()
                setSuccess('Successfully deleted')
            })
        } catch (err) {
            setError('Error en base de datos')
        }

    }

    const editAvailable = async (id_transaction) => {
        try {
            setTrans(id_transaction)
            history.push('/transactionsedit')

        } catch (err) {
            setError('ErrorDatabase')
        }
    }

    const filterByCategories = async (e) => {
        e.preventDefault();

        try {
            await Axios.get(`http://localhost:4000/transactions/filterCategory/${selectedCategory}/${userLogin.id}`,
                { headers: { authorization: "Bearer " + userLogin.token } }).then(resp => {
                    if (resp.data === 'Empty list') {
                        setTransList([])
                        setError(resp.data)

                    }
                    else {
                        setTransList(resp.data)
                        setError('')

                    }
                })
        } catch (err) {
            console.log(e)
        }

    }

    const totalMovements = async () => {

        let totalDeposit = 0
        let totalExtractions = 0
        let res = 0
        try {
            await Axios.get(`http://localhost:4000/transactions/list/${userLogin.id}`, { headers: { authorization: "Bearer " + userLogin.token } }).then((resp) => {
                if (resp.data.trim) {
                    setError(resp.data)
                 
                }
                else {
                    if (transList === []) {
                        setError('Empty list')
                    }

                    resp.data.map(item => {
                        if (item.type_movement === 'Deposit') {
                            totalDeposit += item.amount
                        }
                        else totalExtractions += item.amount
                    })
                }
                res = totalDeposit - totalExtractions
                setTotalAmount(res)
            })

        }
        catch (err) {
            console.log(err)
        }


    }


    return (
        <div className='container '>
            <div className='row'>
                <div className='col'>
                    <h2>Transaction Form</h2>
                    <form onSubmit={(setTransaction)} className='form-group'>
                        <p>Concept</p>
                        <input value={concept} onChange={(e) => { setConcept(e.target.value) }} placeholder='Introduce Concept' className='form-control mb-3' type='text' required></input>
                        <br />
                        <p>Amount</p>
                        <input value={amount} onChange={(e) => { setAmount(e.target.value) }} placeholder='Introduce Amount' className='form-control mb-3' type='number' min='0' required></input>
                        <div className='mb-3'>
                            <br></br>
                            <label className=' justify-content-between'>Type of Movement</label>
                            {
                                <div>
                                    <select className='mt-2' onChange={(e) => setTypeMovement(e.target.value)} defaultValue={TYPE_MOVEMENTS_OPTIONS[0].value} required >
                                        {TYPE_MOVEMENTS_OPTIONS.map((o, i) => (
                                            <option key={i} value={o.value}>{o.label}</option>
                                        ))}
                                    </select>
                                </div>

                            }

                        </div>
                        <br />
                        <div className='mb-3'>
                            <label className=' justify-content-between'>Category</label>

                            <div>
                                <select className='mt-2' onChange={(e) => setCategory(e.target.value)} defaultValue={TYPE_CATEGORY_OPTIONS[0].value} required >
                                    {TYPE_CATEGORY_OPTIONS.map((o, i) => (
                                        <option key={i} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>


                        </div>
                        <br />
                        <p>Introduce date of the transaction</p>
                        <input value={transDate} onChange={(e) => { setTransDate(e.target.value) }} className='form-control mb-3' type='date' required ></input>
                        <input value='Add Transaction' className='btn btn-primary btn-block mb-3' type='submit'></input>
                        <div className=''></div>
                    </form>

                    {success ? (
                        <div className='alert alert-warning mt-3' role='alert'>{success}</div>
                    ) : (
                        <span></span>
                    )}

                </div>
                <div className='col d-flex flex-column '>

                    <h2>Transacion List</h2>


                    <ul className='list-group mt-4 '>
                        {
                            error === 'Empty list' ? (

                                <div className='col d-flex flex-column'>
                                    <h2>{error}</h2>
                                </div>
                            )
                                :

                                (

                                    transList.map(item => (

                                        <li className='d-flex text-align-center list-group-item mx-2' key={item.id_transaction}>
                                            <div className='mx-3' >Concept {item.concept}</div>
                                            <div className='mx-3'> Amount {item.amount}</div>
                                            <div className='mx-3'> Movement {item.type_movement}</div>
                                            <div className='mx-3'> Category {item.category}</div>
                                            <div className='mx-3 me-3'> Date {moment(item.trans_date).format('YYYY-MM-DD')}</div>

                                            <div className='container d-flex text-align-center justify-content-end'>
                                                <button onClick={(id_transaction) => (editAvailable(item.id_transaction))} className='btn btn-primary btn-block mx-2'>Edit</button>
                                                <button onClick={(id_transaction) => (deleteTransaction(item.id_transaction))} className='btn btn-danger btn-block'>Delete</button>

                                            </div>
                                        </li>

                                    ))
                                )
                        }</ul>
                    <div>
                        <b className='mx-2'>Filter By</b>
                        <select className=' mt-2' onChange={(e) => setSelectedCategory(e.target.value)} defaultValue={TYPE_CATEGORY_OPTIONS[0].value} required >
                            {TYPE_CATEGORY_OPTIONS.map((o, i) => (
                                o.label !== 'SELECT 1 OPTION' ?
                                    (
                                        <option key={i} value={o.value} > {o.label}</option>

                                    ) :
                                    (
                                        <span></span>
                                    )

                            ))}
                        </select>
                        <br />
                        <button onClick={getTransactions} className='btn btn-primary btn-block mt-3 mx-2'>List of Transactions without Filter</button>
                        <button onClick={filterByCategories} className='btn btn-info btn-block mt-3 '> List of Transactios with filter</button>
                    </div>
                    <div className='col d-flex flex-column mt-2'>
                        <h1>Account Balance</h1>
                        <h2>${totalAmount}</h2>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default Form;