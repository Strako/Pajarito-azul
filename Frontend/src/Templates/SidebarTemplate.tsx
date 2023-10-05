import './SidebarTemplate.css'

interface SidebarTemplateI {
    children: React.ReactNode
}

const SidebarTemplate = ({ children }: SidebarTemplateI) => {
    return (
        <>
            <div className="sidebar_container">
                <div className="sidebar">
                LOLLOLLOLLOLLOLLOLLOLLOLLOLOLLOLLOLLOLLOLLOLLOLLOLLOLLOLLOLLOLLOL
                </div>

                <div className="body_container">
                    <div className="body">{children}</div>
                </div>
            </div>
        </>
    )
}

export default SidebarTemplate;

