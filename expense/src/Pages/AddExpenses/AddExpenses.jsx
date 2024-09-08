import axios from 'axios'
import { DialogBoxContext } from '../../Global/DialogBox'
import axiosError, { axiosLoading } from '../../Global/Functions/axiosError'
import './addExpenses.css'
import ExpenseRow from './ExpenseRow'
import { useState, createContext, useEffect, useContext, useRef } from 'react'
import MyForm from '../../Global/Form/MyForm'
import InputField from '../../Global/InputField'
import formatData from '../../Global/Functions/formatData'

export const RowsContext = createContext()

export default function AddExpenses() {
    const [rows, setRows] = useState([''])
    // const [errors, setErrors] = useState({})
    const {setDialogBox, resetDialogBox} = useContext(DialogBoxContext)
    const rowRefs = useRef([])

    const [globalFields, setGlobalFields] = useState({
        'Note': {value: '', placeholder: 'Transaction_Note', type: 'text', ref: {}, req: true},
    })

    function addRow() {
        setRows(prev => [...prev, {}])
    }

    function confirm(){
        // setRows(prev => {
        //     let list = ['']
        //     return [...list]
        // })
        setRows([''])
        resetDialogBox()
    }

    function addExpenses(){
        // console.log(rows)
        // axios.post('/expenses', {rows: rows, globalFields: formatData(globalFields)})
        // .then(res => {
        //     let msg = 'Expenses added successfully.'
        //     setRows([])
        //     setDialogBox(prev => ({msg, confirm: confirm, close: null, show: true}))
        // })
        // .catch(error => {
        //     console.log(error)
        //     axiosError({error, setDialogBox, resetDialogBox})
        // })
        // axiosLoading({setDialogBox})
        // console.log(rowRefs[0].current.expsenseFields)
        rowRefs.current[0].setExpenseFields(prev => {
            return {
                ...prev,
                ['Category']: {value: 'The', placeholder: 'CATEGORY', type: 'text', ref: {}, req: true, error: 'This is an error.'},
            }
        })
    }

    return (
        <RowsContext.Provider value={{rows: rows, setRows: setRows}}>
        <div className='addExpenses-main'>
            <h1>Add Expenses</h1>
            <div className='addExpenses-globalDetails'>
                <h2>Global Details</h2>
                <MyForm fields={globalFields} setFields={setGlobalFields}>
                    {Object.entries(globalFields).map(([key, field], i) => (
                        <InputField key = {i} id = {key} label = {field.label || key} placeholder = {field.label || field.placeholder || key} 
                        type = {field.type} ref = {field.ref} error={field.error} className={field.className}/>
                    ))}
                </MyForm>
            </div>
            <h2 style={{alignSelf: 'flex-start', marginLeft: '15px'}}>Expenses</h2>
            {rows.map((row, index) => <ExpenseRow key={index} index={index} ref={(el) => rowRefs.current[index] = el}/>)}
            <p className='addExpenseRowBtn' onClick={addRow}>Add new</p>
            <p className='btn' style={{width: '50%'}} onClick={addExpenses}>Add Expenses</p>
        </div>
        </RowsContext.Provider> 
    )
}