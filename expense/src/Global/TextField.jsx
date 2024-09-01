import { useContext } from "react"
import { FormContext } from "./Form/MyForm"

export default function TextField({label, placeholder, id}){
    const {fields, setFields} = useContext(FormContext)
    function onChange(e){
        setFields(prev => {
            return {...prev, [id]: {...prev[id], value: e.target.value}}
        })
    }
    return(
        <div className='searchFieldWrapper'>
            {/* <label className='fieldLabel'>{label}</label><br/> */}
            <input type="text" className="inputField" value={fields[id].value} onChange={onChange} placeholder={placeholder}/>
        </div>
    )
}