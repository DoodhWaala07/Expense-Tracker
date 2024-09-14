import { createContext, useState } from 'react'

export const AuthContext = createContext()

export default function Authenticator({children}) {
    const [auth, setAuth] = useState('loading')

    console.log('AuthFromAuthenticator: ' + auth)

    return (
        <AuthContext.Provider value={{auth: auth, setAuth: setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}