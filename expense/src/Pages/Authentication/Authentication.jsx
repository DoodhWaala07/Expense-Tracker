import './auth.css'
import '../../Global/inputFields.css'
import MyForm from '../../Global/Form/MyForm'
import { useState, useEffect, createContext, useContext } from 'react'
import InputField from '../../Global/InputField'
import { validateEmptyFields } from '../../Global/Functions/validation'
import axios from 'axios'
import formatData from '../../Global/Functions/formatData'
import { DialogBoxContext } from '../../Global/DialogBox'

const AuthenticationContext = createContext()

export default function Authentication() {
    const [authType, setAuthType] = useState('login')

    const [otpMetaData, setOtpMetaData] = useState({email: '', otp: '', api: ''})
    
    return(
        <>
        <AuthenticationContext.Provider value={{authType, setAuthType, otpMetaData, setOtpMetaData}}>
            {authType === 'login' && <SignIn setAuthType={setAuthType}/>}
            {authType === 'signup' && <SignUp setAuthType={setAuthType}/>}
            {authType === 'otp' && <OTP setAuthType={setAuthType} />}
        </AuthenticationContext.Provider>
        </>
        
    )
}

function SignUp({setAuthType}) {

    const {dialogBox, setDialogBox, resetDialogBox} = useContext(DialogBoxContext)

    const {otpMetaData, setOtpMetaData} = useContext(AuthenticationContext)

    function validateUsername(e){
        console.log(e.target.value)
        axios.get('/api/auth/checkUsername', {params: {'username': e.target.value}})
        .then(res => {
            if(res.data.length > 0){
                setSignUpFields(prev => {
                    return {...prev, 'Username': {...prev['Username'], error: 'Username already exists'}}
                })
            }
        })
        .catch(err => {
            console.log(err)
        })
    }
    const defaultSignUpFields = {
        'Email': {value: '', placeholder: '', type: 'text', ref: {}, req: true, error: ''},
        'Username': {value: '', placeholder: '', type: 'text', ref: {}, req: true, error: '', onBlur: validateUsername},
        'Password': {value: '', placeholder: '', type: 'password', ref: {}, req: true},
        'Confirm_Password': {value: '', placeholder: 'Confirm Password', type: 'password', ref: {}, req: true,},
    }
    const [signUpFields, setSignUpFields] = useState(defaultSignUpFields)

    useEffect(() => {
        let password = signUpFields['Password'].value
        let confirmPassword = signUpFields['Confirm_Password'].value

        if (password !== confirmPassword && password !== '' && confirmPassword !== '') {
            setSignUpFields(prev => {
                return {...prev, 'Confirm_Password': {...prev['Confirm_Password'], error: 'Passwords do not match.'}}
            })
        }

        if (password === confirmPassword) {
            setSignUpFields(prev => {
                return {...prev, 'Confirm_Password': {...prev['Confirm_Password'], error: ''}}
            })
        }

    }, [signUpFields['Password'].value, signUpFields['Confirm_Password'].value])

    useEffect(() => {
        
    }, [signUpFields['Username'].value])
    

    function signUp(){
        if(Object.keys(validateEmptyFields(signUpFields, setSignUpFields)).length > 0){
            return null
        }
        axios.post('/api/auth/signup', formatData(signUpFields))
        .then(res => {
            console.log(res.data)
            setAuthType(prev => 'otp')
            setOtpMetaData(prev => {
                return {...prev, email: signUpFields['Email'].value}
            })
        })
        .catch(err => {
            console.log(err)
            if(err.status === 409){
                setSignUpFields(prev => {
                    return {...prev, ['Email']: {...prev['Email'], error: 'Email is already in use.'}}
                })
            }
            if(err.status === 500){
                setDialogBox(prev => {
                    return {...prev, show: true, msg: 'Something went wrong. Please try again later', type: 'error', confirm: resetDialogBox}
                })
            }
        })
    }

    return (
        <div className="auth-main">
            <h1>Sign Up</h1>
            <MyForm fields={signUpFields} setFields={setSignUpFields}>
                {Object.entries(signUpFields).map(([key, field]) => <InputField label={field.label || key} placeholder={field.placeholder || field.label || key} id={key} type={field.type} error={field.error} />)}
            </MyForm>
            <p className='msg-p' onClick={() => setAuthType('login')}>Already have an account? Sign In.</p>
            <button className='btn authBtn' onClick={signUp}>Sign Up</button>
        </div>
    )
}

function SignIn({setAuthType}) {
    const defaultSignInFields = {
        'Username': {value: '', placeholder: '', type: 'text', ref: {}, req: true, error: ''},
        'Password': {value: '', placeholder: '', type: 'password', ref: {}, req: true},
    }
    const [signInFields, setSignInFields] = useState(defaultSignInFields)

    function signIn(){
        if(validateEmptyFields(signInFields, setSignInFields).length > 0){
            return null
        }
        axios.post('/api/auth/signin', formatData(signInFields), {withCredentials: true})
    }

    return (
        <div className="auth-main">
            <h1>Sign In</h1>
            <MyForm fields={signInFields} setFields={setSignInFields}>
                {Object.entries(signInFields).map(([key, field]) => <InputField label={field.label || key} placeholder={field.placeholder || field.label || key} id={key} type={field.type} error={field.error} />)}
            </MyForm>
            <p className='msg-p' onClick={() => setAuthType('signup')}>New User? Sign Up.</p>
            <button className='btn authBtn' onClick={signIn}>Sign In</button>
        </div>
    )
}

function OTP({setAuthType}) {
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
        axios.post('/api/auth/checkOtp', {...formatData(otpFields), Email: otpMetaData.email})
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