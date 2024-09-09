export function validateEmptyFields(fields, setFields) {
    let errors = {}
    Object.entries(fields).forEach(([key, field]) => {
        if (field.value.trim() === "") {
            errors[key] = `${field.label || key} cannot be empty`
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