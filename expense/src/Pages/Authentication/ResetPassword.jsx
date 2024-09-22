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
import { useParams } from 'react-router'
import { useNavigate } from 'react-router'


export default function ResetPassword() {

    const {dialogBox, setDialogBox, resetDialogBox} = useContext(DialogBoxContext)

    const {otpMetaData, setOtpMetaData} = useContext(AuthenticationContext)

    const {setAuthType} = useContext(AuthenticationContext)

    const {token} = useParams()

    const navigate = useNavigate()

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
        'Password': {value: '', placeholder: 'New Password', type: 'password', ref: {}, req: true},
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


    function resetPassword(){
        if(Object.keys(validateEmptyFields(signUpFields, setSignUpFields)).length > 0){
            return null
        }
        axios.post('/api/auth/resetPassword', {...formatData(signUpFields), token: token})
        .then(res => {
            console.log(res.data)
            setDialogBox(prev => {
                return {...prev, show: true, msg: 'Password Reset Successful. Please Sign In.', spinner: false, confirm: () => {resetDialogBox(); navigate('/')}}
            })
        })
        .catch(err => {
            console.log(err)
            if(err.status === 404){
                setDialogBox(prev => {
                    return {...prev, show: true, msg: 'This link is not valid or has expired. Please request a new one.', spinner: false, confirm: () => {resetDialogBox(); setAuthType('forgotPassword')}}
                })
            }
            if(err.status === 500){
                setDialogBox(prev => {
                    return {...prev, show: true, msg: 'Something went wrong. Please try again later', type: 'error', spinner: false, confirm: resetDialogBox}
                })
            }
        })
        setDialogBox(prev => {
            return {...prev, show: true, spinner: true, msg: 'Please Wait...'}
        })
    }

    return (
        <div className="auth-main">
            <h1>Reset Password</h1>
            <MyForm fields={signUpFields} setFields={setSignUpFields}>
                {Object.entries(signUpFields).map(([key, field]) => <InputField label={field.label || key} placeholder={field.placeholder || field.label || key} id={key} type={field.type} error={field.error} />)}
            </MyForm>
            <p className='msg-p' onClick={() => setAuthType('signin')}>Already have an account? Sign In.</p>
            <button className='btn authBtn' onClick={resetPassword}>Change Password</button>
        </div>
    )
}