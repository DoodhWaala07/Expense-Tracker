import MyForm from '../../Global/Form/MyForm'
import InputField from '../../Global/InputField'
import './expenseRow.css'
import { useEffect, useState, useContext } from 'react'
import { RowsContext } from './AddExpenses'

export default function ExpenseRow({index}) {
    const [expenseFields, setExpenseFields] = useState({
        'Category': {value: '', placeholder: '', type: 'select', ref: {}, req: true, api: '/category'},
        'Sub-Category': {value: '', placeholder: '', type: 'select', ref: {}, req: true, disabled: true, api: '/subcategory'},
        'Quantity': {value: '', placeholder: '', type: 'number', ref: {}, req: true},
        'Amount': {value: '', placeholder: '', type: 'number', ref: {}, req: true},
        'Note': {value: '', placeholder: '', type: 'text', ref: {}, req: true},
    })

    const {setRows} = useContext(RowsContext)

    useEffect(() => {
        setRows[index] = expenseFields
    }, [expenseFields])

    useEffect(() => {
        console.log('Changing Category')
        let value2 = expenseFields['Category'].value
        if(value2) {
            setExpenseFields(prev => {
                return {
                    ...prev,
                    'Sub-Category': {...prev['Sub-Category'], disabled: false, value: '', metadata: value2}
                }
            })
        } else {
            setExpenseFields(prev => {
                return {
                    ...prev,
                    'Sub-Category': {...prev['Sub-Category'], disabled: true, value: ''}
                }
            })
        }
    }, [expenseFields['Category']])

    return(
        <div className='expRowWrapper'>
            <MyForm fields={expenseFields} setFields={setExpenseFields}>
                {Object.entries(expenseFields).map(([key, field], i) => (
                    <InputField key = {i} id = {key} label = {field.label || key} placeholder = {field.label || field.placeholder || key} type = {field.type} ref = {field.ref} error={field.error}/>
                ))}
            </MyForm>
        </div>
    )
}