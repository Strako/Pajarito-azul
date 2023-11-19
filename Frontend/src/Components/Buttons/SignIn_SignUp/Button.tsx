import './Button.css'
import { useNavigate } from "react-router-dom";
import signUp from "../../../API/Register"
import signIn from "../../../API/Login"
import { notification } from 'antd'



interface buttonProps {
    disable: boolean
    placeHolder: string;
    page: string;
    type: number;
    user?: string;
    name?: string;
    password?: string;
    setLogoClassName?: React.Dispatch<React.SetStateAction<string>>
}
//type:
//1 login (Call EP)
//2 navigate create account
//3 create account (Call EP)

const Button = ({ disable, placeHolder, page, type, user, name, password, setLogoClassName }: buttonProps) => {
    //cosntants
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (title: string, message: string, type: string, time?: number) => {
        api.open({
            message: title,
            description: message,
            duration: time == null ? 1.5 : time,
            className: type == "error" ? "notification-error" : "notification",
            style: { backgroundColor: type == "error" ? "#d39999" : "rgb(26, 150, 244)" }

        });
    };

    const handleButton = async () => {
        if (type === 1 && setLogoClassName) {
            signIn(user!, password!).then((r) => {
                const authToken = r.data.auth_token;
                sessionStorage.setItem('auth_token', authToken);
                openNotification("Inicio de sesión exitoso: ", r.data.message, "success")
                setLogoClassName("logo_transition");
                setTimeout(() => {
                    navigate(page);
                    window.scrollTo(0, 0);
                }, 2000);
            }).catch((error) => {
                openNotification("Datos inválidos: ", String(error.response.data.message), "error", 3)
                console.error(error.response.data.message);
            })

        } if (type === 2) {
            navigate(page);

        } if (type === 3) {
            //Crear cuenta
            signUp(name!, user!, password!).then((r) => {
                openNotification("Cuenta creada exitosamente: ", r.data.message, "success")
                setTimeout(() => {
                    navigate(page);
                    window.scrollTo(0, 0);
                }, 2000);
            }).catch((error) => {
                openNotification("Datos inválidos: ", String(error.response.data.message), "error", 3)
                console.error(error.response.data.message);
            })



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