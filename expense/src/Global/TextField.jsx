import { useContext } from "react"
import { FormContext } from "./Form/MyForm"
import Error from "./Error"
import CoreField from "./CoreField"

export default function TextField({label, placeholder, id}){
    const {fields, setFields} = useContext(FormContext)
    function onChange(e){
        setFields(prev => {
            return {...prev, [id]: {...prev[id], value: e.target.value}}
        })
    }
    function onClick(){
        setFields(prev => {
            return {...prev, [id]: {...prev[id], error: ''}}
        })
    }
    return(
        <div className='searchFieldWrapper'>
            {/* <label className='fieldLabel'>{label.replaceAll('_', ' ')}</label><br/> */}
            {/* <input type="text" className="inputField" 
            value={fields[id].value} onChange={onChange} 
            placeholder={placeholder.replaceAll('_', ' ')}
            ref={fields[id].ref}
            style={{border: fields[id].error ? '1px solid red' : ''}}
            onClick={onClick}
            /> */}
            <CoreField label={label} placeholder={placeholder} id={id} type={'text'} onClick={onClick} onChange={onChange} value={fields[id].value}/>
        </div>
    )
}