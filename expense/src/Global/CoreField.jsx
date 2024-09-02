import React, { useContext } from 'react'
import { FormContext } from './Form/MyForm'

export default function CoreField({label, placeholder, id, type, error, onClick, onBlur, onFocus, onChange, value}) {
    const {fields, setFields} = useContext(FormContext)
    return (
        <input className='inputField' placeholder={placeholder.replaceAll('_', ' ')} 
        style={{cursor: 'pointer', border: fields[id].error ? '1px solid red' : ''}} 
        onClick={(e) => onClick(e)} onFocus={onFocus}  onBlur={onBlur} onChange={onChange}
        value={value}
        ref={fields[id].ref}
        />
    )
}

            {/* <label className='fieldLabel'>{label.replaceAll('_', ' ')}</label><br /> */}
