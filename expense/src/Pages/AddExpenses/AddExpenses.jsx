import './addExpenses.css'
import ExpenseRow from './ExpenseRow'
import { useState, createContext, useEffect } from 'react'

export const RowsContext = createContext()

export default function AddExpenses() {
    const [rows, setRows] = useState([''])

    function addRow() {
        setRows(prev => [...prev, {}])
    }

    function addExpenses(){
        // let rowValues = rows.map(row => {
        //     let values = {}
        //     Object.entries(row).map(([field, fieldParams]) => {
        //         values[field] = fieldParams.value
        //     })
        //     return values
        // })
        console.log(rows)
    }

    return (
        <RowsContext.Provider value={{rows: rows, setRows: setRows}}>
        <div className='addExpenses-main'>
            <h1>Add Expenses</h1>
            {rows.map((row, index) => <ExpenseRow key={index} index={index}/>)}
            <p className='addExpenseRowBtn' onClick={addRow}>Add new</p>
            <p className='btn' style={{width: '50%'}} onClick={addExpenses}>Add Expenses</p>
        </div>
        </RowsContext.Provider> 
    )
}