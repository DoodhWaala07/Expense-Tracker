import MyForm from '../../Global/Form/MyForm'
import InputField from '../../Global/InputField'
import './expenseRow.css'
import { useEffect, useState, useContext, forwardRef, useImperativeHandle } from 'react'
import { RowsContext } from './AddExpenses'

const ExpenseRow = forwardRef( ({index}, ref) => {
    const [expenseFields, setExpenseFields] = useState({
        'Category': {value: '', placeholder: '', type: 'select', ref: {}, req: true, api: '/category'},
        'Sub_Category': {value: '', placeholder: 'Sub-Category', type: 'select', ref: {}, req: true, disabled: true, api: '/subcategory'},
        'Quantity': {value: '', placeholder: '', type: 'number', ref: {}, req: true},
        'Amount': {value: '', placeholder: '', type: 'number', ref: {}, req: true},
        'Note': {value: '', placeholder: '', type: 'text', ref: {}, className: 'expenseNote'},
    })

    useImperativeHandle(ref, () => {
        return {
            // expenseFields: () => {
            //     return expenseFields
            // },
            expenseFields: expenseFields,
            setExpenseFields: setExpenseFields
        }
    })

    // const {setRows} = useContext(RowsContext)

    // useEffect(() => {
    //     setRows(prev => {
    //         // prev[index] = Object.entries(expenseFields).reduce((acc, [key, field]) => {
    //         //     console.log()
    //         //     acc[key] = field.value
    //         //     return acc
    //         // })
    //         let newObj = {}
    //         Object.entries(expenseFields).forEach(([key, field]) => {
    //             key = key === 'Sub-Category' ? 'Sub_Category' : key
    //             newObj[key] = field.type === 'number' && field.value === '' ? 0 : (field.value.ID || field.value)
    //         })
    //         console.log(newObj)
    //         prev[index] = newObj
    //         return [...prev]
    //     })
    // }, [expenseFields])

    useEffect(() => {
        console.log('Changing Category')
        let value2 = expenseFields['Category'].value
        if(value2) {
            setExpenseFields(prev => {
                return {
                    ...prev,
                    'Sub_Category': {...prev['Sub_Category'], disabled: false, value: '', metadata: value2}
                }
            })
        } else {
            setExpenseFields(prev => {
                return {
                    ...prev,
                    'Sub_Category': {...prev['Sub_Category'], disabled: true, value: ''}
                }
            })
        }
    }, [expenseFields['Category']])

    return(
        <div className='expRowWrapper'>
            <MyForm fields={expenseFields} setFields={setExpenseFields}>
                {Object.entries(expenseFields).map(([key, field], i) => (
                    <InputField key = {i} id = {key} label = {field.label || key} placeholder = {field.label || field.placeholder || key} type = {field.type} ref = {field.ref} error={field.error} className={field.className}/>
                ))}
            </MyForm>
        </div>
    )
})

export default ExpenseRow