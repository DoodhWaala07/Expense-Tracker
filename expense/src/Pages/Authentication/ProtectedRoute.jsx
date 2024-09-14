import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import Authentication from './Authentication'
import { Navigate } from 'react-router'
import AddCategory from '../AddCategory/AddCategory'
import { AuthContext } from './Authenticator'
import { DialogBoxContext } from '../../Global/DialogBox'

export default function ProtectedRoute({children}) {
    // const [auth, setAuth] = useState(false)
    const {auth, setAuth} = useContext(AuthContext)
    const {dialogBox, setDialogBox, resetDialogBox} = useContext(DialogBoxContext)

    console.log('Rendering ProtectedRoute')
    console.log('Auth: ' + auth)

    useEffect(() => {
        console.log('Checking Auth')
        axios.get('/api/auth/checkToken', {withCredentials: true})
        .then(res => {
            setAuth(true)
        })
        .catch(err => {
            console.log(err)
            setAuth(false)
        })
    })

    useEffect(() => {
        console.log('I AM CHANGING AUTH')
        console.log(auth)
        // if(auth === 'loading'){
        //     setDialogBox(prev => ({spinner: true, confirm: null, close: null, show: true}))
        // } else {
        //     resetDialogBox()
        // }
    }, [auth])

    // if(auth){
    //     return children
    // } else {
    //     return <Authentication/>
    // }
    return(
        // <ProtectedRouteContext.Provider value={{auth: auth, setAuth: setAuth}}>
        <>
            {auth === true && children}
            {auth === false && <Authentication/>}
        </>
    )
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