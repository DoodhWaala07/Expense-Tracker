export function validateEmptyFields(fields, setFields) {
    let errors = {}
    Object.entries(fields).forEach(([key, field]) => {
        if (field.value === "") {
            errors[key] = `${field.label || key} cannot be empty`
        }
    })
    setFields(prev => {
        Object.entries(errors).forEach(([key, error]) => {
            prev[key].error = error
            prev[key].ref.current.style.border = '1px solid red'
        })
        return {...prev}
    })
    return errors
}