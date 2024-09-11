import './sidePane.css'
import {useState} from 'react'
// import {navigate} from 'react-router-dom'

export default function SidePane({children}) {

    const [open, setOpen] = useState(false)

    return (
        <>
        <div className='sp-menu-icon' onClick = {() => setOpen(prev => !prev)}>
            <span class="material-symbols-outlined">
                menu
            </span>
        </div>

        {open && (
        <div className='sidePane'>
            {/* {children} */}

            <SidePaneElement url = '/' text = 'Home'/>

            <SidePaneElement url = '/addCategory' text = 'Add Category'/>

            <SidePaneElement url = '/editCategory' text = 'Edit Category'/>

            <SidePaneElement url = '/addExpenses' text = 'Add Expenses'/>

        </div>
        )}
        {children}
        </>
    )
}

function SidePaneElement({url, text}){

    function onClick(){
        window.location.href = url
    }

    return(
        <div className='sp-el' onClick = {onClick} >
            {text}
        </div>
    )
}