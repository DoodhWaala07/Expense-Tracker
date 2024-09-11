import './auth.css'
import '../../Global/inputFields.css'
import MyForm from '../../Global/Form/MyForm'
import { useState, useEffect } from 'react'
import InputField from '../../Global/InputField'

export default function Authentication() {
    const [authType, setAuthType] = useState('login')
    
    return(
        <>
            {authType === 'login' && <SignIn setAuthType={setAuthType}/>}
            {authType === 'signup' && <SignUp setAuthType={setAuthType}/>}
        </>
        
    )
}

function SignUp({setAuthType}) {
    const defaultSignUpFields = {
        'Username': {value: '', placeholder: '', type: 'text', ref: {}, req: true, error: ''},
        'Password': {value: '', placeholder: '', type: 'password', ref: {}, req: true},
        'Confirm_Password': {value: '', placeholder: '', type: 'password', ref: {}, req: true,},
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

    return (
        <div className="auth-main">
            <h1>Sign Up</h1>
            <MyForm fields={signUpFields} setFields={setSignUpFields}>
                {Object.entries(signUpFields).map(([key, field]) => <InputField label={field.label || key} placeholder={field.placeholder || field.label || key} id={key} type={field.type} error={field.error} />)}
            </MyForm>
            <p className='msg-p' onClick={() => setAuthType('login')}>Already have an account? Sign In.</p>
            <button className='btn authBtn'>Sign Up</button>
        </div>
    )
}

function SignIn({setAuthType}) {
    const defaultSignInFields = {
        'Username': {value: '', placeholder: '', type: 'text', ref: {}, req: true, error: ''},
        'Password': {value: '', placeholder: '', type: 'password', ref: {}, req: true},
    }
    const [signInFields, setSignInFields] = useState(defaultSignInFields)

    return (
        <div className="auth-main">
            <h1>Sign In</h1>
            <MyForm fields={signInFields} setFields={setSignInFields}>
                {Object.entries(signInFields).map(([key, field]) => <InputField label={field.label || key} placeholder={field.placeholder || field.label || key} id={key} type={field.type} error={field.error} />)}
            </MyForm>
            <p className='msg-p' onClick={() => setAuthType('signup')}>New User? Sign Up.</p>
            <button className='btn authBtn'>Sign In</button>
        </div>
    )
}