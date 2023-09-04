import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoute = () =>{
    if(sessionStorage.getItem("token") === null){
        return <Navigate to="/"/>
    }
    return <Outlet/>
 }

export default ProtectedRoute;