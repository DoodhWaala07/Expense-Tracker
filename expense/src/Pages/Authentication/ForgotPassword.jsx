import './auth.css'
import '../../Global/inputFields.css'
import MyForm from '../../Global/Form/MyForm'
import { useState, useEffect, createContext, useContext } from 'react'
import InputField from '../../Global/InputField'
import { validateEmptyFields } from '../../Global/Functions/validation'
import axios from 'axios'
import formatData from '../../Global/Functions/formatData'
import { DialogBoxContext } from '../../Global/DialogBox'
import { AuthenticationContext } from './Authentication'
import { useNavigate } from 'react-router-dom'

export default function ForgotPassword() {
    const defaultSignInFields = {
        'Email': {value: '', placeholder: '', type: 'text', ref: {}, req: true, error: ''},
    }
    const [signInFields, setSignInFields] = useState(defaultSignInFields)

    const [error, setError] = useState('')

    const {dialogBox, setDialogBox, resetDialogBox} = useContext(DialogBoxContext)

    const {setAuthType} = useContext(AuthenticationContext)

    const navigate = useNavigate()

    function forgotPassword(){
        if(Object.keys(validateEmptyFields(signInFields, setSignInFields)).length > 0){
            return null
        }
        axios.post('/api/auth/forgotPassword', {...formatData(signInFields)}, {withCredentials: true})
        .then(res => {
            resetDialogBox()
            setDialogBox(prev => ({msg: 'Please check your email for further instructions.', spinner: false, show: true, confirm: ()=> {resetDialogBox(); setAuthType('signin')}}))
        })
        .catch(err => {
            // console.log(err)
            // 401 Unauthorized: The request has not been applied because it lacks valid authentication credentials for the target resource.
            if(err.status === 404){
                resetDialogBox()
                console.log(err)
                setError('No user with this email exists. Please create an account.')
            } else {
                setDialogBox(prev => ({msg: 'Something went wrong. Please try again later.', spinner: false, show: true, confirm: resetDialogBox}))
            }
        })
        setDialogBox(prev => ({msg: 'Please Wait...', spinner: true, show: true}))
    }

    function goToSignUp(){
        setAuthType(prev => {
            return 'signup'
        })
    }

    return (
        <div className="auth-main">
            <h1 style={{width: '200%', textAlign: 'center'}}>Forgot Password</h1>
            <MyForm fields={signInFields} setFields={setSignInFields}>
                {Object.entries(signInFields).map(([key, field]) => <InputField label={field.label || key} placeholder={field.placeholder || field.label || key} id={key} type={field.type} error={field.error} />)}
            </MyForm>
            {error && <p className='field-error'>{error}</p>}
            <button className='btn authBtn' onClick={forgotPassword} style={{marginTop: '5px'}}>Submit</button>
            <p className='msg-p' style = {{marginBottom: '0px'}} onClick={() => setAuthType('signup')}>New User? Sign Up.</p>
            <p className='msg-p'  onClick={() => setAuthType('signup')}>Already have an account? Sign In.</p>
        </div>
    )
}