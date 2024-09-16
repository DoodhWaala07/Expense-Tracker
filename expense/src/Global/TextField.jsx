import { useContext } from "react"
import { FormContext } from "./Form/MyForm"
import Error from "./Error"
import CoreField from "./CoreField"

export default function TextField({label, placeholder, id, type}){
    const {fields, setFields} = useContext(FormContext)
    function isNumber(input) {
        return !isNaN(parseFloat(input));
      }
      function keepOnlyNumbers(str) {
        return str.replace(/[^\.0-9\s]/g, '');
      }
    function onChange(e){
        // if((type === 'number' && isNumber(e.target.value)) || e.target.value === '' ){
        //     setFields(prev => {
        //         return {...prev, [id]: {...prev[id], value: Number(e.target.value)}}
        //     })
        // }
        if(type === 'number'){
            setFields(prev => {
                return {...prev, [id]: {...prev[id], value: keepOnlyNumbers(e.target.value)}}
            })
        }
        // if(type === 'text' || type === 'password'){
        if(type !== 'number'){
            setFields(prev => {
                return {...prev, [id]: {...prev[id], value: e.target.value}}
            })
        }
    }
    function onClick(){
        setFields(prev => {
            return {...prev, [id]: {...prev[id], error: ''}}
        })
    }

    function onBlur(e){
        if(fields[id].onBlur){
            fields[id].onBlur(e)
        }
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
            <CoreField label={label} placeholder={placeholder} id={id} type={'text'} 
            onClick={onClick} onChange={onChange} onBlur={onBlur}
            value={fields[id].value}/>
        </div>
    )
}