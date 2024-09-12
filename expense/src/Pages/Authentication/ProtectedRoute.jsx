import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Authentication from './Authentication'
import { Navigate } from 'react-router'
import AddCategory from '../AddCategory/AddCategory'

export default function ProtectedRoute({children}) {
    console.log('Rendering ProtectedRoute')
    const [auth, setAuth] = useState(false)
    useEffect(() => {
        axios.get('/api/auth/checkToken', {withCredentials: true})
        .then(res => {
            setAuth(true)
        })
        .catch(err => {
            console.log(err)
            setAuth(false)
        })
    }, [])

    if(auth){
        return children
    } else {
        return <Authentication/>
    }
}

// export function InversePrtoectedRoute({children}) {
//     const [auth, setAuth] = useState(false)
//     useEffect(() => {
//         axios.get('/api/auth/checkToken', {withCredentials: true})
//         .then(res => {
//             setAuth(true)
//         })
//         .catch(err => {
//             console.log(err)
//             setAuth(false)
//         })
//     }, [])

//     if(!auth){
//         return children
//     } else {
//     }
// }