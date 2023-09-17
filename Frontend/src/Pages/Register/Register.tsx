import Input from '../../Components/Inputs/Input'
import Button from '../../Components/Buttons/Button'
import { useState } from "react";
import './Register.css'
import Logo from '../../Images/logo.png'

const Register = () => {

    //Consts
    const [userName, setUserName] = useState("");
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    //Handlers
    const handlerUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
    };

    const handleUser = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser(e.target.value);
    };

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setConfirmPassword(e.target.value)
    };

    //checks
    const checkUserName = () => {
        const userNameRegex = /(.)+/;
        return !userNameRegex.test(userName);
    };

    const checkUser = () => {
        const userRegex = /(a)+/;
        return !userRegex.test(user);
    };

    const checkPassword = () => {
        const passwordRegex = /(.){7}/;
        return !passwordRegex.test(password);
    };

    

    //functions
    const validateUserPass = () => {
        if (checkUser() === false && checkPassword() === false && checkUserName() === false && password === confirmPassword) {
            return false;
        } else {
            return true
        }
    };


    //tsx
    return <>
        <div className='register-container'>
            <div className='left'>
                <img className="logo" src={Logo} alt="Page Logo" />
            </div>
            <div className='right'>
                <div className='title-container'><span >Lo que está pasando ahora</span></div>
                <div className='subtitle-container'><span >Crea tu cuenta !</span></div>

                <div className="register-input">
                    <Input
                        type='text'
                        name='Nombre *'
                        placeholder='Nombre'
                        onChange={handlerUserName}
                        value={userName} />
                    <Input
                        type='text'
                        name='Usuario *'
                        placeholder='Usuario'
                        onChange={handleUser}
                        value={user} />

                    <Input
                        type='password'
                        name='Contraseña *'
                        placeholder='Contraseña'
                        onChange={handlePassword}
                        value={password} />

                    <Input
                        type='password'
                        name='Confirmar contraseña *'
                        placeholder='Contraseña'
                        onChange={handleConfirmPassword}
                        value={confirmPassword} />

                    <Button disable={(validateUserPass())} placeHolder={"Crear cuenta"} page={'/'} type={3} name={userName} user={user} password={password}/>

                </div>
            </div>


        </div>

    </>
}


export default Register;