import {useRef, useContext, createContext} from 'react'
import SearchField from './SearchFieldShipping'
import './inputFields.css'

export const FieldsContext = createContext()

export default function SearchForm({fields}){

    function fieldValues(fields){
        let values = {}
        fields.forEach(field => {
            values[field.label] = ''
        })
        return values
    }

    const values = useRef(fieldValues(fields))
    return(
        <>
        <FieldsContext.Provider value = {values}>

        {fields.map(field => {
            // return <SearchField label={field.label} placeholder={field.label} api={field.api}/>
            return <SearchField label={field.label} placeholder={field.label} searchFunction={field.search}/>

        })}

        </FieldsContext.Provider>
        
        </>
    )
}