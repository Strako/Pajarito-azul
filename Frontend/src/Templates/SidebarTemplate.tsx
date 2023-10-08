import { HomeOutlined, SearchOutlined, BellOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useNavigate } from "react-router-dom";
import { notification } from 'antd'
import './SidebarTemplate.css'


interface SidebarTemplateI {
    children: React.ReactNode
}

const SidebarTemplate = ({ children }: SidebarTemplateI) => {
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (title: string, message: string, type: string, time?: number) => {
        api.open({
            message: title,
            description: message,
            duration: time == null ? 1.5 : time,
            className: type == "error" ? "notification-error" : "notification",
            style: { backgroundColor: type == "error" ? "#d39999" : "rgb(26, 150, 244)" }

        });
    }
    const navigate = useNavigate();

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
                        <div className="sidebar_item">
                            <SearchOutlined /> Explore
                        </div>
                        <div className="sidebar_item">
                            <BellOutlined /> Notifications
                        </div>
                        <div className="sidebar_item">
                            <UserOutlined /> Profle
                        </div>
                        <div className="tweet_button">
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
        </>
    )
}

export default SidebarTemplate;

