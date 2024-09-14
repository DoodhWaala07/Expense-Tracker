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
import SignUp from './SignUp'
import OTP from './OTP'

export const AuthenticationContext = createContext()

export default function Authentication() {
    const [authType, setAuthType] = useState('signin')

    const [otpMetaData, setOtpMetaData] = useState({email: '', otp: '', api: ''})

    useEffect(() => {
        console.log(authType)
    }, [authType])
    
    return(
        <>
        <AuthenticationContext.Provider value={{authType, setAuthType, otpMetaData, setOtpMetaData}}>
            {authType === 'signin' && <SignIn/>}
            {authType === 'signup' && <SignUp/>}
            {authType === 'otp' && <OTP/>}
        </AuthenticationContext.Provider>
        </>
    )
}
