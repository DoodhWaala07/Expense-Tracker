import './filterPane.css'
import {useEffect, useState, useRef, useContext, createContext} from 'react'
import {CSSTransition} from 'react-transition-group'
import axios from 'axios'
import { DialogBoxContext } from '../../../Global/DialogBox';
import { BrowserRouter, Route, Link, redirect, Outlet, useNavigate } from 'react-router-dom';
import MyForm from '../../../Global/Form/MyForm';
import InputField from '../../../Global/InputField';
import CategoryFilter from './CategoryFilter';
import FilterFloats from './FilterFloats/FilterFloats';

export const FilterPaneContext = createContext()

export default function FilterPane() {

    const [open, setOpen] = useState(true)
    const sidePaneRef = useRef()
    const menuBtn = useRef()

    // const {auth} = useContext(AuthContext)

    function menuClick(e){
        setOpen(prev => {
            return !prev
        })
    }

    function onBlur(e){
        // setTimeout(() => {
        //     // console.log(document.activeElement)
        //     if(document.activeElement !== menuBtn.current){
        //         setOpen(false)  
        //     }
        // }, 0)
        
    }

    useEffect(() => {
        if(open){
            sidePaneRef.current?.focus()
        }
    }, [open])

    return (
        <FilterPaneContext.Provider value={{open: open, setOpen: setOpen}}>
        
        <div className='fp-menu-icon' onClick = {menuClick} ref = {menuBtn} tabIndex={0}>
            <span class="material-symbols-outlined">
                tune
            </span>
        </div>

        <CSSTransition in={open} timeout={500} classNames="fp" unmountOnExit>
        <div className='filterPane' ref = {sidePaneRef} onBlur = {onBlur} tabIndex={0}>

            <h1 style={{marginLeft: '15px'}}>Filters</h1>

            {/* <CategoryFilter/> */}

            <CategoryFilter/>

        </div>
        </CSSTransition>
        <Outlet/>

        </FilterPaneContext.Provider>
        
    )
}

export function FilterPaneElement({url, text, children}) {

    // const {setOpen} = useContext(FilterPaneContext)

    const [openEl, setOpenEl] = useState(false)

    function onClick(e){
        setOpenEl(prev => !prev)
    }

    return(
        <div className='fp-el-wrapper'>
            <div className='fp-el-header' onClick = {onClick} >
                {text}
                <span class="material-symbols-outlined fp-el-icon">
                    {!openEl ? 'keyboard_arrow_right' : 'keyboard_arrow_down'}
                </span>
            </div>

            <CSSTransition in={openEl} timeout={500} classNames="fp-el-content" unmountOnExit>
                <div className='fp-el-content'>
                    {children}
                </div>
            </CSSTransition>
        </div>
    )
}