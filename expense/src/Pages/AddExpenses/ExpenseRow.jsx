import MyForm from '../../Global/Form/MyForm'
import InputField from '../../Global/InputField'
import './expenseRow.css'
import { useEffect, useState, useContext, forwardRef, useRef, useImperativeHandle } from 'react'
import { RowsContext } from './AddExpenses'

const ExpenseRow = forwardRef( ({index}, ref) => {
    const [expenseFields, setExpenseFields] = useState({
        'Category': {value: '', placeholder: '', type: 'select', ref: {}, req: true, api: '/api/category'},
        'Sub_Category': {value: '', placeholder: 'Sub-Category', type: 'select', ref: {}, req: true, disabled: true, api: '/api/subcategory'},
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

    const {setRows} = useContext(RowsContext)
    const [contextMenu, setContextMenu] = useState(false)
    const contextMenuRef = useRef()
    const [position, setPosition] = useState({x: 0, y: 0})

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

    function deleteRow() {
        setRows(prev => {
            return [...prev.filter(row => row !== index)]
        })
    }

    const options = {
        'Delete': {onClick: deleteRow}
    }

    function showContextMenu(e) {
        e.preventDefault()
        e.stopPropagation()
        setPosition({x: e.pageX, y: e.pageY})
        setContextMenu(true)
    }

    function hideContextMenu() {
        setContextMenu(false)
    }

    useEffect(() => {
        document.addEventListener('click', hideContextMenu)
        return () => {
            document.removeEventListener('click', hideContextMenu)
        }
    }, [])

    return(
        <>
        <div className='expRowWrapper' onContextMenu={showContextMenu}>
            <MyForm fields={expenseFields} setFields={setExpenseFields}>
                {Object.entries(expenseFields).map(([key, field], i) => (
                    <InputField key = {i} id = {key} label = {field.label || key} placeholder = {field.label || field.placeholder || key} type = {field.type} ref = {field.ref} error={field.error} className={field.className}/>
                ))}
            </MyForm>
            {contextMenu && <ContextMenu options={options} setContextMenu={setContextMenu} ref={contextMenuRef} position={position}/>}
        </div>
        <p className='addExpenseRowBtn' style={{alignSelf:'flex-start', marginLeft: '15px'} } onClick={deleteRow}>Delete</p>
        </>
    )
})

const ContextMenu = forwardRef(({options, setContextMenu, position}, ref) => {

    useEffect(() => {
        let x = position.x
        let y = position.y
        ref.current.style.top = y + 'px'
        ref.current.style.left = x + 'px'
    }, [position])

    function onClick(e, option){
        // setContextMenu(false)
        option.onClick()
    }

    return (
        <div className='contextMenu' ref={ref}>
            {Object.entries(options).map(([name, option], i) => {
                return (
                <>
                    <div key={i} tabIndex={0} className='contextMenuOption' onClick={(e) => onClick(e, option)} onTouchStart={(e) => (e.target.focus())} >{name}</div>
                </>
                )
            })
            }
        </div>
    )
})

export default ExpenseRow