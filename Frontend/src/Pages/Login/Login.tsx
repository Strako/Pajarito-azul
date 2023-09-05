import Input from '../../Components/Inputs/Input'
import  Button from '../../Components/Buttons/Button'
import { useState } from "react";
import './Login.css'
import Logo from '../../Images/logo.png'

const Login = () => {

//Consts

const [user, setUser] = useState("");
const [password, setPassword] = useState("");

//Handlers

const handleUser = (e: React.ChangeEvent<HTMLInputElement>)  =>{
    setUser(e.target.value);
}

const handlePassword = (e: React.ChangeEvent<HTMLInputElement>)  =>{
    setPassword(e.target.value);
}

//checks

const checkPassword = () => {
    const passwordRegex = /(.){7}/;
    return !passwordRegex.test(password);
};

    return <>
        <div className='login-container'>
            <div className='left'>
            <img className="logo" src={Logo} alt="Page Logo" />
            </div>
            <div className='right'>
            <div className = 'title-container'><span >Lo que está pasando ahora</span></div>
            <div className = 'subtitle-container'><span >Únete Hoy</span></div>
            
            <div className="login-input">
                <Input
                    type='email'
                    name='Usuario'
                    placeholder='Email'
                    onChange={handleUser}
                    value={user} />

                <Input
                    type='password'
                    name='Contraseña'
                    placeholder='Password'
                    onChange={handlePassword}
                    value={password} />

                <Button disable={checkPassword()}/>
            </div>
            </div>

            
        </div>
    
    </>
}


export default Login;