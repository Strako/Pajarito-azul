import './Button.css'
import { useNavigate } from "react-router-dom";
import signUp from "../../API/Register"
import signIn from "../../API/Login"


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
    const navigate = useNavigate();
    const handleButton = async () => {

        if (type === 1) {
            signIn(user!, password!).then(async(r) =>{
                console.log(r.data);
                sessionStorage.setItem('auth_token', await r.data.auth_token)
                navigate(page);
                window.scrollTo(0, 0);
            }).catch((e) =>{
                console.log(e);
            });

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
        <div className="button-container">
            <button className="button-icon" disabled={disable} onClick={handleButton}>{placeHolder}</button>
        </div>
    );
};

export default Button;