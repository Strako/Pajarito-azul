import './Button.css'
import { useNavigate } from "react-router-dom";
import signUp from "../../API/Register"
import signIn from "../../API/Login"
import { setAuthToken } from '../../API/BaseAPI';
import { useState } from 'react';


interface buttonProps {
    disable: boolean
    placeHolder: string;
    page: string;
    type: number;
    user?: string;
    name?: string;
    password?: string;
}
//type:
//1 login (Call EP)
//2 navigate create account
//3 create account (Call EP)

const Button = ({ disable, placeHolder, page, type, user, name, password }: buttonProps) => {
    //cosntants
    const [invalidLogin, setInvalidLogin] = useState<boolean>(false);
    const navigate = useNavigate();

    //functions
    const handleErrorLogin = () => {
        if (invalidLogin) {
            return (
                    <div className="invalid_login">
                        Invalid login
                    </div>
            )
        }
    }

    const handleButton = async () => {
        if (type === 1) {
            try {
                const response = await signIn(user!, password!);
                    setInvalidLogin(false);
                    const authToken = response.data.auth_token;
                    await sessionStorage.setItem('auth_token', authToken);
                    setTimeout(() => {
                        setAuthToken(authToken);
                    }, 100);
                    navigate(page);
                    window.scrollTo(0, 0);

            } catch (error) {
                setInvalidLogin(true);
                console.error(error);
            }

        } if (type === 2) {
            navigate(page);

        } if (type === 3) {
            //Crear cuenta
            signUp(name!, user!, password!)
            console.log(name, user, password)
            navigate(page);
        }

    }
    return (
        <>
        {handleErrorLogin()}
        <div className="button-container">
            <button className="button-icon" disabled={disable} onClick={handleButton}>{placeHolder}</button>
        </div>
        </>
    );
};

export default Button;