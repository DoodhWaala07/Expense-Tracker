export default function Error({msg}){
    if(!msg) return null
    return(
        <p className='field-error'>{msg}</p>
    )
}