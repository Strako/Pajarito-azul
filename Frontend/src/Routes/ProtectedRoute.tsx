import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoute = () =>{
    if(localStorage.getItem("auth_token") === null){
        return <Navigate to="/"/>
    }else{
    return <Outlet/>
    }
 }

export default ProtectedRoute;