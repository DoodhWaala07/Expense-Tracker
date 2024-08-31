

export default function TextField({label, placeholder, value, onChange}){

    function onChange(e){

    }
    
    return(
        <div className='textFieldWrapper'>
            <label className='fieldLabel'>{label}</label><br/>
            <input type="text" className="inputField" value={value} onChange={onChange} placeholder={placeholder}/>
        </div>
    )
}