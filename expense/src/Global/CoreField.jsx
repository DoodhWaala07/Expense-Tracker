import React, { useContext } from 'react'
import { FormContext } from './Form/MyForm'
import './inputFields.css'

export default function CoreField({label, placeholder, id, type, error, onClick, onBlur, onFocus, onChange, value}) {
    const {fields, setFields} = useContext(FormContext)
    return (
        <input className= {`inputField`} placeholder={placeholder.replaceAll('_', ' ')} 
        style={{cursor: 'pointer', border: fields[id].error ? '1px solid red' : ''}} 
        onClick={(e) => onClick(e)} onFocus={onFocus}  onBlur={onBlur} onChange={onChange}
        value={value}
        ref={fields[id].ref}
        readOnly = {fields[id].type === 'select' || fields[id].type === 'search' ? true : false}
        disabled = {fields[id].disabled === null || fields[id].disabled  === undefined ? false : fields[id].disabled} 
        />
    )
}

            {/* <label className='fieldLabel'>{label.replaceAll('_', ' ')}</label><br /> */}
