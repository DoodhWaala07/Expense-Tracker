export function validateEmptyFields(fields, setFields) {
    let errors = {}
    Object.entries(fields).forEach(([key, field]) => {
        if (field.value.trim() === "" && field.req) {
            errors[key] = `${field.label || key} cannot be empty`
        } else {
            if(field.type === 'number' && field.value !== '' && isNaN(Number(field.value))) {
                errors[key] = `${field.label || key} must be a number`
                console.log(Number(field.value))
            }
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