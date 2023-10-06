import './Button.css'
import { useNavigate } from "react-router-dom";
import signUp from "../../../API/Register"
import signIn from "../../../API/Login"
import {  notification } from 'antd'



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
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (title: string, message: string, type: string) => {
        api.open({
            message: title,
            description:message,
            duration: 2.0,
            className: type == "error" ? "notification-error" : "notification",
            style: {backgroundColor: type == "error" ? "#d39999" : "rgb(26, 150, 244)"}

        });
    };

    const handleButton = async () => {
        if (type === 1) {
            try {
                const response = await signIn(user!, password!);
                const authToken = response.data.auth_token;
                await sessionStorage.setItem('auth_token', authToken);
                openNotification("Successful login: ", response.data.message, "success")
                setTimeout(() => {
                    navigate(page);
                    window.scrollTo(0, 0);
                }, 2000);

            } catch (error) {
                openNotification("Invalid login: ", String(error), "error")
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
            {contextHolder}
            <div className="button-container">
                <button className="button-icon" disabled={disable} onClick={handleButton}>{placeHolder}</button>
            </div>
        </>
    );
};

export default Button;