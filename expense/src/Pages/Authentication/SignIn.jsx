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

export default function SignIn() {
    const defaultSignInFields = {
        'Username': {value: '', placeholder: '', type: 'text', ref: {}, req: true, error: ''},
        'Password': {value: '', placeholder: '', type: 'password', ref: {}, req: true},
    }
    const [signInFields, setSignInFields] = useState(defaultSignInFields)

    const [error, setError] = useState('')

    const {dialogBox, setDialogBox, resetDialogBox} = useContext(DialogBoxContext)

    const {setAuthType} = useContext(AuthenticationContext)

    const navigate = useNavigate()

    function signIn(){
        if(Object.keys(validateEmptyFields(signInFields, setSignInFields)).length > 0){
            return null
        }
        let staySignedIn = document.getElementById('staySignedIn').checked
        axios.post('/api/auth/signin', {...formatData(signInFields), staySignedIn: staySignedIn}, {withCredentials: true})
        .then(res => {
            resetDialogBox()
            // window.location.href = '/'
            // navigate(`/addExpenses?refresh=${new Date().getTime()}`)
            setAuthType(true)
            // navigate(0)
            // navigate(url)
        })
        .catch(err => {
            // console.log(err)
            // 401 Unauthorized: The request has not been applied because it lacks valid authentication credentials for the target resource.
            if(err.status === 401){
                setError('Invalid Username or Password')
            } else {
                setDialogBox(prev => ({msg: 'Something went wrong. Please try again later.', spinner: false, show: true, confirm: resetDialogBox}))
            }
        })
        setDialogBox(prev => ({msg: 'Signing In...', spinner: true, show: true}))
    }

    function goToSignUp(){
        setAuthType(prev => {
            return 'signup'
        })
    }

    return (
        <div className="auth-main">
            <h1>Sign In</h1>
            <MyForm fields={signInFields} setFields={setSignInFields}>
                {Object.entries(signInFields).map(([key, field]) => <InputField label={field.label || key} placeholder={field.placeholder || field.label || key} id={key} type={field.type} error={field.error} />)}
            </MyForm>
            {error && <p className='field-error'>{error}</p>}
            <label for="staySignedIn" className='staySignedInLabel' style={{fontSize: 'small', }}>
                <input type="checkbox" id="staySignedIn" name="staySignedIn" className='staySignedIn' ></input>
                Stay Signed In
            </label>

            <p className='msg-p' onClick={() => setAuthType('signup')}>New User? Sign Up.</p>
            <button className='btn authBtn' onClick={signIn}>Sign In</button>
        </div>
    )
}