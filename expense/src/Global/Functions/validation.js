export function validateEmptyFields(fields, setFields) {
    let errors = {}
    Object.entries(fields).forEach(([key, field]) => {
        let value = field.value.Name || field.value
        if (value.trim() === "" && field.req) {
            errors[key] = `${field.label || (field.placeholder || key)} cannot be empty`
        } else {
            if(field.type === 'number' && field.value !== '' && isNaN(Number(field.value))) {
                errors[key] = `${field.label || key} must be a number`
                console.log(Number(field.value))
            }
        }
        if(field.error){
            errors[key] = field.error
        }
    })
    setFields(prev => {
        Object.entries(errors).forEach(([key, error]) => {
            prev[key].error = error
            
            // prev[key].ref.current.style.borderColor = 'blue'
        })
        return {...prev}
    })
    return errors
}