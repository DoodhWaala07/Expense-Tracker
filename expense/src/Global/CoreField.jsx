import React, { useContext } from 'react'
import { FormContext } from './Form/MyForm'
import './inputFields.css'

export default function CoreField({label, placeholder, id, type, error, onClick, onBlur, onFocus, onChange, value}) {
    const {fields, setFields} = useContext(FormContext)

    function focus(e){
        if(fields[id].onFocus){
            fields[id].onFocus(e)
        }
        setFields(prev => {
            return {...prev, [id]: {...prev[id], error: ''}}
        })
    }

    return (
        <input className= {`inputField`} placeholder={placeholder.replaceAll('_', ' ')} 
        style={{cursor: 'pointer', borderColor: fields[id].error ? 'red' : ''}} 
        onClick={(e) => onClick(e)} onFocus={focus}  onBlur={onBlur} onChange={onChange}
        value={value}
        ref={fields[id].ref}
        readOnly = {fields[id].type === 'select' || fields[id].type === 'search' ? true : false}
        disabled = {fields[id].disabled === null || fields[id].disabled  === undefined ? false : fields[id].disabled}
        type = {fields[id].type === 'password' ? 'password' : 'text'}
        />
    )
}

            {/* <label className='fieldLabel'>{label.replaceAll('_', ' ')}</label><br /> */}
