import './expenseDisplayRow.css'
import { useState } from 'react'

const overviewValues = ['Category', 'Sub_Category', 'Date', 'Amount']
const excludeValues = ['Transaction', 'Note', 'ID']

export default function ExpenseDisplayRow({expense, heading = false}){

    const [open, setOpen] = useState(false)

    return(
        
        <div className = 'edr-global-wrapper' onClick = {() => setOpen(prev => !prev)} style={{cursor: heading ? 'default' : 'pointer', fontWeight: heading ? 'bold' : 'normal', 
        fontSize: heading ? 'normal' : 'small', marginBottom: heading ? '10px' : '0px', position: heading ? 'sticky' : 'static'}}>
            <div className = 'edr-wrapper'>
                {Object.entries(expense).map(([key, value], i) => {
                    if(overviewValues.includes(key)){
                        return <div key = {key} className = 'edr-el'>{value}</div>
                    }
                    // return <div key = {key} className = 'edr-el'>{value}</div>
                })}
            </div>
            {open && !heading && <ExpenseDisplayDetails expense = {expense} />}
        </div>
    )
}

function ExpenseDisplayDetails({expense}){

    return(
        <div className = 'edd-wrapper'>
            {Object.entries(expense).map(([key, value], i) => {
                if(!overviewValues.includes(key) && !excludeValues.includes(key)){
                    return (
                        <div key = {key} className = {`edd-el-wrapper edd-el-${key}`} style={{gridColumn: key === 'Description' ? 'span 2' : ''}}>
                            <div className = 'edd-el-label'>{key}</div>
                            <div className = 'edd-el-value'>{value}</div>
                        </div>
                    )
                }
            })}
        </div>
    )
}