import './Button.css'
import { useNavigate } from "react-router-dom";
import { setAuthToken } from '../../../API/BaseAPI';
import { useState } from 'react';
import { message, notification } from 'antd'
import { CloseOutlined } from '@ant-design/icons';


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
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (title: string, message: string) => {
        api.open({
            message: title,
            description:message,
            duration: 2.0,

        });
    };

    const handleButton = async () => {

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