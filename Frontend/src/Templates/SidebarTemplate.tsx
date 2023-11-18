import { useState } from 'react';
import { HomeOutlined, SearchOutlined, BellOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useNavigate } from "react-router-dom";
import { notification, Modal, Input } from 'antd'
import createTweet from '../API/CreateTweet';
import './SidebarTemplate.css'

interface SidebarTemplateI {
    children: React.ReactNode,
    handleRefresh?: () => void;
}

const SidebarTemplate = ({ children, handleRefresh }: SidebarTemplateI) => {
    const [api, contextHolder] = notification.useNotification();
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [tweet, setTweet] = useState("")
    
    const navigate = useNavigate();

    const handleTweet = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTweet(e.target.value);
        console.log(tweet);
    }

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        if(handleRefresh){
        setConfirmLoading(true);
        setTimeout(() => {
            createTweet(tweet).then(() => {
                setOpen(false);
                setConfirmLoading(false);
                handleRefresh();
            })
        
        },500);
    }else{
        setConfirmLoading(true);
        setTimeout(() => {
            createTweet(tweet).then(() => {
                setOpen(false);
                setConfirmLoading(false);
            })        
        },500);

    }
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    const openNotification = (title: string, message: string, type: string, time?: number) => {
        api.open({
            message: title,
            description: message,
            duration: time == null ? 1.5 : time,
            className: type == "error" ? "notification-error" : "notification",
            style: { backgroundColor: type == "error" ? "#d39999" : "rgb(26, 150, 244)" }

        });
    }

    const logout = () => {
        console.log("logout")
        sessionStorage.removeItem("auth_token");
        openNotification("Sesión cerrada exitosamente", "Hasta luego !", "success")
        setTimeout(() => {
            navigate('/');
            window.scrollTo(0, 0);
        }, 2000);
    }

    return (
        <>
            {contextHolder}
            <div className="sidebar_container">
                <div className="sidebar">
                    <div className="sidebar_content">
                        <div className="logo_sidebar">
                            <br></br>
                        </div>
                        <div className="sidebar_item">
                            <HomeOutlined /> Home
                        </div>
                        <div className="sidebar_item" onClick={() => navigate("/search")}>
                            <SearchOutlined /> Explore
                        </div>
                        <div className="sidebar_item">
                            <BellOutlined /> Notifications
                        </div>
                        <div className="sidebar_item" onClick={() => navigate("/profile")}>
                            <UserOutlined /> Profle
                        </div>
                        <div className="tweet_button" onClick={() => {
                            showModal();
                        }
                        }>
                            Post
                        </div>
                        <div className="sidebar_logout" onClick={logout}>
                            <LogoutOutlined /> Log out
                        </div>
                    </div>
                </div>

                <div className="body_container">
                    <div className="body">{children}</div>
                </div>

                <div className="left_container">
                </div>
            </div>

            <Modal
                title="Create Tweet"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                
            >
                <Input placeholder="Write Tweet" onChange={handleTweet} />
            </Modal>
        </>
    )
}

export default SidebarTemplate;

