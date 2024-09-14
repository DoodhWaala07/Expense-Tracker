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

export default function SignUp() {

    const {dialogBox, setDialogBox, resetDialogBox} = useContext(DialogBoxContext)

    const {otpMetaData, setOtpMetaData} = useContext(AuthenticationContext)

    const {setAuthType} = useContext(AuthenticationContext)

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

    function validatePassword(e){
        let password = e.target.value
        if(password){

        let hasEight = password.length >= 8
        // Check for letters
        const hasLetter = /[a-zA-Z]/.test(password);
        // Check for numbers
        const hasNumber = /\d/.test(password);
        // Check for special characters
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const basicError = 'Password must contain at least '
        let error = ''

        let checks = [hasEight, hasLetter, hasNumber, hasSpecialChar]
        let errorMsgs = ['8 characters', 'one letter', 'one number', 'one special character']

        checks.forEach((check, index) => {
            if(!check){
                let dummy = error ? error += ', ' + errorMsgs[index] : error = basicError + errorMsgs[index]               
            }
        })

        const lastCommaIndex = error.lastIndexOf(',');

        console.log('Last Comma Index: ' + lastCommaIndex)
        if(lastCommaIndex !== -1){
            error = error.substring(0, lastCommaIndex) + ' and' + error.substring(lastCommaIndex + 1)
        }

        if(error){
            error = error + '.'
        }

        console.log('Password Check')
        console.log(error)

        setSignUpFields(prev => {
            return {...prev, 'Password': {...prev['Password'], error: error}}
        })
    }
    }
    const defaultSignUpFields = {
        'Email': {value: '', placeholder: '', type: 'text', ref: {}, req: true, error: ''},
        'Username': {value: '', placeholder: '', type: 'text', ref: {}, req: true, error: '', onBlur: validateUsername},
        'Password': {value: '', placeholder: '', type: 'password', ref: {}, req: true, onBlur: validatePassword},
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
            setDialogBox(prev => {
                return {...prev, show: false}
            })
            setAuthType(prev => 'otp')
            setOtpMetaData(prev => {
                return {...prev, email: signUpFields['Email'].value, userId: res.data.userId, api: '/api/auth/checkSignUpOTP'}
            })
        })
        .catch(err => {
            console.log(err)
            if(err.status === 409){
                setSignUpFields(prev => {
                    return {...prev, ['Email']: {...prev['Email'], error: 'Email is already in use.'}}
                })
                resetDialogBox()
            }
            if(err.status === 500){
                setDialogBox(prev => {
                    return {...prev, show: true, msg: 'Something went wrong. Please try again later', type: 'error', confirm: resetDialogBox}
                })
            }
        })
        setDialogBox(prev => {
            return {...prev, show: true, spinner: true, msg: 'Please Wait...'}
        })
    }

    return (
        <div className="auth-main">
            <h1>Sign Up</h1>
            <MyForm fields={signUpFields} setFields={setSignUpFields}>
                {Object.entries(signUpFields).map(([key, field]) => <InputField label={field.label || key} placeholder={field.placeholder || field.label || key} id={key} type={field.type} error={field.error} />)}
            </MyForm>
            <p className='msg-p' onClick={() => setAuthType('signin')}>Already have an account? Sign In.</p>
            <button className='btn authBtn' onClick={signUp}>Sign Up</button>
        </div>
    )
}