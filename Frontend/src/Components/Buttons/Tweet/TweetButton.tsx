import './TweetButton.css'
import { useNavigate } from "react-router-dom";
import {  notification } from 'antd'


interface buttonProps {
    disable: boolean
    placeHolder: string;
}

const Button = ({ disable, placeHolder}: buttonProps) => {
    //cosntants



    const handleButton = async () => {

    }

    return (
        <>
            <div className="button-container">
                <button className="button-icon" disabled={disable} onClick={handleButton}>{placeHolder}</button>
            </div>
        </>
    );
};

export default Button;