import Input from '../../Components/Inputs/Input'
import  Button from '../../Components/Buttons/Button'
import { useState } from "react";
import './Register.css'
import Logo from '../../Images/logo.png'

const Register = () => {

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

//tsx
    return <>
        <div className='register-container'>
            <div className='left'>
            <img className="logo" src={Logo} alt="Page Logo" />
            </div>
            <div className='right'>
            <div className = 'title-container'><span >Lo que está pasando ahora</span></div>
            <div className = 'subtitle-container'><span >Crea tu cuenta !</span></div>
            
            <div className="register-input">
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

                <Button disable={checkPassword()} placeHolder={"Crear cuenta"} page={'/'} type={3}/>

            </div>
            </div>

            
        </div>
    
    </>
}


export default Register;