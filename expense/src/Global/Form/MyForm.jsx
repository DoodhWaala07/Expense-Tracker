import './form.css'
import { createContext } from 'react'

export const FormContext = createContext()

export default function MyForm({children, fields, setFields}) {
    return (
        <FormContext.Provider value={{fields: fields, setFields: setFields}}>
        <div className='formWrapper'>
            {children}
        </div>
        </FormContext.Provider>
    )
}