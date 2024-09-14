import './auth.css'
import SignIn from './SignIn'
import '../../Global/inputFields.css'
import MyForm from '../../Global/Form/MyForm'
import { useState, useEffect, createContext, useContext } from 'react'
import InputField from '../../Global/InputField'
import { validateEmptyFields } from '../../Global/Functions/validation'
import axios from 'axios'
import formatData from '../../Global/Functions/formatData'
import { DialogBoxContext } from '../../Global/DialogBox'
import { AuthenticationContext } from './Authentication'


export default function OTP() {

    const defaultOTPFields = {
        'OTP': {value: '', placeholder: '', type: 'number', ref: {}, req: true, error: ''},
    }
    
    const [otpFields, setOtpFields] = useState(defaultOTPFields)

    const {otpMetaData} = useContext(AuthenticationContext)

    const {setDialogBox, resetDialogBox} = useContext(DialogBoxContext)

    function submitOTP(){
        if(validateEmptyFields(otpFields, setOtpFields).length > 0){
            return null
        }
        axios.post(otpMetaData.api, {...formatData(otpFields), Email: otpMetaData.email, userId: otpMetaData.userId})
        .then(res => {
            window.location.href = '/'
        })
        .catch(err => {
            console.log('OTP ERROR')
            if(err.status === 500){
                setDialogBox(prev => {
                    return {...prev, show: true, msg: 'Something went wrong with the OTP. Please try again later', type: 'error', confirm: resetDialogBox}
                })
            }
            if(err.status === 404){
                setOtpFields(prev => {
                    return {...prev, ['OTP']: {...prev['OTP'], error: 'Invalid OTP'}}
                })
            }
        })
    }
    return(
        <div className='auth-main'>
            <h1>OTP</h1>
            <MyForm fields={otpFields} setFields={setOtpFields}>
                {Object.entries(otpFields).map(([key, field]) => <InputField label={field.label || key} placeholder={field.placeholder || field.label || key} id={key} type={field.type} error={field.error} />)}
            </MyForm>
            <button className='btn authBtn' onClick={submitOTP}>Submit</button>
        </div>
    )
}