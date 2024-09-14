import './sidePane.css'
import {useEffect, useState, useRef, useContext, createContext} from 'react'
import {CSSTransition} from 'react-transition-group'
import axios from 'axios'
import {DialogBoxContext} from '../DialogBox'
import ProtectedRoute from '../../Pages/Authentication/ProtectedRoute'
import { AuthContext } from '../../Pages/Authentication/Authenticator'
import { BrowserRouter, Route, Link, redirect, Outlet, useNavigate } from 'react-router-dom';
// import {navigate} from 'react-router-dom'


export const SidePaneContext = createContext()

export default function SidePane({children}) {

    const [open, setOpen] = useState(false)
    const sidePaneRef = useRef()
    const menuBtn = useRef()


    function menuClick(e){
        setOpen(prev => {
            // if(!prev){
            //     console.log('focus')
            //     console.log(sidePaneRef.current)
            //     sidePaneRef.current?.focus()
            // }
            return !prev
        })
    }

    function onBlur(e){
        setTimeout(() => {
            // console.log(document.activeElement)
            if(document.activeElement !== menuBtn.current){
                setOpen(false)  
            }
        }, 0)
        
    }

    useEffect(() => {
        if(open){
            // console.log('focus')
            // console.log(sidePaneRef.current)
            sidePaneRef.current?.focus()
        }
    }, [open])

    return (
        <SidePaneContext.Provider value={{open: open, setOpen: setOpen}}>

        <div className='sp-menu-icon' onClick = {menuClick} ref = {menuBtn} tabIndex={0}>
            <span class="material-symbols-outlined">
                menu
            </span>
        </div>

        <CSSTransition in={open} timeout={500} classNames="sp" unmountOnExit>
        <div className='sidePane' ref = {sidePaneRef} onBlur = {onBlur} tabIndex={0}>

            <SidePaneElement url = '/' text = 'Home'/>

            <SidePaneElement url = '/addCategory' text = 'Add Category'/>

            <SidePaneElement url = '/editCategory' text = 'Edit Category'/>

            <SidePaneElement url = '/addExpenses' text = 'Add Expenses'/>

            <SidePaneElement url = '' text = 'Sign Out'/>

        </div>
        </CSSTransition>
        <Outlet/>

        </SidePaneContext.Provider>
        
    )
}

function SidePaneElement({url, text}){

    const {setDialogBox, resetDialogBox} = useContext(DialogBoxContext)
    const {auth, setAuth} = useContext(AuthContext)
    const {setOpen} = useContext(SidePaneContext)
    const navigate = useNavigate()

    function onClick(){
        if(!url){
            axios.post('/api/auth/signout', {withCredentials: true})
            .then(res => {
                resetDialogBox()
                setAuth(false)
                setOpen(false)
                // window.location.reload()
            })
            .catch(err => {
                setDialogBox(prev => ({msg: 'Something went wrong. Please try again later.', spinner: false, show: true, confirm: resetDialogBox}))
                console.log(err)
            })
            setDialogBox(prev => ({msg: 'Signing Out...', spinner: true, show: true}))

        } else {
            // window.location.href = url
            navigate(url)
            setOpen(false)
        }
    }

    return(
        <div className='sp-el' onClick = {onClick} >
            {/* <Link to = {url}>{text}</Link> */}
            {text}
        </div>
    )
}