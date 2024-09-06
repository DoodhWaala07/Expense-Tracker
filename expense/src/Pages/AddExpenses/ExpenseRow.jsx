import MyForm from '../../Global/Form/MyForm'
import InputField from '../../Global/InputField'
import './expenseRow.css'
import { useEffect, useState } from 'react'

export default function ExpenseRow() {
    const [expenseFields, setExpenseFields] = useState({
        'Category': {value: '', placeholder: '', type: 'select', ref: {}, req: true, api: '/category'},
        'Sub-Category': {value: '', placeholder: '', type: 'select', ref: {}, req: true, disabled: true, api: '/subcategory'},
        'Quantity': {value: '', placeholder: '', type: 'number', ref: {}, req: true},
        'Amount': {value: '', placeholder: '', type: 'number', ref: {}, req: true},
        'Note': {value: '', placeholder: '', type: 'text', ref: {}, req: true},
    })

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