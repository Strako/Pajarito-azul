import './SidebarTemplate.css'

interface SidebarTemplateI {
    children: React.ReactNode
}

const SidebarTemplate = ({ children }: SidebarTemplateI) => {
    return (
        <>
            <div className="sidebar_container">
                <div className="sidebar">
                    <div className="sidebar_content">
                        <div className="sidebar_item">
                            Home
                        </div>
                        <div className="sidebar_item">
                            Explore
                        </div>
                        <div className="sidebar_item">
                            Notifications
                        </div>
                        <div className="sidebar_item">
                            Profle
                        </div>
                        
                    </div>
                </div>

                <div className="body_container">
                    <div className="body">{children}</div>
                </div>
            </div>
        </>
    )
}

export default SidebarTemplate;

