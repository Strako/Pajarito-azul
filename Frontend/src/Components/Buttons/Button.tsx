import './Button.css'
import { useNavigate } from "react-router-dom";
import { guestSession } from "../../API/guestSession";

interface buttonProps {
    disable: boolean
    placeHolder: string;
    page: string;
    type: number;
}
//type:
//1 login (Call EP)
//2 navigate create account
//3 create account (Call EP)

const Button = ({ disable, placeHolder, page, type }: buttonProps) => {
    const navigate = useNavigate();
    const handleButton = async () => {
        
        if(type === 1){
        sessionStorage.setItem('token', 'mi_token_temporal')
        navigate(page);
        window.scrollTo(0, 0);
        }if(type===2){
            navigate(page);
        }if(type === 3){
            //Crear cuenta
            navigate(page);
        }
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
            <button className="button-icon" disabled={disable} onClick={handleButton}>{placeHolder}</button>
        </div>
    );
};

export default Button;