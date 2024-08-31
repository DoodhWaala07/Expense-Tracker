export default function search({input, type = '', setState, api}){
    // console.log('Testing123')
    let req = {'input': input, 'type': type}
    if(input){
    setState('loading')
    fetch(api, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(req)
    }).then(res => {
        if(res.status != 404){
           return res.json()
        } else {
            return null
        }
    })
    .then(res => {
        // console.log(res)
        if(res){
            setState(res)
        } else {
            setState()
        }
    })
} else {setState()}
}