import utcDate, { shortDate, shortDateTime } from '../../../Global/Functions/date'
import { ViewExpensesContext } from '../ViewExpenses'
import './expenseDisplayRow.css'
import { useContext, useEffect, useState } from 'react'

const overviewValues = ['Category', 'Sub_Category', 'Date', 'Amount']
const excludeValues = ['Transaction', 'Note', 'ID']

export default function ExpenseDisplayRow({expense, heading = false}){

    const [open, setOpen] = useState(false)
    const {windowWidth} = useContext(ViewExpensesContext)
    const [dateStyle, setDateStyle] = useState('short')

    useEffect(() => {
        if(windowWidth >=  500){
            setDateStyle('long')
        } else {
            setDateStyle('short')
        }
    }, [windowWidth])

    return(
        <div className = {heading ? 'edr-global-wrapper edr-heading-wrapper' : 'edr-global-wrapper'} onClick = {() => setOpen(prev => !prev)} 
        style={{cursor: heading ? 'default' : 'pointer', fontWeight: heading ? 'bold' : 'normal', 
        fontSize: heading ? 'normal' : 'small', marginBottom: heading ? '10px' : '0px', position: heading ? 'sticky' : 'static', top: heading ? '0' : 'unset'}}>
            <div className = 'edr-wrapper'>
                {Object.entries(expense).map(([key, value], i) => {
                    if(key === 'Date' && !heading){
                        value = dateStyle === 'long' ? shortDateTime(value) : shortDate(value)
                    }
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