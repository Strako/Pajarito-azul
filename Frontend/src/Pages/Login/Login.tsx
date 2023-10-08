import Input from '../../Components/Inputs/Input'
import  Button from '../../Components/Buttons/SignIn_SignUp/Button'
import { useState } from "react";
import Logo from '../../Images/logo.png'
import './Login.css'

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

const checkUser = () =>{
    const userRegex = /(.)+/
    return !userRegex.test(user);
};

//functions
const validateUserPass = () =>{
    if(checkUser() === false && checkPassword() === false){
        return false;
    }else{
        return true
    }
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
                    placeholder='Usuario'
                    onChange={handleUser}
                    value={user} />

                <Input
                    type='password'
                    name='Contraseña'
                    placeholder='Contraseña'
                    onChange={handlePassword}
                    value={password} />

                <Button disable={validateUserPass()} placeHolder={"Iniciar sesión"} page={'/profile'} type={1} user={user} password={password}/>

                <Button disable={false} placeHolder={"Crear cuenta"} page={'/register'} type={2}/>

            </div>
            </div>

            
        </div>
    
    </>
}


export default Login;