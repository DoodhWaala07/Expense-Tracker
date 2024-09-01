export default function formatData(fields){
    let data = {}
    Object.entries(fields).forEach(([key, field]) => {
        data[key] = field.value
    })
    return data
}