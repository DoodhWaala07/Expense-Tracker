import './filterPane.css'
import {useEffect, useState, useRef, useContext, createContext} from 'react'
import {CSSTransition} from 'react-transition-group'
import axios from 'axios'
import { DialogBoxContext } from '../../../Global/DialogBox';
import { BrowserRouter, Route, Link, redirect, Outlet, useNavigate } from 'react-router-dom';
import MyForm from '../../../Global/Form/MyForm';
import InputField from '../../../Global/InputField';

export const FilterPaneContext = createContext()

export default function FilterPane() {

    const [open, setOpen] = useState(true)
    const sidePaneRef = useRef()
    const menuBtn = useRef()

    const defaultCategoryFields = {
        'Category': {value: '', placeholder: '', type: 'select', ref: {}, req: true, api: '/api/category'},
        // 'Sub_Category': {value: '', placeholder: 'Sub-Category', type: 'select', ref: {}, req: true, disabled: true, api: '/api/subcategory'},
    }

    const [categoryFields, setCategoryFields] = useState(defaultCategoryFields)

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
            {/* <div>Filter</div> */}

            {/* <SidePaneElement url = '/' text = 'Home'/>

            <SidePaneElement url = '/addCategory' text = 'Add Category'/>

            <SidePaneElement url = '/editCategory' text = 'Edit Category'/>

            <SidePaneElement url = '/addExpenses' text = 'Add Expenses'/>

            <SidePaneElement url = '' text = 'Sign Out'/> */}

            <FilterPaneElement url = '/addCategory' text = 'Category'>
                <MyForm fields = {categoryFields} setFields = {setCategoryFields}>
                    {Object.entries(categoryFields).map(([key, field], i) => {
                        return <InputField key = {i} id = {key} label = {field.label || key} placeholder = {field.label || field.placeholder || key} 
                        type = {field.type} ref = {field.ref} error={field.error} className={field.className}/>
                    })}
                </MyForm>
            </FilterPaneElement>

            <FilterPaneElement url = '/addCategory' text = 'Category'>
                <MyForm fields = {categoryFields} setFields = {setCategoryFields}>
                    {Object.entries(categoryFields).map(([key, field], i) => {
                        return <InputField key = {i} id = {key} label = {field.label || key} placeholder = {field.label || field.placeholder || key} 
                        type = {field.type} ref = {field.ref} error={field.error} className={field.className}/>
                    })}
                </MyForm>
            </FilterPaneElement>

        </div>
        </CSSTransition>
        <Outlet/>

        </FilterPaneContext.Provider>
        
    )
}

function FilterPaneElement({url, text, children}) {

    const {setOpen} = useContext(FilterPaneContext)

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


            <div className='fp-el-content-wrapper'>
                <CSSTransition in={openEl} timeout={500} classNames="fp-el-content" unmountOnExit>
                    <div className='fp-el-content'>
                        {children}
                    </div>
                </CSSTransition>
            </div>
        </div>
    )
}