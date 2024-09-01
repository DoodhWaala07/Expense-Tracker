
import { createContext, useState } from 'react'
import './dialogBox.css'
import Spinner from './Spinner'

export default function DialogBox({children, msg = '', confirm = null, close = null}){
    return(
        <>
        <div className='db-overlay'></div>
        <div className='db-main'>
            <div className='db-msg'>{msg}</div>
            <div className='db-btns-main'>
                {confirm && <button className='btn db-btn' onClick={confirm}>Confirm</button>}
                {close && <button className='btn db-btn cancel-btn' onClick={close}>Cancel</button>}
            </div>
            {children}
        </div>
        </>
    )
}

export const DialogBoxContext = createContext()

export function GlobalDialogBox({children}){
    const [dialogBox, setDialogBox] = useState({msg: '', confirm: null, close: null, show: false, spinner: false})

    function resetDialogBox(){
        setDialogBox(prev => ({msg: '', confirm: null, close: null, show: false}))
    }
    return(
        <DialogBoxContext.Provider value={{dialogBox: dialogBox, setDialogBox: setDialogBox, resetDialogBox: resetDialogBox}}>
        {dialogBox.show && (
        <>
        <div className='db-overlay'></div>
        <div className='db-main'>
            <div className='db-msg'>{dialogBox.msg}</div>
            {dialogBox.spinner && <Spinner/>}
            <div className='db-btns-main'>
                {dialogBox.confirm && <button className='btn db-btn' onClick={dialogBox.confirm || null}>Confirm</button>}
                {dialogBox.close && <button className='btn db-btn cancel-btn' onClick={dialogBox.close || null}>Cancel</button>}
            </div>
        </div>
        </>
        )}
        {children}
        </DialogBoxContext.Provider>
    )
}