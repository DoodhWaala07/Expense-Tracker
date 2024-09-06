import axios from 'axios'

// export default function search({input, type = '', setState, api}){
//     // console.log('Testing123')
//     let req = {'input': input, 'type': type}
//     if(input){
//     setState('loading')
//     fetch(api, {
//         method: 'POST',
//         headers: {"Content-Type": "application/json"},
//         body: JSON.stringify(req)
//     }).then(res => {
//         if(res.status != 404){
//            return res.json()
//         } else {
//             return null
//         }
//     })
//     .then(res => {
//         // console.log(res)
//         if(res){
//             setState(res)
//         } else {
//             setState()
//         }
//     })
// } else {setState()}
// }

export default function search({input, type = '', setState, api, page = 1, list, pagination = false}){
    if(api){
        searchAPI({input, type, setState, api, page, pagination})
    }
    if(list){
        staticLists({input, type, setState, api, page, list})
    }
}

// export function searchAPI({input, type = '', setState, api, page = 1}){
//     console.log('Testing123')
//     let req = {'input': input, 'type': type}
//     // if(input){
//     // setState(prev => {
//     //     return 'loading'
//     // })
//     try{
//         axios.get(api, {
//             params : {
//                 'page': page,
//                 'input': input,
//                 'type': type
//             }
//         })
//         .then(res => {
//             // console.log(res)
//             if(res){
//                 console.log(res.data)
//                 // setState(prev => [...prev, ...res.data])
//             } else {
//                 console.log('No data found')
//                 // setState()
//             }
//         })
//     } catch(err){
//         console.log(err)
//     }
// // } else {setState()}
// }

export function searchAPI({input, type = '', setState, api, page = 1, limit, pagination}){
    console.log('Testing123')
    let req = {'input': input, 'type': type}
    // if(input){
    setState(prev => {
        return {...prev, loading : true}
    })
    try{
        axios.get(api, {
            params : {
                'page': page,
                'input': input,
                'type': type,
                'limit': limit
            }
        })
        .then(res => {
            // console.log(res)
            if(res){
                console.log(res.data)
                setState(prev => {
                    let dummy
                    return dummy = pagination ? {loading: false, data : prev.data ? [...prev.data, ...res.data] : res.data} : {...prev, loading: false, data : res.data}
                    // return {...prev, loading: false, data : res.data}
                })
            } else {
                console.log('No data found')
                setState({data: null, loading: false})
            }
        })
    } catch(err){
        console.log(err)
    }
// } else {setState()}
}

export function staticLists({input, type = '', setState, api, page = 1, list}){
    // setState(prev => {
    //     return {...prev, data: list}
    // })
    setState(prev => {
        return {...prev, data: input ? filterList({list: list, input: input}) : list}   
    })
}

export function filterList({list, input}){
    return list?.filter(item => item.toLowerCase().includes(input?.toLowerCase()))
}

