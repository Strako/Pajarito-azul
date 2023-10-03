import { Navigate, Outlet } from "react-router-dom"

const PublicRoute = () =>{
    if(localStorage.getItem("auth_token") !== null){
        return <Navigate to="/profile"/>
    }else{
    return <Outlet />    
    } 
}

export default PublicRoute;