import './Button.css'
import { useNavigate } from "react-router-dom";
import { guestSession } from "../../API/guestSession";

interface buttonProps {
    disable: boolean
}

const Button = ({ disable }: buttonProps) => {
    const navigate = useNavigate();
    const handleLogin = async () => {
        
        sessionStorage.setItem('token', 'mi_token_temporal')
        navigate('/profile');
        window.scrollTo(0, 0);

        //guestSession().then(async (r) => {
            // console.log(r.data)
            // sessionStorage.setItem('token', await r.data.token)
            // navigate('/profile');
            // window.scrollTo(0, 0);

        // }).catch((e) => {
        //    console.log(e);
        // })

    }
    return (
        <div className="button-container">
            <button className="button-icon" disabled={disable} onClick={handleLogin}>Iniciar sesión</button>
        </div>
    );
};

export default Button;