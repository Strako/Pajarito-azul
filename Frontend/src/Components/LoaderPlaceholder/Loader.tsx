import Spin from "antd/es/spin"
import { LoadingOutlined } from '@ant-design/icons';
import SidebarTemplate from "../../Templates/SidebarTemplate"

const loaderPlaceholder = () =>{
    const antIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;

    return (
        <>
            <SidebarTemplate>
                <div className="spin_loader">
                    <Spin indicator={antIcon} />
                </div>
            </SidebarTemplate>
        </>
    )
}
export default loaderPlaceholder;